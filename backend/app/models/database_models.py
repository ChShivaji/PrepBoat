from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    college = Column(String(150), nullable=True)
    branch = Column(String(100), nullable=True)
    cgpa = Column(Float, nullable=True)
    target_role = Column(String(100), nullable=True)
    profile_photo = Column(String(255), nullable=True)
    role = Column(String(20), default="student")  # 'student' or 'admin'
    reset_code = Column(String(100), nullable=True)
    reset_code_expires = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    test_results = relationship("TestResult", back_populates="user", cascade="all, delete-orphan")
    experiences = relationship("InterviewExperience", back_populates="user", cascade="all, delete-orphan")
    resume = relationship("UserResume", back_populates="user", uselist=False, cascade="all, delete-orphan")



class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(20), nullable=False)  # 'Easy', 'Medium', 'Hard'
    topic = Column(String(100), nullable=False)       # e.g., 'Arrays', 'Percentages', 'Joins'
    category = Column(String(50), nullable=False)    # 'DSA', 'Aptitude', 'SQL', 'Core Subjects'
    tags = Column(String(255), nullable=True)         # Comma separated
    company_tags = Column(String(255), nullable=True) # Comma separated
    solution = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    time_complexity = Column(String(150), nullable=True)
    space_complexity = Column(String(150), nullable=True)
    entrypoint = Column(String(100), nullable=True)
    test_cases = Column(Text, nullable=True)  # JSON-encoded array of test cases
    solutions_json = Column(Text, nullable=True)  # JSON-encoded dictionary of solutions by language
    starters_json = Column(Text, nullable=True)  # JSON-encoded dictionary of starter templates by language
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user_progress = relationship("UserProgress", back_populates="question", cascade="all, delete-orphan")
    test_mappings = relationship("TestQuestion", back_populates="question", cascade="all, delete-orphan")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    status = Column(String(20), nullable=False)  # 'solved', 'attempted'
    time_spent = Column(Integer, default=0)      # in seconds
    bookmarked = Column(Boolean, default=False)
    solved_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="progress")
    question = relationship("Question", back_populates="user_progress")


class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)  # 'DSA', 'Aptitude', 'SQL', 'Mixed'
    duration_minutes = Column(Integer, nullable=False)
    total_marks = Column(Integer, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    questions = relationship("TestQuestion", back_populates="test", cascade="all, delete-orphan")
    results = relationship("TestResult", back_populates="test", cascade="all, delete-orphan")


class TestQuestion(Base):
    __tablename__ = "test_questions"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    weight = Column(Integer, default=1)  # Points for this question

    # Relationships
    test = relationship("Test", back_populates="questions")
    question = relationship("Question", back_populates="test_mappings")


class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    time_taken = Column(Integer, nullable=False)  # in seconds
    accuracy = Column(Float, nullable=False)      # Percentage
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="test_results")
    test = relationship("Test", back_populates="results")


class InterviewExperience(Base):
    __tablename__ = "interview_experiences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    difficulty = Column(String(20), nullable=False)  # 'Easy', 'Medium', 'Hard'
    experience_text = Column(Text, nullable=False)
    questions_asked = Column(Text, nullable=True)
    tips = Column(Text, nullable=True)
    likes_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="experiences")


class UserResume(Base):
    __tablename__ = "user_resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    resume_data = Column(Text, nullable=False)  # JSON-serialized form inputs
    optimized_markdown = Column(Text, nullable=True) # Optimized LLM text
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="resume")

