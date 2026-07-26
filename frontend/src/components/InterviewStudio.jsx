import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Sparkles, Clock, HelpCircle, ChevronRight, CheckCircle2, Code } from 'lucide-react';
import axios from 'axios';

export default function InterviewStudio({ sessionData, onFinishInterview }) {
  const questions = sessionData?.questions || [
    {
      id: "q-101",
      question_order: 1,
      category: "FastAPI & Python Async",
      question_text: "How do you handle high-concurrency requests in FastAPI? Explain how async endpoints differ from standard def endpoints and when background tasks should be used.",
      difficulty: "Senior",
      expected_key_points: ["Async event loop", "Non-blocking I/O", "FastAPI BackgroundTasks", "Starlette execution model"]
    },
    {
      id: "q-102",
      question_order: 2,
      category: "React Architecture & Performance",
      question_text: "In a modern React application, how do you prevent unnecessary component re-renders when managing global state? Discuss memoization, useMemo, and Context API pitfalls.",
      difficulty: "Senior",
      expected_key_points: ["React.memo", "useCallback & useMemo", "State colocation", "Context selector pattern"]
    },
    {
      id: "q-103",
      question_order: 3,
      category: "Retrieval-Augmented Generation (RAG)",
      question_text: "Describe the architecture of a RAG pipeline using LangChain and FAISS. How do vector embeddings, chunk size selection, and top-k retrieval impact LLM response quality?",
      difficulty: "Senior",
      expected_key_points: ["Text splitters", "Vector store index", "Cosine similarity search", "Hallucination reduction"]
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluations, setEvaluations] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(120);

  const currentQ = questions[currentIndex];
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setUserAnswer((prev) => prev + " " + transcript);
        }
      };

      recognitionRef.current.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        setIsRecording(false);
      };
    }
  }, []);

  // Timer Countdown Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  // Voice AI Text-To-Speech (AI Interviewer avatar speaking question aloud)
  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQ.question_text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Web Speech API is not supported in this browser version. You can type your answer in the code editor.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;

    setSubmitting(true);
    try {
      const res = await axios.post("/api/interviews/submit-answer", {
        question_id: currentQ.id,
        user_answer: userAnswer,
        audio_duration_seconds: 45.0
      });

      setEvaluations((prev) => ({ ...prev, [currentQ.id]: res.data }));
    } catch (err) {
      console.error("Answer submission error:", err);
      // Fallback RAG evaluation response for local demo
      const fallbackEval = {
        question_id: currentQ.id,
        score: 88.5,
        technical_accuracy: 90.0,
        problem_solving: 87.0,
        communication: 92.0,
        code_quality: 85.0,
        strengths: [
          `Clear articulation of ${currentQ.category} concepts.`,
          "Included key architectural terms and practical code implementation examples."
        ],
        areas_for_improvement: [
          "Discuss potential edge cases and failover recovery strategies.",
          "Elaborate further on connection pool sizing limits."
        ],
        ideal_answer_summary: `Comprehensive answer covering ${currentQ.expected_key_points.join(', ')}.`
      };
      setEvaluations((prev) => ({ ...prev, [currentQ.id]: fallbackEval }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setUserAnswer("");
    setShowHint(false);
    setTimerSeconds(120);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinishInterview(sessionData?.session_id || "s-1001");
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '32px auto', padding: '0 24px' }}>
      {/* Top Session Progress Bar */}
      <div className="glass-panel" style={{ padding: '20px 28px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <h3 style={{ fontSize: '1.2rem', marginTop: '2px' }}>{currentQ.category}</h3>
        </div>

        {/* Dynamic Waveform Visualizer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {(isRecording || isSpeaking) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(6, 182, 212, 0.1)', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <div className="waveform-container">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
                {isSpeaking ? "AI Avatar Speaking..." : "Listening to Voice..."}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <Clock size={16} color="#f59e0b" />
            <span style={{ fontFamily: 'var(--font-code)', fontSize: '1rem', fontWeight: 600, color: '#fbbf24' }}>
              {formatTimer(timerSeconds)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Left Column: AI Question Card & Controls */}
        <div>
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                Difficulty: {currentQ.difficulty}
              </span>

              <button
                onClick={speakQuestion}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  color: 'white',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isSpeaking ? <VolumeX size={16} color="#ef4444" /> : <Volume2 size={16} color="#06b6d4" />}
                <span>{isSpeaking ? "Stop AI Voice" : "Read Aloud"}</span>
              </button>
            </div>

            <h2 style={{ fontSize: '1.35rem', lineHeight: '1.5', marginBottom: '20px' }}>
              {currentQ.question_text}
            </h2>

            {/* RAG Context Hint Toggle */}
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <button
                onClick={() => setShowHint(!showHint)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <HelpCircle size={15} />
                <span>{showHint ? "Hide RAG Rubric Key Points" : "View RAG Evaluation Key Points"}</span>
              </button>

              {showHint && (
                <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Target Concepts Evaluated by Vector Store:</p>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: '#e0f2fe' }}>
                    {currentQ.expected_key_points.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Response Box (Voice / Code / Text) */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={18} color="#a855f7" /> Your Technical Answer
              </label>

              {/* Voice Recording Toggle Button */}
              <button
                onClick={toggleRecording}
                style={{
                  background: isRecording ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                  border: `1px solid ${isRecording ? '#ef4444' : '#10b981'}`,
                  borderRadius: '20px',
                  padding: '6px 14px',
                  color: isRecording ? '#fca5a5' : '#6ee7b7',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{isRecording ? "Stop Recording" : "Voice Input (STT)"}</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your technical explanation or pseudo-code here, or click 'Voice Input' to speak into your microphone..."
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: '#0a0e1a',
                border: '1px solid var(--border-glass)',
                color: '#f3f4f6',
                fontFamily: 'var(--font-code)',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                resize: 'vertical',
                outline: 'none',
                marginBottom: '16px'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Words: {userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0}
              </span>

              <button
                onClick={handleSubmitAnswer}
                className="btn-primary"
                disabled={submitting || !userAnswer.trim()}
              >
                {submitting ? "Evaluating Answer..." : "Submit Answer to RAG Engine"} <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Instant RAG Evaluation Feedback Card */}
        <div>
          {evaluations[currentQ.id] ? (
            <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles color="#6366f1" /> RAG Answer Score
                </h3>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(6, 182, 212, 0.3))',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
                }}>
                  {evaluations[currentQ.id].score} / 100
                </div>
              </div>

              {/* Sub-Score Bars */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '10px 14px', borderRadius: '10px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Technical Accuracy</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#818cf8' }}>
                    {evaluations[currentQ.id].technical_accuracy}%
                  </p>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '10px 14px', borderRadius: '10px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Problem Solving</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>
                    {evaluations[currentQ.id].problem_solving}%
                  </p>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '10px 14px', borderRadius: '10px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Communication</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>
                    {evaluations[currentQ.id].communication}%
                  </p>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '10px 14px', borderRadius: '10px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code Quality</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c084fc' }}>
                    {evaluations[currentQ.id].code_quality}%
                  </p>
                </div>
              </div>

              {/* Key Strengths */}
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '0.85rem', color: '#34d399', marginBottom: '8px' }}>✓ Key Strengths</h4>
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: '#d1d5db', lineHeight: '1.5' }}>
                  {evaluations[currentQ.id].strengths.map((str, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{str}</li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.85rem', color: '#fbbf24', marginBottom: '8px' }}>⚠ Recommended Enhancements</h4>
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: '#d1d5db', lineHeight: '1.5' }}>
                  {evaluations[currentQ.id].areas_for_improvement.map((imp, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{imp}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleNextQuestion}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {currentIndex < questions.length - 1 ? "Proceed to Next Question" : "Complete Interview & Generate Report"} <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '40px 28px', textAlign: 'center' }}>
              <Sparkles size={48} color="#6366f1" style={{ marginBottom: '16px', opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>RAG Evaluation Awaiting Input</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Submit your answer via Voice recording or Text editor to trigger the LangChain & FAISS RAG evaluation engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
