from typing import List, Dict, Any

class RoadmapGeneratorService:
    @staticmethod
    def generate_personalized_roadmap(
        target_role: str, 
        experience_level: str, 
        weaknesses: List[str], 
        evaluations: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Generates structured milestone nodes and learning modules tailored to candidate performance.
        """
        roadmap_nodes = [
            {
                "id": 1,
                "title": "Module 1: Advanced Async & High-Concurrency Python",
                "category": "Backend Core",
                "priority": "High",
                "estimated_hours": 12,
                "description": "Master FastAPI async event loop, task queues, and non-blocking I/O microservices.",
                "topics": [
                    "Python asyncio event loop & coroutines",
                    "FastAPI BackgroundTasks & Celery integration",
                    "Gunicorn / Uvicorn worker process tuning"
                ],
                "recommended_projects": [
                    "Build a real-time async task orchestrator with FastAPI and Redis"
                ]
            },
            {
                "id": 2,
                "title": "Module 2: RAG Optimization & FAISS Vector Indexing",
                "category": "AI / RAG Architecture",
                "priority": "High" if any("RAG" in w or "Vector" in w for w in weaknesses) else "Medium",
                "estimated_hours": 16,
                "description": "Deep dive into vector embeddings, similarity search, and hybrid retrieval with LangChain.",
                "topics": [
                    "LangChain document chunking & RecursiveCharacterTextSplitter",
                    "FAISS index types (IndexFlatL2, IndexHNSW)",
                    "Evaluation benchmarks (Ragas, Context Precision)"
                ],
                "recommended_projects": [
                    "Construct a production RAG search pipeline over enterprise documentation"
                ]
            },
            {
                "id": 3,
                "title": "Module 3: PostgreSQL Performance & Index Tuning",
                "category": "Database Architecture",
                "priority": "Medium",
                "estimated_hours": 10,
                "description": "Query plan analysis, indexing strategies, and connection pooling.",
                "topics": [
                    "Reading EXPLAIN ANALYZE execution trees",
                    "B-Tree, GIN, and Partial Indexing",
                    "pgBouncer connection pooling & SQLAlchemy session scopes"
                ],
                "recommended_projects": [
                    "Optimize a 10M record PostgreSQL table query execution time by 80%"
                ]
            },
            {
                "id": 4,
                "title": "Module 4: Production Containerization & CI/CD",
                "category": "DevOps & Cloud",
                "priority": "Medium",
                "estimated_hours": 8,
                "description": "Multi-stage Docker builds, docker-compose orchestration, and automated pipelines.",
                "topics": [
                    "Multi-stage Dockerfiles for Python/React",
                    "Docker compose networking & volume persistence",
                    "GitHub Actions CI/CD pipelines"
                ],
                "recommended_projects": [
                    "Containerize and deploy full-stack app with automatic SSL and zero-downtime reloads"
                ]
            }
        ]

        resources = [
            {"name": "FastAPI Official Production Documentation", "url": "https://fastapi.tiangolo.com/deployment/"},
            {"name": "LangChain & Vector Stores Guide", "url": "https://python.langchain.com/docs/modules/data_connection/"},
            {"name": "FAISS Engineering Handbook", "url": "https://github.com/facebookresearch/faiss/wiki"},
            {"name": "PostgreSQL High Performance Manual", "url": "https://www.postgresql.org/docs/current/performance-tips.html"}
        ]

        return {
            "target_level": experience_level,
            "roadmap_nodes": roadmap_nodes,
            "recommended_resources": resources
        }
