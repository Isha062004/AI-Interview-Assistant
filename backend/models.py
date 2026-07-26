import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from database import Base

# ==================== SQLAlchemy ORM Models ====================

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    target_role = Column(String(255), nullable=False)
    experience_years = Column(Float, default=0.0)
    skills = Column(JSON, default=list)
    raw_resume_text = Column(Text, nullable=True)
    parsed_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    sessions = relationship("InterviewSession", back_populates="candidate", cascade="all, delete-orphan")

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    candidate_id = Column(String(36), ForeignKey("candidates.id"), nullable=False)
    role = Column(String(255), nullable=False)
    experience_level = Column(String(50), nullable=False) # Junior, Mid, Senior, Lead
    interview_mode = Column(String(50), default="voice") # voice or text
    status = Column(String(50), default="in_progress") # in_progress, completed
    total_questions = Column(Integer, default=5)
    overall_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    candidate = relationship("Candidate", back_populates="sessions")
    questions = relationship("InterviewQuestion", back_populates="session", cascade="all, delete-orphan")
    evaluations = relationship("EvaluationResult", back_populates="session", cascade="all, delete-orphan")
    roadmaps = relationship("LearningRoadmap", back_populates="session", cascade="all, delete-orphan")

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("interview_sessions.id"), nullable=False)
    question_order = Column(Integer, nullable=False)
    category = Column(String(100), nullable=False) # e.g. Core Concepts, Architecture, Problem Solving
    question_text = Column(Text, nullable=False)
    difficulty = Column(String(50), nullable=False)
    expected_key_points = Column(JSON, default=list)
    rag_context = Column(Text, nullable=True)

    session = relationship("InterviewSession", back_populates="questions")
    response = relationship("CandidateResponse", back_populates="question", uselist=False, cascade="all, delete-orphan")

class CandidateResponse(Base):
    __tablename__ = "candidate_responses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    question_id = Column(String(36), ForeignKey("interview_questions.id"), nullable=False)
    user_answer = Column(Text, nullable=False)
    audio_duration_seconds = Column(Float, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    question = relationship("InterviewQuestion", back_populates="response")
    evaluation = relationship("QuestionEvaluation", back_populates="response", uselist=False, cascade="all, delete-orphan")

class QuestionEvaluation(Base):
    __tablename__ = "question_evaluations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    response_id = Column(String(36), ForeignKey("candidate_responses.id"), nullable=False)
    score = Column(Float, nullable=False) # 0 to 100
    technical_accuracy = Column(Float, nullable=False)
    problem_solving = Column(Float, nullable=False)
    communication = Column(Float, nullable=False)
    code_quality = Column(Float, nullable=False)
    strengths = Column(JSON, default=list)
    areas_for_improvement = Column(JSON, default=list)
    ideal_answer_summary = Column(Text, nullable=True)

    response = relationship("CandidateResponse", back_populates="evaluation")

class EvaluationResult(Base):
    __tablename__ = "evaluation_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("interview_sessions.id"), nullable=False)
    overall_score = Column(Float, nullable=False)
    accuracy_score = Column(Float, nullable=False)
    problem_solving_score = Column(Float, nullable=False)
    communication_score = Column(Float, nullable=False)
    architecture_score = Column(Float, nullable=False)
    summary_feedback = Column(Text, nullable=False)
    key_strengths = Column(JSON, default=list)
    key_weaknesses = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("InterviewSession", back_populates="evaluations")

class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("interview_sessions.id"), nullable=False)
    target_level = Column(String(50), nullable=False)
    roadmap_nodes = Column(JSON, default=list) # List of dicts representing milestone steps
    recommended_resources = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("InterviewSession", back_populates="roadmaps")


# ==================== Pydantic Schemas ====================

class ResumeParseRequest(BaseModel):
    name: Optional[str] = "Candidate"
    target_role: Optional[str] = "Full Stack Engineer"

class ResumeParseResponse(BaseModel):
    candidate_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    target_role: str
    experience_years: float
    skills: List[str]
    parsed_summary: str

class StartInterviewRequest(BaseModel):
    candidate_id: str
    role: str = "Full Stack Engineer"
    experience_level: str = "Mid"
    interview_mode: str = "voice" # voice or text
    num_questions: int = 5

class QuestionDTO(BaseModel):
    id: str
    question_order: int
    category: str
    question_text: str
    difficulty: str
    expected_key_points: List[str]

class SubmitAnswerRequest(BaseModel):
    question_id: str
    user_answer: str
    audio_duration_seconds: Optional[float] = None

class AnswerEvaluationDTO(BaseModel):
    question_id: str
    score: float
    technical_accuracy: float
    problem_solving: float
    communication: float
    code_quality: float
    strengths: List[str]
    areas_for_improvement: List[str]
    ideal_answer_summary: str

class SessionEvaluationResponse(BaseModel):
    session_id: str
    overall_score: float
    accuracy_score: float
    problem_solving_score: float
    communication_score: float
    architecture_score: float
    summary_feedback: str
    key_strengths: List[str]
    key_weaknesses: List[str]
    question_evaluations: List[AnswerEvaluationDTO]

class RoadmapNode(BaseModel):
    id: int
    title: str
    category: str
    priority: str # High, Medium, Low
    estimated_hours: int
    description: str
    topics: List[str]
    recommended_projects: List[str]

class LearningRoadmapResponse(BaseModel):
    roadmap_id: str
    session_id: str
    target_level: str
    roadmap_nodes: List[RoadmapNode]
    recommended_resources: List[Dict[str, str]]
