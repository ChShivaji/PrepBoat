from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# ==================== AUTH & USER SCHEMAS ====================
class UserBase(BaseModel):
    name: str
    email: EmailStr
    college: Optional[str] = None
    branch: Optional[str] = None
    cgpa: Optional[float] = None
    target_role: Optional[str] = None
    profile_photo: Optional[str] = None
    role: Optional[str] = "student"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    college: Optional[str] = None
    branch: Optional[str] = None
    cgpa: Optional[float] = None
    target_role: Optional[str] = None
    profile_photo: Optional[str] = None
    password: Optional[str] = None

class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    email: Optional[str] = None


# ==================== QUESTION SCHEMAS ====================
class QuestionBase(BaseModel):
    title: str
    description: str
    difficulty: str
    topic: str
    category: str
    tags: Optional[str] = None
    company_tags: Optional[str] = None
    solution: Optional[str] = None
    explanation: Optional[str] = None
    time_complexity: Optional[str] = None
    space_complexity: Optional[str] = None
    entrypoint: Optional[str] = None
    test_cases: Optional[str] = None
    solutions_json: Optional[str] = None
    starters_json: Optional[str] = None

class QuestionCreate(QuestionBase):
    pass

class QuestionOut(QuestionBase):
    id: int
    created_at: datetime
    is_solved: Optional[bool] = False
    is_bookmarked: Optional[bool] = False

    class Config:
        from_attributes = True


# ==================== CODE EXECUTION SCHEMAS ====================
class CodeRunRequest(BaseModel):
    language: str
    code: str

class TestCaseResult(BaseModel):
    test_idx: int
    status: str  # 'passed', 'failed', 'error'
    input: Optional[str] = None
    expected: Optional[str] = None
    actual: Optional[str] = None
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    execution_time: Optional[float] = None

class CodeRunResponse(BaseModel):
    success: bool
    total_tests: int
    passed_tests: int
    results: List[TestCaseResult]
    compile_error: Optional[str] = None


# ==================== PROGRESS SCHEMAS ====================
class QuestionSolveRequest(BaseModel):
    status: str = "solved"  # 'solved' or 'attempted'
    time_spent: int = 0     # in seconds
    code: Optional[str] = None
    language: Optional[str] = None

class BookmarkRequest(BaseModel):
    bookmarked: bool


# ==================== MOCK TEST SCHEMAS ====================
class TestQuestionCreate(BaseModel):
    question_id: int
    weight: int = 1

class TestCreate(BaseModel):
    title: str
    category: str
    duration_minutes: int
    total_marks: int
    questions: List[TestQuestionCreate]

class TestQuestionOut(BaseModel):
    id: int
    weight: int
    question: QuestionOut

    class Config:
        from_attributes = True

class TestOut(BaseModel):
    id: int
    title: str
    category: str
    duration_minutes: int
    total_marks: int
    created_at: datetime
    questions: List[TestQuestionOut]

    class Config:
        from_attributes = True

class TestSubmitAnswer(BaseModel):
    question_id: int
    is_correct: bool  # Simple pass/fail for each question in mockup test engine

class TestSubmitRequest(BaseModel):
    time_taken: int  # in seconds
    answers: List[TestSubmitAnswer]

class TestResultOut(BaseModel):
    id: int
    test_id: int
    test_title: Optional[str] = None
    score: int
    total_questions: int
    correct_answers: int
    time_taken: int
    accuracy: float
    completed_at: datetime

    class Config:
        from_attributes = True


# ==================== INTERVIEW EXPERIENCE SCHEMAS ====================
class ExperienceCreate(BaseModel):
    company: str
    role: str
    difficulty: str
    experience_text: str
    questions_asked: Optional[str] = None
    tips: Optional[str] = None

class ExperienceOut(BaseModel):
    id: int
    user_id: int
    user_name: Optional[str] = None
    company: str
    role: str
    difficulty: str
    experience_text: str
    questions_asked: Optional[str] = None
    tips: Optional[str] = None
    likes_count: int
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== AI SCHEMAS ====================
class AIRoadmapRequest(BaseModel):
    target_role: str

class AIQuestionGenRequest(BaseModel):
    target_role: str

class AIMentorMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class AIMentorRequest(BaseModel):
    message: str
    history: List[AIMentorMessage] = []


# ==================== RESUME CREATOR SCHEMAS ====================
class ExperienceItem(BaseModel):
    company: str
    role: str
    duration: str
    responsibilities: str
    achievements: Optional[str] = ""

class ProjectItem(BaseModel):
    title: str
    tech_stack: str
    description: str
    github_link: Optional[str] = ""
    live_demo: Optional[str] = ""
    key_features: Optional[str] = ""

class EducationItem(BaseModel):
    school: str
    degree: str
    branch: str
    cgpa_or_percentage: str
    start_year: str
    end_year: str

class CertificationItem(BaseModel):
    name: str
    organization: str
    completion_date: Optional[str] = ""
    credential_link: Optional[str] = ""

class SkillsCategory(BaseModel):
    languages: Optional[List[str]] = []
    frameworks: Optional[List[str]] = []
    databases: Optional[List[str]] = []
    tools: Optional[List[str]] = []
    cloud: Optional[List[str]] = []
    soft_skills: Optional[List[str]] = []

class CodingProfiles(BaseModel):
    leetcode: Optional[str] = ""
    hackerrank: Optional[str] = ""
    codechef: Optional[str] = ""
    geeksforgeeks: Optional[str] = ""

class ResumeGenerationRequest(BaseModel):
    name: str
    title: str
    email: str
    phone: str
    location: str
    linkedin: Optional[str] = ""
    github: Optional[str] = ""
    portfolio: Optional[str] = ""
    summary: Optional[str] = ""
    skills: SkillsCategory
    experience: List[ExperienceItem]
    projects: List[ProjectItem]
    education: List[EducationItem]
    certifications: List[CertificationItem]
    achievements: List[str]
    coding_profiles: CodingProfiles

class SummaryGenerationRequest(BaseModel):
    title: str
    skills: List[str]
    experience_summary: Optional[str] = ""

