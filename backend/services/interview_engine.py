import random
from typing import List, Dict, Any

QUESTION_BANK = {
    "Full Stack Engineer": [
        {
            "category": "FastAPI & Backend Systems",
            "question_text": "How do you handle high-concurrency requests in FastAPI? Explain how async endpoints differ from standard def endpoints and when background tasks should be used.",
            "difficulty": "Mid",
            "expected_key_points": ["Async event loop", "Non-blocking I/O", "FastAPI BackgroundTasks", "Starlette execution model"]
        },
        {
            "category": "React Architecture & Performance",
            "question_text": "In a modern React application, how do you prevent unnecessary component re-renders when managing global state? Discuss memoization, useMemo, and Context API pitfalls.",
            "difficulty": "Mid",
            "expected_key_points": ["React.memo", "useCallback & useMemo", "State colocation", "Context selector pattern"]
        },
        {
            "category": "Retrieval-Augmented Generation (RAG)",
            "question_text": "Describe the architecture of a RAG pipeline using LangChain and FAISS. How do vector embeddings, chunk size selection, and top-k retrieval impact LLM response quality?",
            "difficulty": "Senior",
            "expected_key_points": ["Text splitters", "Vector store index", "Cosine similarity search", "Hallucination reduction"]
        },
        {
            "category": "PostgreSQL & Query Optimization",
            "question_text": "How would you diagnose and optimize a slow PostgreSQL query in a production FastAPI app? Explain EXPLAIN ANALYZE, B-Tree vs GIN indexing, and connection pooling.",
            "difficulty": "Senior",
            "expected_key_points": ["EXPLAIN ANALYZE execution plan", "Index selection", "pgBouncer / Connection Pool", "N+1 query resolution"]
        },
        {
            "category": "Docker & DevOps Deployment",
            "question_text": "How do you structure a multi-stage Docker build for a Python FastAPI and React application to minimize image size and maximize layer caching security?",
            "difficulty": "Mid",
            "expected_key_points": ["Multi-stage build targets", "Alpine / Slim base images", ".dockerignore optimization", "Non-root user execution"]
        }
    ],
    "Backend Engineer": [
        {
            "category": "Microservices & Distributed Systems",
            "question_text": "How do you maintain data consistency across microservices in a distributed architecture? Compare Saga Pattern with 2-Phase Commit.",
            "difficulty": "Senior",
            "expected_key_points": ["Saga pattern Orchestration vs Choreography", "Eventual consistency", "Outbox pattern", "Idempotency keys"]
        },
        {
            "category": "Caching Strategy & Redis",
            "question_text": "Explain Cache-Aside vs Write-Through caching strategies. How do you prevent Cache Stampede and Thundering Herd problems in high-traffic APIs?",
            "difficulty": "Mid",
            "expected_key_points": ["Cache invalidation", "TTL expiration", "Mutex locks / probabilistic early expiration", "Redis clustering"]
        }
    ],
    "AI / ML Engineer": [
        {
            "category": "Vector DB & RAG Benchmarking",
            "question_text": "Compare FAISS, Pinecone, and Chroma for production vector search. What indexing algorithms (e.g. HNSW, IVF-PQ) offer the best tradeoff between recall and search latency?",
            "difficulty": "Senior",
            "expected_key_points": ["HNSW graph indexing", "Inverted File Index (IVF)", "Product Quantization (PQ)", "Memory vs Recall trade-offs"]
        },
        {
            "category": "LLM Fine-Tuning & Quantization",
            "question_text": "What is LoRA (Low-Rank Adaptation) and how does it reduce memory requirements during fine-tuning compared to full parameter fine-tuning?",
            "difficulty": "Lead",
            "expected_key_points": ["Rank decomposition matrices", "Trainable parameters reduction", "Quantization (QLoRA)", "GPU VRAM efficiency"]
        }
    ]
}

class InterviewEngineService:
    @staticmethod
    def generate_questions_for_role(role: str, experience_level: str, skills: List[str], count: int = 5) -> List[Dict[str, Any]]:
        pool = QUESTION_BANK.get(role, QUESTION_BANK["Full Stack Engineer"])
        
        # Adjust pool based on skills match if applicable
        selected = list(pool)
        
        # If pool has fewer questions than requested count, generate dynamic questions matching candidate skills
        while len(selected) < count:
            skill = skills[len(selected) % len(skills)] if skills else "Software Engineering"
            selected.append({
                "category": f"{skill} Advanced Concepts",
                "question_text": f"Can you walk us through how you apply best engineering practices when using {skill} in high-throughput enterprise systems?",
                "difficulty": experience_level,
                "expected_key_points": ["Architecture pattern", "Error handling", "Performance testing", "Monitoring"]
            })
            
        return selected[:count]
