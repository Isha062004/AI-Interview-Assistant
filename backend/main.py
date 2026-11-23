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

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

@app.get(f"{settings.API_PREFIX}/health")
@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME, "architecture": "Enterprise Clean Architecture"}

# Serve Frontend Built Dist (Static Files & React SPA fallback)
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
assets_dir = os.path.join(frontend_dist, "assets")

if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    file_path = os.path.join(frontend_dist, full_path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    index_file = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {
        "message": "Welcome to Enterprise AI Interview Platform",
        "version": settings.VERSION,
        "docs_v1": f"{settings.API_V1_STR}/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
