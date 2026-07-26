import React from 'react';
import { Sparkles, FileText, Mic, BarChart2, Map } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, sessionActive, candidateName }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: 'rgba(7, 10, 18, 0.8)',
      borderBottom: '1px solid var(--border-glass)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('resume')}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '1.25rem', lineHeight: '1.2' }}>AI Interview Assistant</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FastAPI • RAG • FAISS • React</p>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '4px', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
          <button
            onClick={() => setActiveTab('resume')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              background: activeTab === 'resume' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
              color: activeTab === 'resume' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <FileText size={16} />
            <span>Resume Parser</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              background: activeTab === 'interview' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
              color: activeTab === 'interview' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <Mic size={16} />
            <span>Voice & Text Studio</span>
            {sessionActive && (
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 10px #10b981'
              }} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('evaluation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              background: activeTab === 'evaluation' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
              color: activeTab === 'evaluation' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <BarChart2 size={16} />
            <span>RAG Evaluation</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              background: activeTab === 'roadmap' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
              color: activeTab === 'roadmap' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <Map size={16} />
            <span>Learning Roadmap</span>
          </button>
        </nav>

        {/* Candidate Profile Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid var(--border-glow)',
            fontSize: '0.85rem',
            color: 'var(--text-main)',
            fontWeight: 500
          }}>
            👤 {candidateName || "Alex Morgan"}
          </div>
        </div>
      </div>
    </header>
  );
}
