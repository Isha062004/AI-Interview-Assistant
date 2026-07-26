import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ResumeUpload from './components/ResumeUpload';
import InterviewStudio from './components/InterviewStudio';
import EvaluationDashboard from './components/EvaluationDashboard';
import RoadmapView from './components/RoadmapView';
import axios from 'axios';

export default function App() {
  const [activeTab, setActiveTab] = useState('resume'); // 'resume', 'interview', 'evaluation', 'roadmap'
  const [candidateData, setCandidateData] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  const handleCandidateParsed = (data) => {
    setCandidateData(data);
  };

  const handleStartInterview = async (candidateId, role, experienceLevel, interviewMode) => {
    try {
      const res = await axios.post('/api/interviews/start', {
        candidate_id: candidateId,
        role: role,
        experience_level: experienceLevel,
        interview_mode: interviewMode,
        num_questions: 3
      });
      setSessionData(res.data);
      setActiveTab('interview');
    } catch (err) {
      console.error("Error starting interview session:", err);
      // Fallback mock session for local demo
      const fallbackSession = {
        session_id: "s-1001",
        candidate_id: candidateId,
        role: role,
        experience_level: experienceLevel,
        interview_mode: interviewMode,
        questions: [
          {
            id: "q-101",
            question_order: 1,
            category: "FastAPI & Python Async",
            question_text: "How do you handle high-concurrency requests in FastAPI? Explain how async endpoints differ from standard def endpoints and when background tasks should be used.",
            difficulty: experienceLevel,
            expected_key_points: ["Async event loop", "Non-blocking I/O", "FastAPI BackgroundTasks", "Starlette execution model"]
          },
          {
            id: "q-102",
            question_order: 2,
            category: "React Architecture & Performance",
            question_text: "In a modern React application, how do you prevent unnecessary component re-renders when managing global state? Discuss memoization, useMemo, and Context API pitfalls.",
            difficulty: experienceLevel,
            expected_key_points: ["React.memo", "useCallback & useMemo", "State colocation", "Context selector pattern"]
          },
          {
            id: "q-103",
            question_order: 3,
            category: "Retrieval-Augmented Generation (RAG)",
            question_text: "Describe the architecture of a RAG pipeline using LangChain and FAISS. How do vector embeddings, chunk size selection, and top-k retrieval impact LLM response quality?",
            difficulty: experienceLevel,
            expected_key_points: ["Text splitters", "Vector store index", "Cosine similarity search", "Hallucination reduction"]
          }
        ]
      };
      setSessionData(fallbackSession);
      setActiveTab('interview');
    }
  };

  const handleFinishInterview = (sessionId) => {
    setActiveTab('evaluation');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sessionActive={!!sessionData}
        candidateName={candidateData?.name || "Alex Morgan"}
      />

      <main style={{ flex: 1, paddingBottom: '48px' }}>
        {activeTab === 'resume' && (
          <ResumeUpload
            onCandidateParsed={handleCandidateParsed}
            onStartInterview={handleStartInterview}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewStudio
            sessionData={sessionData}
            onFinishInterview={handleFinishInterview}
          />
        )}

        {activeTab === 'evaluation' && (
          <EvaluationDashboard
            sessionId={sessionData?.session_id || "s-1001"}
            candidateName={candidateData?.name || "Alex Morgan"}
            onViewRoadmap={() => setActiveTab('roadmap')}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            sessionId={sessionData?.session_id || "s-1001"}
            candidateName={candidateData?.name || "Alex Morgan"}
          />
        )}
      </main>
    </div>
  );
}
