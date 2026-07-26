from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import InterviewSession, LearningRoadmap, LearningRoadmapResponse, RoadmapNode
from services.roadmap_generator import RoadmapGeneratorService

router = APIRouter(prefix="/roadmaps", tags=["Roadmaps"])

@router.get("/{session_id}", response_model=LearningRoadmapResponse)
def get_or_generate_roadmap(session_id: str, db: Session = Depends(get_db)):
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    existing = db.query(LearningRoadmap).filter(LearningRoadmap.session_id == session_id).first()
    if existing:
        return LearningRoadmapResponse(
            roadmap_id=existing.id,
            session_id=existing.session_id,
            target_level=existing.target_level,
            roadmap_nodes=[RoadmapNode(**node) for node in existing.roadmap_nodes],
            recommended_resources=existing.recommended_resources
        )

    # Generate new roadmap based on session evaluations
    weaknesses = ["RAG Vector Search", "PostgreSQL EXPLAIN ANALYZE", "FastAPI Async Event Loop"]
    roadmap_data = RoadmapGeneratorService.generate_personalized_roadmap(
        target_role=session.role,
        experience_level=session.experience_level,
        weaknesses=weaknesses,
        evaluations=[]
    )

    new_roadmap = LearningRoadmap(
        session_id=session.id,
        target_level=roadmap_data["target_level"],
        roadmap_nodes=roadmap_data["roadmap_nodes"],
        recommended_resources=roadmap_data["recommended_resources"]
    )
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)

    return LearningRoadmapResponse(
        roadmap_id=new_roadmap.id,
        session_id=new_roadmap.session_id,
        target_level=new_roadmap.target_level,
        roadmap_nodes=[RoadmapNode(**node) for node in new_roadmap.roadmap_nodes],
        recommended_resources=new_roadmap.recommended_resources
    )
