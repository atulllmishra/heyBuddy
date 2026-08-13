import time
import logging
from celery import Celery
from app.core.config import settings
from app.models.schemas import TaskStatus, PedagogyStyle
from app.services.llm import llm_service
from app.services.tts import tts_service
from app.services.higgsfield import higgsfield_compiler
from app.services.avatar import avatar_service
from app.services.video_gen import video_composer

logger = logging.getLogger(__name__)

celery_app = Celery(
    "media_orchestrator",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# In-memory status fallback store for fast polling
TASK_STORE = {}

@celery_app.task(bind=True)
def run_media_orchestration_pipeline(
    self, 
    task_id: str, 
    lecture_id: str, 
    concept_query: str, 
    pedagogy_style: str = "Feynman", 
    target_language: str = "English",
    persona_avatar: str = "Professor AI Scientist"
):
    """
    Chained Celery Task Pipeline Executing Async States:
    PENDING -> SCRIPT_GENERATING -> AUDIO_SYNTHESIS -> WHITEBOARD_STREAMS_GENERATING -> HIGGSFIELD_VIDEO_COMPILING -> COMPLETED
    """
    def update_task_state(status: TaskStatus, progress: float, description: str, manifest_url=None):
        logger.info(f"[{task_id}] State: {status.value} ({progress}%) - {description}")
        TASK_STORE[task_id] = {
            "task_id": task_id,
            "lecture_id": lecture_id,
            "status": status.value,
            "progress_percentage": progress,
            "current_step_description": description,
            "manifest_url": manifest_url,
            "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }

    try:
        # 1. PENDING & SCRIPT GENERATION
        update_task_state(TaskStatus.SCRIPT_GENERATING, 15.0, f"Compiling {pedagogy_style} prompt script for '{concept_query}'...")
        time.sleep(1) # simulate step execution
        
        style_enum = PedagogyStyle.FEYNMAN
        for s in PedagogyStyle:
            if s.value == pedagogy_style:
                style_enum = s
                break

        script_manifest = llm_service.generate_lecture_manifest(concept_query, style_enum, target_language)

        # 2. AUDIO SYNTHESIS & WORD TIMING ALIGNMENT
        update_task_state(TaskStatus.AUDIO_SYNTHESIS, 40.0, "Synthesizing voice audio with ElevenLabs word timestamp markers...")
        time.sleep(1)
        tts_data = tts_service.synthesize_speech_with_alignment(script_manifest["full_audio_script"])

        # 3. WHITEBOARD STREAMS & VECTOR GENERATION
        update_task_state(TaskStatus.WHITEBOARD_STREAMS_GENERATING, 65.0, "Extracting SVG stroke paths & AI hand writing coordinates...")
        time.sleep(1)

        # 4. HIGGSFIELD MULTI-TURN AI VIDEO COMPILATION
        update_task_state(TaskStatus.HIGGSFIELD_VIDEO_COMPILING, 85.0, "Executing Higgsfield multi-turn video compilation & avatar overlay...")
        time.sleep(1)
        higgsfield_manifest = higgsfield_compiler.compile_multi_turn_video(
            slides=script_manifest["slides"],
            pedagogy_style=pedagogy_style,
            persona_avatar=persona_avatar
        )
        avatar_data = avatar_service.generate_talking_avatar(
            script_text=script_manifest["full_audio_script"],
            audio_url=tts_data["audio_url"],
            persona_avatar=persona_avatar
        )

        # 5. COMPLETED MASTER MANIFEST ASSEMBLY
        master_manifest = video_composer.compose_master_lecture(
            lecture_id=lecture_id,
            script_manifest=script_manifest,
            tts_data=tts_data,
            higgsfield_manifest=higgsfield_manifest,
            avatar_data=avatar_data
        )

        update_task_state(
            TaskStatus.COMPLETED, 
            100.0, 
            "Lecture pipeline execution completed successfully!",
            manifest_url=master_manifest["final_composite_video_url"]
        )

        return master_manifest

    except Exception as e:
        logger.error(f"Error in media orchestration pipeline for task {task_id}: {str(e)}")
        update_task_state(TaskStatus.FAILED, 0.0, f"Pipeline Error: {str(e)}")
        raise e
