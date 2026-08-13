import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import syllabus, explain, tasks, webhooks

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(syllabus.router, prefix=f"{settings.API_V1_STR}/syllabus", tags=["Syllabus Analyzer"])
app.include_router(explain.router, prefix=f"{settings.API_V1_STR}/explain", tags=["Lecture Orchestrator"])
app.include_router(tasks.router, prefix=f"{settings.API_V1_STR}/tasks", tags=["Async Job Queue"])
app.include_router(webhooks.router, prefix=f"{settings.API_V1_STR}/webhooks", tags=["Media Webhooks"])

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
