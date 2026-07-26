from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import (
    Candidate, InterviewSession, InterviewQuestion, CandidateResponse, QuestionEvaluation,
    StartInterviewRequest, QuestionDTO, SubmitAnswerRequest, AnswerEvaluationDTO
)
from services.interview_engine import InterviewEngineService
from services.rag_engine import rag_engine

router = APIRouter(prefix="/interviews", tags=["Interviews"])

@router.post("/start")
def start_interview_session(req: StartInterviewRequest, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == req.candidate_id).first()
    skills = candidate.skills if candidate and candidate.skills else ["Python", "FastAPI", "React", "RAG"]

    session = InterviewSession(
        candidate_id=req.candidate_id,
        role=req.role,
        experience_level=req.experience_level,
        interview_mode=req.interview_mode,
        total_questions=req.num_questions,
        status="in_progress"
    )
    db.add(session)
    db.flush()

    raw_questions = InterviewEngineService.generate_questions_for_role(
        role=req.role,
        experience_level=req.experience_level,
        skills=skills,
        count=req.num_questions
    )

    questions_dto = []
    for idx, q in enumerate(raw_questions, start=1):
        question_obj = InterviewQuestion(
            session_id=session.id,
            question_order=idx,
            category=q["category"],
            question_text=q["question_text"],
            difficulty=q["difficulty"],
            expected_key_points=q["expected_key_points"],
            rag_context=f"Reference benchmarks for {q['category']}"
        )
        db.add(question_obj)
        db.flush()

        questions_dto.append(QuestionDTO(
            id=question_obj.id,
            question_order=idx,
            category=question_obj.category,
            question_text=question_obj.question_text,
            difficulty=question_obj.difficulty,
            expected_key_points=question_obj.expected_key_points
        ))

    db.commit()
    return {
        "session_id": session.id,
        "candidate_id": req.candidate_id,
        "role": req.role,
        "experience_level": req.experience_level,
        "interview_mode": req.interview_mode,
        "questions": questions_dto
    }

@router.post("/submit-answer", response_model=AnswerEvaluationDTO)
def submit_answer(req: SubmitAnswerRequest, db: Session = Depends(get_db)):
    question = db.query(InterviewQuestion).filter(InterviewQuestion.id == req.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    response_obj = CandidateResponse(
        question_id=question.id,
        user_answer=req.user_answer,
        audio_duration_seconds=req.audio_duration_seconds
    )
    db.add(response_obj)
    db.flush()

    # RAG Evaluation Execution
    eval_dict = rag_engine.evaluate_answer(
        question_text=question.question_text,
        user_answer=req.user_answer,
        category=question.category
    )

    q_eval = QuestionEvaluation(
        response_id=response_obj.id,
        score=eval_dict["score"],
        technical_accuracy=eval_dict["technical_accuracy"],
        problem_solving=eval_dict["problem_solving"],
        communication=eval_dict["communication"],
        code_quality=eval_dict["code_quality"],
        strengths=eval_dict["strengths"],
        areas_for_improvement=eval_dict["areas_for_improvement"],
        ideal_answer_summary=eval_dict["ideal_answer_summary"]
    )
    db.add(q_eval)
    db.commit()

    return AnswerEvaluationDTO(
        question_id=question.id,
        score=eval_dict["score"],
        technical_accuracy=eval_dict["technical_accuracy"],
        problem_solving=eval_dict["problem_solving"],
        communication=eval_dict["communication"],
        code_quality=eval_dict["code_quality"],
        strengths=eval_dict["strengths"],
        areas_for_improvement=eval_dict["areas_for_improvement"],
        ideal_answer_summary=eval_dict["ideal_answer_summary"]
    )
