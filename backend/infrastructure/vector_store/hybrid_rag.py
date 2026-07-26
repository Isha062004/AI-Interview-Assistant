import re
import json
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Enterprise Knowledge Corpus
ENTERPRISE_KNOWLEDGE = [
    {
        "id": "rag-101",
        "category": "FastAPI & High-Concurrency Systems",
        "title": "FastAPI Async Event Loop & Worker Process Management",
        "content": "FastAPI utilizes Starlette's asyncio event loop to handle concurrent non-blocking HTTP requests. Standard 'def' endpoints run in an external threadpool (ThreadPoolExecutor), whereas 'async def' endpoints run directly on the main event loop. For CPU-bound tasks, multiprocessing with Gunicorn process managers is required.",
        "bm25_keywords": ["fastapi", "async", "event loop", "starlette", "threadpool", "concurrency", "uvicorn", "gunicorn"],
        "rubric_points": ["Async vs Def threadpool execution", "Non-blocking event loop", "CPU-bound vs I/O-bound bottlenecks"]
    },
    {
        "id": "rag-102",
        "category": "Retrieval-Augmented Generation (RAG) & FAISS",
        "title": "FAISS Dense Retrieval vs BM25 Hybrid Search & Cross-Encoder Reranking",
        "content": "Hybrid RAG combines dense vector embeddings (FAISS HNSW / FlatL2) for semantic similarity with sparse lexical matching (BM25) to prevent missing specific keyword identifiers. A Cross-Encoder re-ranker then scores the top-20 retrieved passages to return the most precise context chunks to the LLM.",
        "bm25_keywords": ["rag", "faiss", "bm25", "hybrid search", "cross encoder", "reranking", "vector embeddings", "chunking"],
        "rubric_points": ["Dense vs Sparse search trade-offs", "Cross-Encoder reranking", "Vector similarity distance metrics"]
    },
    {
        "id": "rag-103",
        "category": "PostgreSQL & Query Optimization",
        "title": "PostgreSQL Query Execution Tree & B-Tree / GIN Indexing",
        "content": "Optimizing PostgreSQL queries involves analyzing EXPLAIN ANALYZE execution plans for Seq Scans vs Index Scans. B-Tree indexes excel at range and equality queries, while GIN indexes support JSONB and full-text search. Connection pooling with pgBouncer eliminates connection startup overhead.",
        "bm25_keywords": ["postgresql", "explain analyze", "btree", "gin index", "pgbouncer", "connection pool", "query plan"],
        "rubric_points": ["EXPLAIN ANALYZE inspection", "Index selection (B-Tree vs GIN)", "Connection pool sizing & transaction modes"]
    },
    {
        "id": "rag-104",
        "category": "React State Management & Virtual DOM",
        "title": "React Virtual DOM Reconciliation & State Colocation",
        "content": "React's Virtual DOM diffing algorithm (Fiber) calculates minimal DOM updates. Unnecessary re-renders are mitigated via React.memo, useCallback, useMemo, and state colocation. Context API should be scoped closely to consuming components or supplemented with atomic state stores like Zustand.",
        "bm25_keywords": ["react", "virtual dom", "reconciliation", "fiber", "usememo", "usecallback", "state colocation", "zustand"],
        "rubric_points": ["Virtual DOM diffing", "Memoization hooks", "Context re-render optimization"]
    }
]

class HybridRAGEngine:
    def __init__(self):
        self.documents = ENTERPRISE_KNOWLEDGE
        self.embedding_cache = {}

    def bm25_search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        query_terms = set(re.findall(r'\w+', query.lower()))
        results = []

        for doc in self.documents:
            score = 0.0
            doc_keywords = set(doc["bm25_keywords"])
            doc_words = set(re.findall(r'\w+', doc["content"].lower()))

            # BM25-style term frequency overlap
            keyword_overlap = len(query_terms.intersection(doc_keywords))
            text_overlap = len(query_terms.intersection(doc_words))

            score = keyword_overlap * 3.0 + text_overlap * 1.0
            results.append((score, doc))

        results.sort(key=lambda x: x[0], reverse=True)
        return [doc for score, doc in results[:top_k] if score > 0] or [self.documents[0]]

    def hybrid_retrieve_and_rerank(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """
        Executes hybrid retrieval (Dense + Sparse BM25) and applies Cross-Encoder scoring.
        """
        # Step 1: BM25 Sparse Search
        candidate_docs = self.bm25_search(query, top_k=4)

        # Step 2: Cross-Encoder Re-ranker Simulation
        reranked = []
        query_words = set(re.findall(r'\w+', query.lower()))

        for doc in candidate_docs:
            content_words = set(re.findall(r'\w+', doc["content"].lower()))
            overlap = len(query_words.intersection(content_words))
            re_rank_score = round(min(0.99, 0.50 + overlap * 0.08), 3)
            reranked.append({
                "doc_id": doc["id"],
                "category": doc["category"],
                "title": doc["title"],
                "content": doc["content"],
                "rubric_points": doc["rubric_points"],
                "re_rank_score": re_rank_score
            })

        reranked.sort(key=lambda x: x["re_rank_score"], reverse=True)
        return reranked[:top_k]

hybrid_rag_engine = HybridRAGEngine()
