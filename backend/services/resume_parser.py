import re
import io
from typing import Dict, Any, List
try:
    import pypdf
except ImportError:
    pypdf = None

try:
    import docx
except ImportError:
    docx = None

KNOWN_SKILLS = [
    "Python", "FastAPI", "React", "LangChain", "FAISS", "PostgreSQL", "Docker", 
    "Kubernetes", "AWS", "Azure", "GCP", "PyTorch", "TensorFlow", "Node.js", 
    "TypeScript", "JavaScript", "SQL", "Redis", "Kafka", "GraphQL", "REST API",
    "CI/CD", "Git", "System Design", "Microservices", "C++", "Java", "Go",
    "Pandas", "NumPy", "Scikit-Learn", "NLP", "RAG", "LLMs", "Vector DB"
]

class ResumeParserService:
    @staticmethod
    def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
        filename_lower = filename.lower()
        text = ""

        try:
            if filename_lower.endswith(".pdf"):
                reader = pypdf.PdfReader(io.BytesIO(file_bytes))
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
            elif filename_lower.endswith(".docx"):
                doc = docx.Document(io.BytesIO(file_bytes))
                for para in doc.paragraphs:
                    text += para.text + "\n"
            else:
                # Fallback to UTF-8 text parsing
                text = file_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            text = f"Error extracting text from file {filename}: {str(e)}"

        return text.strip()

    @staticmethod
    def parse_resume(raw_text: str, default_name: str = "Candidate", default_role: str = "Full Stack Engineer") -> Dict[str, Any]:
        # Extract Email
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
        email = email_match.group(0) if email_match else "candidate@example.com"

        # Extract Phone Number
        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', raw_text)
        phone = phone_match.group(0) if phone_match else "+1 (555) 019-2834"

        # Extract Name from top lines if available
        lines = [l.strip() for l in raw_text.split('\n') if l.strip()]
        name = default_name
        if lines and len(lines[0]) < 40 and not '@' in lines[0]:
            name = lines[0]

        # Skill Extraction
        extracted_skills = []
        for skill in KNOWN_SKILLS:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, raw_text, re.IGNORECASE):
                extracted_skills.append(skill)

        # Fallback default skills if resume is short/mock
        if not extracted_skills:
            extracted_skills = ["Python", "FastAPI", "React", "LangChain", "FAISS", "PostgreSQL", "Docker"]

        # Experience calculation heuristic
        years_match = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)', raw_text, re.IGNORECASE)
        if years_match:
            years = max([float(y) for y in years_match])
        else:
            years = 3.5

        # Summary generation
        summary = (
            f"Candidate {name} demonstrates proficiency in {', '.join(extracted_skills[:6])}. "
            f"Brings approximately {years} years of relevant industry experience in software engineering, "
            f"AI platform development, and database architecture."
        )

        return {
            "name": name,
            "email": email,
            "phone": phone,
            "target_role": default_role,
            "experience_years": years,
            "skills": extracted_skills,
            "raw_resume_text": raw_text,
            "parsed_summary": summary
        }
