import uuid
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import SyllabusUploadRequest
from app.services.syllabus import syllabus_analyzer

router = APIRouter()

# In-memory storage fallback for quick REST response
SYLLABUS_DB = {}

@router.post("/upload")
def upload_and_parse_syllabus(request: SyllabusUploadRequest):
    """
    Scans and analyzes uploaded syllabus (College, Competitive Exam, School)
    and constructs a structured multi-lecture playlist manifest.
    """
    try:
        syllabus_id = str(uuid.uuid4())
        parsed_data = syllabus_analyzer.analyze_syllabus(
            title=request.title,
            category=request.category,
            exam_target=request.exam_target or "Standard Curriculum",
            raw_text=request.raw_text
        )
        
        record = {
            "id": syllabus_id,
            "title": request.title,
            "category": request.category,
            "exam_target": request.exam_target,
            "institution": request.institution,
            "parsed_manifest": parsed_data
        }
        SYLLABUS_DB[syllabus_id] = record
        
        return {
            "status": "success",
            "syllabus_id": syllabus_id,
            "message": "Syllabus parsed successfully into lecture playlist manifest",
            "syllabus": record
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Syllabus parsing failed: {str(e)}")

@router.get("/{syllabus_id}")
def get_syllabus_by_id(syllabus_id: str):
    if syllabus_id not in SYLLABUS_DB:
        raise HTTPException(status_code=404, detail="Syllabus record not found")
    return SYLLABUS_DB[syllabus_id]
