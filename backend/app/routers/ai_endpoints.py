from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from app.core.database import get_db
from app.routers.auth import get_current_user
from app.models.database_models import User, UserResume
from app.services.ai_service import AIService
from app.services.resume_service import ResumeService
from app.schemas.database_schemas import AIRoadmapRequest, AIQuestionGenRequest, AIMentorRequest, ResumeGenerationRequest, SummaryGenerationRequest
import io
import json

router = APIRouter(prefix="/api/ai", tags=["AI Career Assistance"])

@router.post("/resume/analyze", response_model=Dict[str, Any])
async def analyze_resume(
    file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    target_role: Optional[str] = Form(""),
    job_description: Optional[str] = Form(""),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    final_text = ""
    
    # 1. Parse PDF if uploaded
    if file:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file extension. Only PDF resume files are accepted."
            )
        try:
            content = await file.read()
            pdf_stream = io.BytesIO(content)
            final_text = ResumeService.parse_pdf(pdf_stream)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse PDF: {str(e)}"
            )
    # 2. Otherwise use pasted text
    elif resume_text and resume_text.strip():
        final_text = resume_text.strip()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either a PDF resume file upload or pasted resume text is required."
        )

    if not final_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume text is empty or could not be extracted."
        )

    # 3. Analyze
    try:
        analysis = await ResumeService.analyze_resume(
            resume_text=final_text,
            target_role=target_role,
            job_description=job_description,
            filename=file.filename if file else None
        )
        
        # Update user's target role if provided
        if target_role and target_role != current_user.target_role:
            current_user.target_role = target_role
            db.commit()
            
        return analysis

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while analyzing the resume: {str(e)}"
        )

@router.post("/roadmap", response_model=Dict[str, Any])
async def get_roadmap(
    request: AIRoadmapRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        roadmap = await AIService.get_roadmap(request.target_role)
        return roadmap
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate roadmap: {str(e)}"
        )

@router.post("/interview-questions", response_model=List[Dict[str, Any]])
async def get_interview_questions(
    request: AIQuestionGenRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        questions = await AIService.generate_interview_questions(request.target_role)
        return questions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate interview questions: {str(e)}"
        )

@router.post("/mentor/chat", response_model=Dict[str, str])
async def chat_with_mentor(
    request: AIMentorRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        # Map conversation history
        history_list = []
        for msg in request.history:
            history_list.append({
                "role": msg.role,
                "content": msg.content
            })
            
        response_text = await AIService.chat_mentor(request.message, history_list)
        return {"response": response_text}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat error: {str(e)}"
        )

@router.post("/resume/generate", response_model=Dict[str, Any])
async def generate_resume(
    request: ResumeGenerationRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        markdown_resume = await ResumeService.generate_optimized_resume(request.model_dump())
        return {"markdown": markdown_resume}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating the resume: {str(e)}"
        )

@router.post("/resume/generate-summary", response_model=Dict[str, Any])
async def generate_summary(
    request: SummaryGenerationRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        summary = await ResumeService.generate_summary(request.model_dump())
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating the summary: {str(e)}"
        )

@router.post("/resume/save")
async def save_resume(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        resume_data_str = json.dumps(payload.get("resume_data", {}))
        optimized_markdown = payload.get("optimized_markdown", "")
        
        user_resume = db.query(UserResume).filter(UserResume.user_id == current_user.id).first()
        if user_resume:
            user_resume.resume_data = resume_data_str
            user_resume.optimized_markdown = optimized_markdown
        else:
            user_resume = UserResume(
                user_id=current_user.id,
                resume_data=resume_data_str,
                optimized_markdown=optimized_markdown
            )
            db.add(user_resume)
            
        db.commit()
        return {"status": "success", "message": "Resume data saved robustly."}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save resume progress: {str(e)}"
        )

@router.get("/resume/load")
async def load_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        user_resume = db.query(UserResume).filter(UserResume.user_id == current_user.id).first()
        if not user_resume:
            return {"resume_data": None, "optimized_markdown": ""}
            
        return {
            "resume_data": json.loads(user_resume.resume_data),
            "optimized_markdown": user_resume.optimized_markdown or ""
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load resume: {str(e)}"
        )



