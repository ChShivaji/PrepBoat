from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.routers.auth import get_current_user
from app.routers.questions import require_admin
from app.models.database_models import User, Question, Test, TestQuestion, TestResult
from app.schemas.database_schemas import TestOut, TestCreate, TestSubmitRequest, TestResultOut
from datetime import datetime, timezone

router = APIRouter(prefix="/api/tests", tags=["Mock Test Engine"])

@router.get("", response_model=List[TestOut])
def list_tests(
    category: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Test)
    if category:
        query = query.filter(Test.category == category)
    return query.all()

@router.get("/{test_id}", response_model=TestOut)
def get_test(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return test

@router.post("/{test_id}/submit", response_model=TestResultOut)
def submit_test(
    test_id: int,
    submission: TestSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    # Assess score based on submitted answers
    correct_count = 0
    total_score = 0
    total_questions = len(test.questions)

    # Map question_id to test_question mapping weight and database answers
    question_map = {tq.question_id: tq for tq in test.questions}

    for answer in submission.answers:
        tq = question_map.get(answer.question_id)
        if tq and answer.is_correct:
            correct_count += 1
            total_score += tq.weight

    accuracy = (correct_count / total_questions * 100) if total_questions > 0 else 0.0

    # Save test result
    result = TestResult(
        user_id=current_user.id,
        test_id=test_id,
        score=total_score,
        total_questions=total_questions,
        correct_answers=correct_count,
        time_taken=submission.time_taken,
        accuracy=accuracy,
        completed_at=datetime.now(timezone.utc)
    )
    db.add(result)
    db.commit()
    db.refresh(result)

    # Attach test title for frontend convenience
    res_out = TestResultOut.from_orm(result)
    res_out.test_title = test.title
    return res_out

@router.get("/results/history", response_model=List[TestResultOut])
def get_test_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = db.query(TestResult).filter(TestResult.user_id == current_user.id).order_by(TestResult.completed_at.desc()).all()
    
    out_results = []
    for r in results:
        res_out = TestResultOut.from_orm(r)
        # Find test title
        t = db.query(Test).filter(Test.id == r.test_id).first()
        res_out.test_title = t.title if t else "Deleted Test"
        out_results.append(res_out)
        
    return out_results


# ==================== ADMIN ROUTES ====================

@router.post("", response_model=TestOut, dependencies=[Depends(require_admin)])
def create_test(
    test_in: TestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create Test Record
    db_test = Test(
        title=test_in.title,
        category=test_in.category,
        duration_minutes=test_in.duration_minutes,
        total_marks=test_in.total_marks,
        created_by=current_user.id
    )
    db.add(db_test)
    db.commit()
    db.refresh(db_test)

    # Create Mappings for each question
    for q_map in test_in.questions:
        # Check if question exists
        q = db.query(Question).filter(Question.id == q_map.question_id).first()
        if not q:
            # Cleanup created test
            db.delete(db_test)
            db.commit()
            raise HTTPException(
                status_code=400,
                detail=f"Question ID {q_map.question_id} does not exist. Mock test creation aborted."
            )

        db_mapping = TestQuestion(
            test_id=db_test.id,
            question_id=q_map.question_id,
            weight=q_map.weight
        )
        db.add(db_mapping)

    db.commit()
    db.refresh(db_test)
    return db_test
