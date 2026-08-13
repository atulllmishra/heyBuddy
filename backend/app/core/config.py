import os

try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        class BaseSettings:
            pass

class Settings(BaseSettings):
    PROJECT_NAME: str = "heyBuddy AI EdTech Engine"
    API_V1_STR: str = "/api/v1"
    
    # Database & Cache
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://heybuddy:heybuddy_pass@localhost:5432/heybuddy_db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # AI & Media API Credentials
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "mock-openai-key")
    ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "mock-elevenlabs-key")
    HEYGEN_API_KEY: str = os.getenv("HEYGEN_API_KEY", "mock-heygen-key")
    D_ID_API_KEY: str = os.getenv("D_ID_API_KEY", "mock-did-key")
    HIGGSFIELD_API_KEY: str = os.getenv("HIGGSFIELD_API_KEY", "mock-higgsfield-key")
    DEEPL_API_KEY: str = os.getenv("DEEPL_API_KEY", "mock-deepl-key")

    # Storage
    MEDIA_STORAGE_PATH: str = os.getenv("MEDIA_STORAGE_PATH", "./media_assets")

    class Config:
        case_sensitive = True

settings = Settings()
