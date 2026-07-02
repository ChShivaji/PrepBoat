from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
import asyncio
from app.core.database import get_db
from app.routers.auth import get_current_user
from app.models.database_models import User, Question, UserProgress
from app.schemas.database_schemas import (
    QuestionOut, QuestionCreate, QuestionSolveRequest, BookmarkRequest,
    CodeRunRequest, CodeRunResponse
)
from app.services.executor_service import ExecutorService
from datetime import datetime, timezone

router = APIRouter(prefix="/api/questions", tags=["Question Bank"])

@router.get("", response_model=List[QuestionOut])
def list_questions(
    category: Optional[str] = None,
    topic: Optional[str] = None,
    difficulty: Optional[str] = None,
    company: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Question).filter(Question.category != "Aptitude")

    if category:
        query = query.filter(Question.category == category)
    if topic:
        query = query.filter(Question.topic == topic)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)
    if company:
        query = query.filter(Question.company_tags.like(f"%{company}%"))
    if search:
        query = query.filter(
            or_(
                Question.title.like(f"%{search}%"),
                Question.description.like(f"%{search}%"),
                Question.tags.like(f"%{search}%")
            )
        )

    questions = query.all()
    
    # Load user progress for these questions to fill is_solved / is_bookmarked flags
    progress_map = {}
    progress_records = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()
    for prg in progress_records:
        progress_map[prg.question_id] = prg

    results = []
    for q in questions:
        prg = progress_map.get(q.id)
        is_solved = prg.status == "solved" if prg else False
        is_bookmarked = prg.bookmarked if prg else False
        
        # Build response schema object
        q_out = QuestionOut.from_orm(q)
        q_out.is_solved = is_solved
        q_out.is_bookmarked = is_bookmarked
        results.append(q_out)

    return results

@router.get("/{question_id}", response_model=QuestionOut)
def get_question(
    question_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    prg = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.question_id == question_id
    ).first()

    q_out = QuestionOut.from_orm(q)
    q_out.is_solved = prg.status == "solved" if prg else False
    q_out.is_bookmarked = prg.bookmarked if prg else False
    return q_out

@router.post("/{question_id}/solution/generate", response_model=QuestionOut)
async def generate_question_solution(
    question_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
        
    import json
    existing_solutions = {}
    if q.solutions_json:
        try:
            existing_solutions = json.loads(q.solutions_json)
        except Exception:
            pass

    langs_needed = ["python", "cpp", "java", "javascript"]
    if q.category == "SQL":
        langs_needed.append("sql")
        
    has_all = all(lang in existing_solutions and existing_solutions[lang].strip() for lang in langs_needed)
    if has_all and q.solution:
        prg = db.query(UserProgress).filter(
            UserProgress.user_id == current_user.id,
            UserProgress.question_id == question_id
        ).first()
        q_out = QuestionOut.from_orm(q)
        q_out.is_solved = prg.status == "solved" if prg else False
        q_out.is_bookmarked = prg.bookmarked if prg else False
        return q_out

    prompt = (
        f"Generate optimized, clean, and bug-free reference solutions for the coding problem '{q.title}' in the following languages: "
        "Python 3, C++, Java, and JavaScript."
    )
    if q.category == "SQL":
        prompt += " Also generate a SQL query solution (SQLite dialect)."
    prompt += (
        f"\n\nProblem Description:\n{q.description}\n\n"
        "Return ONLY a valid JSON object matching this schema:\n"
        "{\n"
        '  "python": "def entrypoint(): ...",\n'
        '  "cpp": "class Solution { ... }",\n'
        '  "java": "class Solution { ... }",\n'
        '  "javascript": "function entrypoint() { ... }"'
    )
    if q.category == "SQL":
        prompt += ',\n  "sql": "SELECT ..."\n'
    else:
        prompt += "\n"
    prompt += (
        "}\n\n"
        "Important Constraints:\n"
        "1. Do not wrap the JSON object inside markdown backticks (e.g. ```json).\n"
        "2. Do not write any explanatory text outside of the JSON object.\n"
        "3. Provide complete code, no mock placeholders inside code. Ensure the code matches typical interview problem formats."
    )

    import httpx
    from app.core.config import settings

    async def get_ai_solutions():
        models = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-2.0-flash"]
        
        if settings.GEMINI_API_KEY:
            async with httpx.AsyncClient() as client:
                for model in models:
                    for attempt in range(3):
                        try:
                            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
                            headers = {"Content-Type": "application/json"}
                            data = {
                                "contents": [{"parts": [{"text": prompt}]}],
                                "generationConfig": {"responseMimeType": "application/json"}
                            }
                            response = await client.post(url, json=data, headers=headers, timeout=25.0)
                            if response.status_code == 200:
                                res_json = response.json()
                                text = res_json['candidates'][0]['content']['parts'][0]['text']
                                return json.loads(text.strip())
                            elif response.status_code == 429:
                                print(f"API 429 on {model}, attempt {attempt+1}. Sleeping 2.0s...")
                                await asyncio.sleep(2.0)
                            else:
                                break
                        except Exception as e:
                            print(f"API Error on {model}, attempt {attempt+1}: {e}")
                            await asyncio.sleep(1.0)
                            
        # Last resort fallback to Pollinations
        try:
            payload = {
                "messages": [
                    {"role": "system", "content": "You are a professional software engineer coding reference solutions. You must return ONLY raw JSON matching the requested keys, with absolutely no surrounding markdown code blocks or explanations."},
                    {"role": "user", "content": prompt}
                ]
            }
            async with httpx.AsyncClient() as client:
                res = await client.post("https://text.pollinations.ai/", json={
                    "messages": payload["messages"],
                    "jsonMode": True
                }, timeout=20.0)
                if res.status_code == 200 and res.text:
                    txt = res.text.strip()
                    if txt.startswith("```json"):
                        txt = txt[7:]
                    if txt.endswith("```"):
                        txt = txt[:-3]
                    return json.loads(txt.strip())
        except Exception as e:
            print(f"Pollinations fallback error in solution gen: {e}")
        return None

    ai_res = await get_ai_solutions()
    if ai_res and isinstance(ai_res, dict):
        q.solutions_json = json.dumps(ai_res)
        if q.category == "SQL" and "sql" in ai_res:
            q.solution = ai_res["sql"]
        elif "python" in ai_res:
            q.solution = ai_res["python"]
        elif list(ai_res.values()):
            q.solution = list(ai_res.values())[0]
            
        db.commit()
        db.refresh(q)

    prg = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.question_id == question_id
    ).first()
    
    q_out = QuestionOut.from_orm(q)
    q_out.is_solved = prg.status == "solved" if prg else False
    q_out.is_bookmarked = prg.bookmarked if prg else False
    return q_out

from pydantic import BaseModel

class SaveSolutionInput(BaseModel):
    solutions_json: str

@router.post("/{question_id}/solution/save", response_model=QuestionOut)
async def save_question_solution(
    question_id: int,
    data: SaveSolutionInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
        
    import json
    try:
        sols = json.loads(data.solutions_json)
        q.solutions_json = data.solutions_json
        if q.category == "SQL" and "sql" in sols:
            q.solution = sols["sql"]
        elif "python" in sols:
            q.solution = sols["python"]
        elif list(sols.values()):
            q.solution = list(sols.values())[0]
            
        db.commit()
        db.refresh(q)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON solution data: {e}")
        
    prg = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.question_id == question_id
    ).first()
    
    q_out = QuestionOut.from_orm(q)
    q_out.is_solved = prg.status == "solved" if prg else False
    q_out.is_bookmarked = prg.bookmarked if prg else False
    return q_out

@router.post("/{question_id}/run", response_model=CodeRunResponse)
def run_question_code(
    question_id: int,
    run_req: CodeRunRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
        
    res = ExecutorService.run_code(
        language=run_req.language,
        code=run_req.code,
        entrypoint=q.entrypoint,
        test_cases_json=q.test_cases
    )
    return res

@router.post("/{question_id}/solve", response_model=dict)
def solve_question(
    question_id: int,
    solve_data: QuestionSolveRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    # If code is submitted, run the code first to verify
    if solve_data.code and solve_data.language:
        run_res = ExecutorService.run_code(
            language=solve_data.language,
            code=solve_data.code,
            entrypoint=q.entrypoint,
            test_cases_json=q.test_cases
        )
        if not run_res.get("success", False):
            # Test cases failed! Do not mark solved.
            # Return details so frontend knows.
            return {
                "success": False,
                "message": "Test cases failed. Code is incorrect.",
                "status": "failed",
                "results": run_res
            }

    # Otherwise, or if execution succeeded, we mark solved
    prg = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.question_id == question_id
    ).first()

    if prg:
        prg.status = "solved"
        prg.time_spent += solve_data.time_spent
        prg.solved_at = datetime.now(timezone.utc)
    else:
        prg = UserProgress(
            user_id=current_user.id,
            question_id=question_id,
            status="solved",
            time_spent=solve_data.time_spent,
            bookmarked=False,
            solved_at=datetime.now(timezone.utc)
        )
        db.add(prg)

    db.commit()
    return {
        "success": True,
        "message": "All test cases passed! Progress saved successfully.",
        "status": "solved"
    }

@router.post("/{question_id}/bookmark", response_model=dict)
def bookmark_question(
    question_id: int,
    bookmark_data: BookmarkRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    prg = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.question_id == question_id
    ).first()

    if prg:
        prg.bookmarked = bookmark_data.bookmarked
    else:
        prg = UserProgress(
            user_id=current_user.id,
            question_id=question_id,
            status="attempted",  # Default status
            time_spent=0,
            bookmarked=bookmark_data.bookmarked
        )
        db.add(prg)

    db.commit()
    return {"message": "Bookmark state updated successfully", "bookmarked": bookmark_data.bookmarked}


# ==================== ADMIN ROUTES ====================

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation restricted to administrative users only."
        )

@router.post("", response_model=QuestionOut, dependencies=[Depends(require_admin)])
def create_question(question_in: QuestionCreate, db: Session = Depends(get_db)):
    db_q = Question(**question_in.dict())
    db.add(db_q)
    db.commit()
    db.refresh(db_q)
    return QuestionOut.from_orm(db_q)

@router.put("/{question_id}", response_model=QuestionOut, dependencies=[Depends(require_admin)])
def update_question(question_id: int, question_in: QuestionCreate, db: Session = Depends(get_db)):
    db_q = db.query(Question).filter(Question.id == question_id).first()
    if not db_q:
        raise HTTPException(status_code=404, detail="Question not found")
    
    for key, value in question_in.dict().items():
        setattr(db_q, key, value)
        
    db.commit()
    db.refresh(db_q)
    return QuestionOut.from_orm(db_q)

@router.delete("/{question_id}", response_model=dict, dependencies=[Depends(require_admin)])
def delete_question(question_id: int, db: Session = Depends(get_db)):
    db_q = db.query(Question).filter(Question.id == question_id).first()
    if not db_q:
        raise HTTPException(status_code=404, detail="Question not found")
    
    db.delete(db_q)
    db.commit()
    return {"message": "Question deleted successfully", "id": question_id}
