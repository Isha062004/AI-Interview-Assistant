import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config.settings import settings
from database import engine, Base
from routers import resume, interview, evaluation, roadmap
from presentation.api.v1 import auth as auth_v1, ws as ws_v1

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_interview_assistant_enterprise")

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Legacy / Base API Routers (Backward Compatibility)
app.include_router(resume.router, prefix=settings.API_PREFIX)
app.include_router(interview.router, prefix=settings.API_PREFIX)
app.include_router(evaluation.router, prefix=settings.API_PREFIX)
app.include_router(roadmap.router, prefix=settings.API_PREFIX)

# Enterprise API V1 Routers
app.include_router(auth_v1.router, prefix=settings.API_V1_STR)
app.include_router(ws_v1.router, prefix=settings.API_V1_STR)
app.include_router(resume.router, prefix=settings.API_V1_STR)
app.include_router(interview.router, prefix=settings.API_V1_STR)
app.include_router(evaluation.router, prefix=settings.API_V1_STR)
app.include_router(roadmap.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to Enterprise AI Interview Platform",
        "version": settings.VERSION,
        "docs_v1": f"{settings.API_V1_STR}/docs"
    }

@app.get(f"{settings.API_PREFIX}/health")
@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME, "architecture": "Enterprise Clean Architecture"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
