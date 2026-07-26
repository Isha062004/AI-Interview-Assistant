import React, { useState, useEffect } from 'react';
import { MapPin, BookOpen, ExternalLink, CheckSquare, Clock, Code, Layers, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function RoadmapView({ sessionId, candidateName }) {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [completedNodes, setCompletedNodes] = useState({});

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/roadmaps/${sessionId || "s-1001"}`);
        setRoadmap(res.data);
      } catch (err) {
        console.error("Error fetching roadmap", err);
        // Fallback roadmap data
        setRoadmap({
          roadmap_id: "rm-101",
          session_id: sessionId || "s-1001",
          target_level: "Senior",
          roadmap_nodes: [
            {
              id: 1,
              title: "Module 1: Advanced Async & High-Concurrency Python",
              category: "Backend Core",
              priority: "High",
              estimated_hours: 12,
              description: "Master FastAPI async event loops, starlette execution context, task queues, and non-blocking I/O microservices.",
              topics: [
                "Python asyncio event loop & coroutines",
                "FastAPI BackgroundTasks & Celery worker integration",
                "Gunicorn / Uvicorn worker process tuning"
              ],
              recommended_projects: [
                "Build a real-time async task orchestrator with FastAPI and Redis"
              ]
            },
            {
              id: 2,
              title: "Module 2: RAG Optimization & FAISS Vector Indexing",
              category: "AI / RAG Architecture",
              priority: "High",
              estimated_hours: 16,
              description: "Deep dive into vector embeddings, similarity search, and hybrid retrieval with LangChain and FAISS.",
              topics: [
                "LangChain document chunking & RecursiveCharacterTextSplitter",
                "FAISS index types (IndexFlatL2, IndexHNSW)",
                "Evaluation benchmarks (Ragas, Context Precision)"
              ],
              recommended_projects: [
                "Construct a production RAG search pipeline over enterprise documentation"
              ]
            },
            {
              id: 3,
              title: "Module 3: PostgreSQL Performance & Index Tuning",
              category: "Database Architecture",
              priority: "Medium",
              estimated_hours: 10,
              description: "Query plan analysis, indexing strategies (B-Tree, GIN), and connection pooling.",
              topics: [
                "Reading EXPLAIN ANALYZE execution trees",
                "B-Tree, GIN, and Partial Indexing",
                "pgBouncer connection pooling & SQLAlchemy session scopes"
              ],
              recommended_projects: [
                "Optimize a 10M record PostgreSQL table query execution time by 80%"
              ]
            },
            {
              id: 4,
              title: "Module 4: Production Containerization & Docker Orchestration",
              category: "DevOps & Cloud",
              priority: "Medium",
              estimated_hours: 8,
              description: "Multi-stage Docker builds, docker-compose orchestration, and automated pipelines.",
              topics: [
                "Multi-stage Dockerfiles for Python/React",
                "Docker compose networking & volume persistence",
                "GitHub Actions CI/CD pipelines"
              ],
              recommended_projects: [
                "Containerize and deploy full-stack app with automatic SSL and zero-downtime reloads"
              ]
            }
          ],
          recommended_resources: [
            { name: "FastAPI Official Production Documentation", url: "https://fastapi.tiangolo.com/deployment/" },
            { name: "LangChain & Vector Stores Guide", url: "https://python.langchain.com/docs/modules/data_connection/" },
            { name: "FAISS Engineering Handbook", url: "https://github.com/facebookresearch/faiss/wiki" },
            { name: "PostgreSQL High Performance Manual", url: "https://www.postgresql.org/docs/current/performance-tips.html" }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [sessionId]);

  const toggleNodeCompletion = (id) => {
    setCompletedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading || !roadmap) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="waveform-container" style={{ margin: '0 auto 20px auto' }}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <h3 style={{ fontSize: '1.2rem' }}>Generating Custom Learning Roadmap...</h3>
      </div>
    );
  }

  const completedCount = Object.values(completedNodes).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / roadmap.roadmap_nodes.length) * 100);

  return (
    <div style={{ maxWidth: '1050px', margin: '32px auto', padding: '0 24px' }}>
      {/* Top Header Card */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#a855f7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Personalized Skill Roadmap
            </span>
            <h1 style={{ fontSize: '2.2rem', margin: '6px 0 8px 0' }}>
              Tailored Engineering Path for <span className="gradient-text">{candidateName || "Alex Morgan"}</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Target Level: <strong style={{ color: '#ffffff' }}>{roadmap.target_level} Tier</strong> • Estimated Time: <strong style={{ color: '#ffffff' }}>46 Learning Hours</strong>
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px 24px', borderRadius: '16px', border: '1px solid var(--border-glass)', minWidth: '220px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Progress</span>
              <span style={{ fontWeight: 700, color: '#38bdf8' }}>{progressPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', transition: 'width 0.4s ease' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Roadmap Modules */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
        {roadmap.roadmap_nodes.map((node) => {
          const isDone = completedNodes[node.id];
          return (
            <div
              key={node.id}
              className="glass-panel"
              style={{
                padding: '28px',
                borderLeft: `4px solid ${isDone ? '#10b981' : node.priority === 'High' ? '#6366f1' : '#06b6d4'}`,
                opacity: isDone ? 0.75 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: node.priority === 'High' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                      color: node.priority === 'High' ? '#a5b4fc' : '#67e8f9',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {node.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {node.estimated_hours} Hours
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', textDecoration: isDone ? 'line-through' : 'none' }}>{node.title}</h3>
                </div>

                <button
                  onClick={() => toggleNodeCompletion(node.id)}
                  style={{
                    background: isDone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isDone ? '#10b981' : 'var(--border-glass)'}`,
                    color: isDone ? '#34d399' : 'var(--text-muted)',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckSquare size={16} />
                  <span>{isDone ? "Completed" : "Mark Done"}</span>
                </button>
              </div>

              <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>
                {node.description}
              </p>

              {/* Topics & Project Recommendations Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={15} color="#6366f1" /> Key Learning Topics
                  </h4>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: '#e5e7eb', lineHeight: '1.5' }}>
                    {node.topics.map((tp, idx) => (
                      <li key={idx}>{tp}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Code size={15} color="#06b6d4" /> Hands-on Project
                  </h4>
                  {node.recommended_projects.map((proj, idx) => (
                    <div key={idx} style={{ fontSize: '0.85rem', color: '#7dd3fc', background: 'rgba(6, 182, 212, 0.1)', padding: '8px 12px', borderRadius: '8px' }}>
                      {proj}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommended Documentation & Learning Resources */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen color="#6366f1" /> Recommended Learning Resources
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {roadmap.recommended_resources.map((res, idx) => (
            <a
              key={idx}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel-interactive"
              style={{
                padding: '16px',
                textDecoration: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{res.name}</span>
              <ExternalLink size={16} color="#38bdf8" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
