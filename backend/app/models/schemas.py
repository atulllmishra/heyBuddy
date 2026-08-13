import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field

try:
    from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey, Integer, Float, Boolean
    from sqlalchemy.orm import declarative_base, relationship
    Base = declarative_base()
    HAS_SQLALCHEMY = True
except ImportError:
    Base = object
    HAS_SQLALCHEMY = False

# --- Enums ---
class TaskStatus(str, Enum):
    PENDING = "PENDING"
    SYLLABUS_ANALYZING = "SYLLABUS_ANALYZING"
    SCRIPT_GENERATING = "SCRIPT_GENERATING"
    AUDIO_SYNTHESIS = "AUDIO_SYNTHESIS"
    WHITEBOARD_STREAMS_GENERATING = "WHITEBOARD_STREAMS_GENERATING"
    HIGGSFIELD_VIDEO_COMPILING = "HIGGSFIELD_VIDEO_COMPILING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class PedagogyStyle(str, Enum):
    FEYNMAN = "Feynman"
    SOCRATIC = "Socratic"
    ANALOGICAL = "Analogical"
    DEEP_DIVE = "Deep Dive Academic"

class ExamCategory(str, Enum):
    COLLEGE = "College"
    COMPETITIVE = "Competitive Exam"
    SCHOOL = "School"

# --- SQLAlchemy ORM Models (if installed) ---
if HAS_SQLALCHEMY:
    class SyllabusModel(Base):
        __tablename__ = "syllabi"
        id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
        title = Column(String, nullable=False)
        category = Column(String, default=ExamCategory.COLLEGE.value)
        exam_target = Column(String, nullable=True)
        institution = Column(String, nullable=True)
        raw_text = Column(Text, nullable=True)
        parsed_manifest = Column(JSON, nullable=True)
        created_at = Column(DateTime, default=datetime.utcnow)

    class PlaylistModel(Base):
        __tablename__ = "playlists"
        id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
        syllabus_id = Column(String, ForeignKey("syllabi.id"), nullable=True)
        title = Column(String, nullable=False)
        description = Column(Text, nullable=True)
        total_lectures = Column(Integer, default=0)
        pedagogy_style = Column(String, default=PedagogyStyle.FEYNMAN.value)
        language = Column(String, default="English")
        created_at = Column(DateTime, default=datetime.utcnow)

    class LectureModel(Base):
        __tablename__ = "lectures"
        id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
        playlist_id = Column(String, ForeignKey("playlists.id"), nullable=False)
        module_index = Column(Integer, nullable=False)
        title = Column(String, nullable=False)
        summary = Column(Text, nullable=True)
        duration_seconds = Column(Integer, default=600)
        script_data = Column(JSON, nullable=True)
        whiteboard_vectors = Column(JSON, nullable=True)
        video_url = Column(String, nullable=True)
        audio_url = Column(String, nullable=True)
        avatar_video_url = Column(String, nullable=True)
        higgsfield_composition_manifest = Column(JSON, nullable=True)
        created_at = Column(DateTime, default=datetime.utcnow)

    class RenderTaskModel(Base):
        __tablename__ = "render_tasks"
        id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
        lecture_id = Column(String, ForeignKey("lectures.id"), nullable=True)
        status = Column(String, default=TaskStatus.PENDING.value)
        progress_percentage = Column(Float, default=0.0)
        current_step_description = Column(String, default="Task Queued")
        error_message = Column(Text, nullable=True)
        logs = Column(JSON, default=list)
        created_at = Column(DateTime, default=datetime.utcnow)
        updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# --- Pydantic v2 Schemas ---
class SyllabusUploadRequest(BaseModel):
    title: str = Field(..., description="Title of the course or exam syllabus")
    category: ExamCategory = Field(ExamCategory.COLLEGE, description="Syllabus level")
    exam_target: Optional[str] = Field("JEE Advanced / University Standard", description="Target exam name")
    institution: Optional[str] = Field("IIT / Standard University", description="Institution or board")
    raw_text: str = Field(..., description="Syllabus text content or extracted OCR text")

class PedagogySettings(BaseModel):
    pedagogy_style: PedagogyStyle = PedagogyStyle.FEYNMAN
    target_language: str = "English"
    voice_accent: str = "American Enthusiastic"
    persona_avatar: str = "Professor AI Scientist"
    whiteboard_theme: str = "Slate Dark"

class LectureExplainRequest(BaseModel):
    concept_query: str = Field(..., description="Specific concept or topic to generate long lecture for")
    syllabus_id: Optional[str] = None
    settings: PedagogySettings = Field(default_factory=PedagogySettings)

class TaskStatusResponse(BaseModel):
    task_id: str
    lecture_id: Optional[str] = None
    status: TaskStatus
    progress_percentage: float
    current_step_description: str
    error_message: Optional[str] = None
    manifest_url: Optional[str] = None
    updated_at: str
