import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.routers import auth, questions, mock_tests, analytics, experiences, ai_endpoints

# Initialize database tables on startup
Base.metadata.create_all(bind=engine)

# DB Schema migration for reset password columns
from sqlalchemy import inspect, text
def run_migrations():
    try:
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('users')]
        with engine.begin() as conn:
            if "reset_code" not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN reset_code VARCHAR(100) NULL"))
                print("Migration: Added column reset_code to users table.")
            if "reset_code_expires" not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN reset_code_expires DATETIME NULL"))
                print("Migration: Added column reset_code_expires to users table.")
    except Exception as e:
        print(f"Migration error: {e}")

run_migrations()

app = FastAPI(
    title="PrepBoat AI API",
    description="Backend services for AI-Powered Placement Preparation & Career Readiness Platform",
    version="1.0.0"
)

# Enable CORS for frontend app
origins = [
    "http://localhost:5173",  # React local dev
    "http://127.0.0.1:5173",
    "https://prepboat-ai.vercel.app",
    "*"  # Allow all for deployment ease
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount individual module routes
app.include_router(auth.router)
app.include_router(questions.router)
app.include_router(mock_tests.router)
app.include_router(analytics.router)
app.include_router(experiences.router)
app.include_router(ai_endpoints.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "PrepBoat AI API Backend",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
