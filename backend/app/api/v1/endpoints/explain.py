import uuid
import time
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.schemas import LectureExplainRequest, TaskStatus
from app.tasks.celery_tasks import run_media_orchestration_pipeline, TASK_STORE
from app.services.llm import llm_service
from app.services.tts import tts_service
from app.services.higgsfield import higgsfield_compiler
from app.services.avatar import avatar_service
from app.services.video_gen import video_composer

router = APIRouter()

@router.post("")
def generate_lecture_explanation(request: LectureExplainRequest, background_tasks: BackgroundTasks):
    """
    Triggers the asynchronous media orchestration engine pipeline for a given concept query.
    """
    try:
        task_id = str(uuid.uuid4())
        lecture_id = str(uuid.uuid4())

        # Initialize Task Tracker
        TASK_STORE[task_id] = {
            "task_id": task_id,
            "lecture_id": lecture_id,
            "status": TaskStatus.PENDING.value,
            "progress_percentage": 0.0,
            "current_step_description": "Job queued in Celery Redis Broker",
            "manifest_url": None,
            "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }

        # Attempt to queue in Celery or run in FastAPI BackgroundTasks fallback
        try:
            run_media_orchestration_pipeline.delay(
                task_id=task_id,
                lecture_id=lecture_id,
                concept_query=request.concept_query,
                pedagogy_style=request.settings.pedagogy_style.value,
                target_language=request.settings.target_language,
                persona_avatar=request.settings.persona_avatar
            )
        except Exception:
            # Fallback for environments without running Celery Redis daemon
            def synchronous_fallback():
                run_media_orchestration_pipeline(
                    task_id=task_id,
                    lecture_id=lecture_id,
                    concept_query=request.concept_query,
                    pedagogy_style=request.settings.pedagogy_style.value,
                    target_language=request.settings.target_language,
                    persona_avatar=request.settings.persona_avatar
                )
            background_tasks.add_task(synchronous_fallback)

        return {
            "status": "success",
            "task_id": task_id,
            "lecture_id": lecture_id,
            "message": f"Media pipeline initialized for concept: '{request.concept_query}'",
            "poll_url": f"/api/v1/tasks/{task_id}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to trigger lecture render: {str(e)}")
