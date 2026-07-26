import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, AlertTriangle, ArrowRight, BarChart3, Shield, BookOpen } from 'lucide-react';
import axios from 'axios';

export default function EvaluationDashboard({ sessionId, candidateName, onViewRoadmap }) {
  const [loading, setLoading] = useState(false);
  const [evalData, setEvalData] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`/api/evaluations/finalize/${sessionId || "s-1001"}`);
        setEvalData(res.data);
      } catch (err) {
        console.error("Error finalizing evaluation", err);
        // Fallback demo data
        setEvalData({
          session_id: sessionId || "s-1001",
          overall_score: 87.5,
          accuracy_score: 89.0,
          problem_solving_score: 88.0,
          communication_score: 91.0,
          architecture_score: 82.0,
          summary_feedback: `Candidate ${candidateName || "Alex Morgan"} completed the Senior Full Stack Engineer interview with stellar performance across FastAPI async design and React state management. Identified key growth areas in PostgreSQL query plan optimization and vector search indexing.`,
          key_strengths: [
            "Exceptional clarity explaining non-blocking I/O in FastAPI endpoints",
            "Clear articulation of React state colocation & memoization techniques",
            "Structured response format with clean code examples"
          ],
          key_weaknesses: [
            "Could expand further on EXPLAIN ANALYZE execution tree node costs",
            "Did not mention HNSW vs IVF-PQ vector index trade-offs"
          ],
          question_evaluations: [
            {
              question_id: "q-101",
              score: 92.0,
              technical_accuracy: 94.0,
              problem_solving: 90.0,
              communication: 95.0,
              code_quality: 89.0,
              strengths: ["Clear explanation of Starlette event loops and background tasks."],
              areas_for_improvement: ["Discuss worker process counts based on CPU cores."],
              ideal_answer_summary: "FastAPI uses Starlette event loops for async endpoints to process concurrent requests without thread switching."
            },
            {
              question_id: "q-102",
              score: 85.0,
              technical_accuracy: 86.0,
              problem_solving: 84.0,
              communication: 88.0,
              code_quality: 82.0,
              strengths: ["Proper identification of React.memo and useCallback."],
              areas_for_improvement: ["Mention Context selector libraries to prevent whole-tree context re-renders."],
              ideal_answer_summary: "Use React.memo with customized props Comparison function and colocate transient state."
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [sessionId]);

  if (loading || !evalData) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="waveform-container" style={{ margin: '0 auto 20px auto' }}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <h3 style={{ fontSize: '1.25rem' }}>Synthesizing RAG Candidate Evaluation...</h3>
        <p style={{ color: 'var(--text-muted)' }}>Retrieving vector store benchmarks and compiling performance metrics.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '32px auto', padding: '0 24px' }}>
      {/* Top Banner Card */}
      <div className="glass-panel" style={{ padding: '36px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(18, 24, 38, 0.9), rgba(99, 102, 241, 0.12))', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Final Candidate Assessment
            </span>
            <h1 style={{ fontSize: '2.2rem', margin: '6px 0 10px 0' }}>
              {candidateName || "Alex Morgan"} - Executive Report
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', lineHeight: '1.5', fontSize: '0.95rem' }}>
              {evalData.summary_feedback}
            </p>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '24px 36px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)'
          }}>
            <Award size={36} color="#ffffff" style={{ margin: '0 auto 6px auto' }} />
            <p style={{ fontSize: '0.8rem', color: '#e0e7ff', textTransform: 'uppercase', fontWeight: 600 }}>Overall Score</p>
            <h2 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#ffffff' }}>{evalData.overall_score}</h2>
          </div>
        </div>
      </div>

      {/* Category Breakdown Bar Chart Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Technical Accuracy</p>
          <h3 style={{ fontSize: '1.6rem', color: '#818cf8', margin: '4px 0 8px 0' }}>{evalData.accuracy_score}%</h3>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${evalData.accuracy_score}%`, height: '100%', background: '#818cf8' }}></div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Problem Solving</p>
          <h3 style={{ fontSize: '1.6rem', color: '#38bdf8', margin: '4px 0 8px 0' }}>{evalData.problem_solving_score}%</h3>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${evalData.problem_solving_score}%`, height: '100%', background: '#38bdf8' }}></div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Communication & Clarity</p>
          <h3 style={{ fontSize: '1.6rem', color: '#34d399', margin: '4px 0 8px 0' }}>{evalData.communication_score}%</h3>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${evalData.communication_score}%`, height: '100%', background: '#34d399' }}></div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Architecture & Code Quality</p>
          <h3 style={{ fontSize: '1.6rem', color: '#c084fc', margin: '4px 0 8px 0' }}>{evalData.architecture_score}%</h3>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${evalData.architecture_score}%`, height: '100%', background: '#c084fc' }}></div>
          </div>
        </div>
      </div>

      {/* Strengths and Weaknesses Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CheckCircle2 size={20} /> Verified Technical Strengths
          </h3>
          <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: '#d1d5db', lineHeight: '1.6' }}>
            {evalData.key_strengths.map((str, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>{str}</li>
            ))}
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertTriangle size={20} /> Areas for Targeted Growth
          </h3>
          <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: '#d1d5db', lineHeight: '1.6' }}>
            {evalData.key_weaknesses.map((weak, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>{weak}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Call to Action for Learning Roadmap */}
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
        <BookOpen size={40} color="#10b981" style={{ marginBottom: '12px' }} />
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Personalized Learning Roadmap Ready</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto 20px auto', fontSize: '0.95rem' }}>
          Based on the identified technical weaknesses in this interview session, we have generated a structured milestone learning roadmap.
        </p>
        <button onClick={onViewRoadmap} className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
          View Personal Learning Roadmap <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
