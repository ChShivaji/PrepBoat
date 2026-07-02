from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.core.database import get_db
from app.routers.auth import get_current_user
from app.models.database_models import User, InterviewExperience
from app.schemas.database_schemas import ExperienceOut, ExperienceCreate

router = APIRouter(prefix="/api/experiences", tags=["Interview Experience Portal"])

@router.get("", response_model=List[ExperienceOut])
def list_experiences(
    company: Optional[str] = None,
    role: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(InterviewExperience)

    if company:
        query = query.filter(InterviewExperience.company.like(f"%{company}%"))
    if role:
        query = query.filter(InterviewExperience.role.like(f"%{role}%"))
    if search:
        query = query.filter(
            or_(
                InterviewExperience.company.like(f"%{search}%"),
                InterviewExperience.role.like(f"%{search}%"),
                InterviewExperience.experience_text.like(f"%{search}%"),
                InterviewExperience.questions_asked.like(f"%{search}%")
            )
        )

    experiences = query.order_by(InterviewExperience.created_at.desc()).all()
    
    # Map experiences to outgoing schema & fetch author name
    results = []
    for exp in experiences:
        author = db.query(User).filter(User.id == exp.user_id).first()
        author_name = author.name if author else "Anonymous Student"
        
        exp_out = ExperienceOut.from_orm(exp)
        exp_out.user_name = author_name
        results.append(exp_out)

    return results

@router.get("/{experience_id}", response_model=ExperienceOut)
def get_experience(
    experience_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exp = db.query(InterviewExperience).filter(InterviewExperience.id == experience_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")

    author = db.query(User).filter(User.id == exp.user_id).first()
    author_name = author.name if author else "Anonymous Student"

    exp_out = ExperienceOut.from_orm(exp)
    exp_out.user_name = author_name
    return exp_out

@router.post("", response_model=ExperienceOut, status_code=status.HTTP_201_CREATED)
def create_experience(
    exp_in: ExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_exp = InterviewExperience(
        user_id=current_user.id,
        company=exp_in.company,
        role=exp_in.role,
        difficulty=exp_in.difficulty,
        experience_text=exp_in.experience_text,
        questions_asked=exp_in.questions_asked,
        tips=exp_in.tips,
        likes_count=0
    )
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)

    exp_out = ExperienceOut.from_orm(db_exp)
    exp_out.user_name = current_user.name
    return exp_out

@router.post("/{experience_id}/like", response_model=dict)
def like_experience(
    experience_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exp = db.query(InterviewExperience).filter(InterviewExperience.id == experience_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")

    exp.likes_count += 1
    db.commit()
    return {"message": "Experience upvoted", "likes_count": exp.likes_count}
