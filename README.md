# AI Interview Assistant Platform 🚀

Full-stack AI platform designed to conduct real-time voice and text interviews, automated resume parsing, Retrieval-Augmented Generation (RAG) answer evaluation using LangChain & FAISS, comprehensive feedback dashboards, and personalized learning roadmaps.

## 🌟 Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL / SQLite
- **AI / RAG**: LangChain, FAISS Vector Database, PyPDF / docx NLP Resume Parsing
- **Frontend**: React (Vite), Lucide Icons, Glassmorphism CSS Design System, Web Speech API (TTS & STT)
- **Containerization**: Docker, Docker Compose

---

## 🛠️ Key Features

1. **Automated Resume Parsing**:
   - Drag & drop PDF/DOCX/TXT resumes.
   - Extracts candidate contact info, skill tags, experience years, and generates structured profiles.

2. **Real-time Voice & Text Interview Studio**:
   - **Voice Mode**: AI Interviewer TTS avatar reads questions aloud; Web Speech API STT records voice transcriptions with dynamic animated audio visualizers.
   - **Text / Code Mode**: Integrated editor for writing code & technical explanations with live word counts and timers.

3. **RAG Evaluation Pipeline (LangChain + FAISS)**:
   - Indexes domain knowledge, system design patterns, and evaluation rubrics.
   - Computes multi-dimensional scores: Technical Accuracy, Problem Solving, Communication, Code Quality.

4. **Executive Analytics Dashboard**:
   - Overall score card, sub-score progress bars, verified technical strengths, and targeted improvement areas.

5. **Personalized Learning Roadmap**:
   - Interactive milestone timeline of recommended learning modules, hands-on practice projects, and official resource documentation.

---

## 🚀 Quick Start (Local Execution)

### 1. Backend Setup (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
python main.py
```
Backend API will run at `http://localhost:8000`. Interactive OpenAPI docs at `http://localhost:8000/api/docs`.

### 2. Frontend Setup (React)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend application will be accessible at `http://localhost:3000`.

---

## 🐳 Docker Deployment

To launch the full stack (PostgreSQL + FastAPI + React) in Docker containers:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`
