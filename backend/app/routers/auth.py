from datetime import datetime, timedelta, timezone
import random
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.core.config import settings
from app.models.database_models import User
from app.schemas.database_schemas import UserCreate, UserOut, LoginRequest, Token, UserUpdate

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login-form")

def validate_google_mail(email: str):
    email_clean = email.lower().strip()
    if not (email_clean.endswith("@gmail.com") or email_clean.endswith("@googlemail.com")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="invalid mail"
        )

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    email = decode_access_token(token)
    if email is None:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    email_clean = user_in.email.lower().strip()
    validate_google_mail(email_clean)
    # Check if user already exists
    user = db.query(User).filter(User.email == email_clean).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="already registered"
        )
    
    # Create new user
    hashed_pwd = hash_password(user_in.password)
    db_user = User(
        name=user_in.name,
        email=email_clean,
        password_hash=hashed_pwd,
        college=user_in.college,
        branch=user_in.branch,
        cgpa=user_in.cgpa,
        target_role=user_in.target_role,
        profile_photo=user_in.profile_photo,
        role=user_in.role or "student"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    email_clean = login_data.email.lower().strip()
    validate_google_mail(email_clean)
    user = db.query(User).filter(User.email == email_clean).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

# Endpoint for OAuth2PasswordBearer support if testing with Swagger UI
from fastapi.security import OAuth2PasswordRequestForm
@router.post("/login-form")
def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    username_clean = form_data.username.lower().strip()
    validate_google_mail(username_clean)
    user = db.query(User).filter(User.email == username_clean).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_current_user(user_update: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_update.name is not None:
        current_user.name = user_update.name
    if user_update.email is not None:
        email_clean = user_update.email.lower().strip()
        validate_google_mail(email_clean)
        # Check if email is taken
        existing = db.query(User).filter(User.email == email_clean, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email is already in use by another user.")
        current_user.email = email_clean
    if user_update.college is not None:
        current_user.college = user_update.college
    if user_update.branch is not None:
        current_user.branch = user_update.branch
    if user_update.cgpa is not None:
        current_user.cgpa = user_update.cgpa
    if user_update.target_role is not None:
        current_user.target_role = user_update.target_role
    if user_update.profile_photo is not None:
        current_user.profile_photo = user_update.profile_photo
    if user_update.password is not None:
        current_user.password_hash = hash_password(user_update.password)
        
    db.commit()
    db.refresh(current_user)
    return current_user

from pydantic import BaseModel

class ForgotPasswordRequest(BaseModel):
    email: str

class VerifyResetCodeRequest(BaseModel):
    email: str
    code: str

class ResetPasswordRequest(BaseModel):
    email: str
    code: str
    password: str

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = request.email.lower().strip()
    validate_google_mail(email)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Enter valid email address"
        )
    
    # Generate 6-digit code
    code = f"{random.randint(100000, 999999)}"
    user.reset_code = code
    user.reset_code_expires = datetime.now(timezone.utc) + timedelta(minutes=15)
    db.commit()
    
    # Send code via email
    from app.services.mail_service import MailService
    email_sent = MailService.send_reset_code(email, code, user.name)
    
    return {
        "message": "A verification code has been sent to your email address.",
        "email_sent": email_sent,
        "email": email
    }

@router.post("/verify-reset-code")
def verify_reset_code(request: VerifyResetCodeRequest, db: Session = Depends(get_db)):
    email = request.email.lower().strip()
    validate_google_mail(email)
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.reset_code or user.reset_code != request.code.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The verification code is invalid."
        )
        
    # Check expiry
    expires = user.reset_code_expires
    if expires:
        if expires.tzinfo is None:
            now_val = datetime.utcnow()
        else:
            now_val = datetime.now(timezone.utc)
            
        if now_val > expires:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The verification code has expired."
            )
            
    return {"valid": True, "message": "Code verified successfully."}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = request.email.lower().strip()
    validate_google_mail(email)
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.reset_code or user.reset_code != request.code.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The verification code is invalid."
        )
        
    # Check expiry
    expires = user.reset_code_expires
    if expires:
        if expires.tzinfo is None:
            now_val = datetime.utcnow()
        else:
            now_val = datetime.now(timezone.utc)
            
        if now_val > expires:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The verification code has expired."
            )
            
    # Hashing the new password
    user.password_hash = hash_password(request.password)
    user.reset_code = None
    user.reset_code_expires = None
    db.commit()
    return {"message": "Your password has been successfully reset. You can now log in."}

@router.get("/check-email")
def check_email(email: str, db: Session = Depends(get_db)):
    email_clean = email.lower().strip()
    validate_google_mail(email_clean)
    user = db.query(User).filter(User.email == email_clean).first()
    return {"exists": user is not None}

class GoogleLoginRequest(BaseModel):
    email: str
    name: Optional[str] = None

@router.post("/google-login", response_model=Token)
def google_login(request: GoogleLoginRequest, db: Session = Depends(get_db)):
    email_clean = request.email.lower().strip()
    validate_google_mail(email_clean)
    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        # Auto-create user if they sign in with Google for the first time
        hashed_pwd = hash_password("google_oauth_placeholder_123!")
        display_name = request.name or email_clean.split("@")[0].capitalize()
        user = User(
            name=display_name,
            email=email_clean,
            password_hash=hashed_pwd,
            role="student"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/verify-email")
def verify_email():
    return {"message": "Your email address has been successfully verified."}
