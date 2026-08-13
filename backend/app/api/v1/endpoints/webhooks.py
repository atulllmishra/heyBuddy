from fastapi import APIRouter, HTTPException, Request
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/render")
async def handle_external_render_webhook(request: Request):
    """
    Webhook handler for HeyGen, D-ID, or Higgsfield external video rendering completion notifications.
    """
    payload = await request.json()
    logger.info(f"Received render webhook payload: {payload}")
    
    return {
        "status": "received",
        "message": "Render webhook payload registered successfully"
    }
