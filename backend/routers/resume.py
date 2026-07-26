from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Candidate, ResumeParseResponse
from services.resume_parser import ResumeParserService

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/parse", response_model=ResumeParseResponse)
async def parse_and_save_resume(
    file: UploadFile = File(...),
    name: str = Form("Candidate"),
    target_role: str = Form("Full Stack Engineer"),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        extracted_text = ResumeParserService.extract_text_from_file(content, file.filename)
        parsed_data = ResumeParserService.parse_resume(extracted_text, default_name=name, default_role=target_role)

        candidate = Candidate(
            name=parsed_data["name"],
            email=parsed_data["email"],
            phone=parsed_data["phone"],
            target_role=parsed_data["target_role"],
            experience_years=parsed_data["experience_years"],
            skills=parsed_data["skills"],
            raw_resume_text=parsed_data["raw_resume_text"],
            parsed_summary=parsed_data["parsed_summary"]
        )

        db.add(candidate)
        db.commit()
        db.refresh(candidate)

        return ResumeParseResponse(
            candidate_id=candidate.id,
            name=candidate.name,
            email=candidate.email,
            phone=candidate.phone,
            target_role=candidate.target_role,
            experience_years=candidate.experience_years,
            skills=candidate.skills,
            parsed_summary=candidate.parsed_summary
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")
