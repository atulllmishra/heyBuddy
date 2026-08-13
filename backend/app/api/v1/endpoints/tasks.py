from fastapi import APIRouter, HTTPException
from app.tasks.celery_tasks import TASK_STORE

router = APIRouter()

@router.get("/{task_id}")
def get_task_status(task_id: str):
    """
    Returns real-time async media job progress, active stage description, and final manifest URL.
    """
    if task_id not in TASK_STORE:
        raise HTTPException(status_code=404, detail="Task ID not found")
    
    return TASK_STORE[task_id]

@router.get("")
def list_all_active_tasks():
    return list(TASK_STORE.values())
