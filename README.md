# PrepBoat AI - Placement Preparation & Career Readiness Platform

PrepBoat AI is a full-stack, startup-grade web application built to help students prepare for placements, coding tests, and career growth. The platform integrates structural practice modules (DSA, Aptitude, SQL, CS Cores), a timed mock test engine with auto-grading, dynamic analytics dashboards, an interview shared experience forum, and AI-powered career assistants.

---

## Technical Stack

- **Frontend**: React, React Router, Axios, Tailwind CSS, Recharts, Framer Motion
- **Backend**: FastAPI (Python), SQLAlchemy ORM
- **Database**: SQLite (local developer fallback) / MySQL (Production)
- **Authentication**: JWT Token Bearer Security with direct Bcrypt hashing
- **AI Core**: Google Gemini model mappings (via API key) with full-featured local rules-based engine fallback

---

## Project Folder Structure

```
prepboat/
├── backend/
│   ├── app/
│   │   ├── core/         # Config loader, Database session, security hashes
│   │   ├── models/       # SQLAlchemy ORM Tables
│   │   ├── schemas/      # Pydantic validation models
│   │   ├── services/     # Gemini integrations & PDF Resume parsing
│   │   ├── routers/      # Fast API router endpoints
│   │   ├── main.py       # App launch entrypoint
│   │   └── seed.py       # DB initial seeder script
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/   # Layout, Sidebar, Header, StatCard
    │   ├── context/      # global Auth & Theme contexts
    │   ├── services/     # Axios client interface
    │   ├── pages/        # Dashboard, Editor, Timers, AI Scanners, Chat
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Local Setup & Run Guide

### Prerequisite
Make sure you have **Python 3.10+** and **Node.js 18+** installed on your system.

### 1. Backend Setup

Open a terminal in the root `prepboat` directory and run:

```bash
# Navigate to backend directory
cd backend

# Create a python virtual environment
python -m venv .venv

# Activate the virtual environment (Windows)
.venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Run database seeder to initialize prepboat.db with sample data
python -m app.seed

# Start the FastAPI dev server
uvicorn app.main:app --reload
```

The backend API will start running on **`http://localhost:8000`**. You can view the automated Swagger API documentation at **`http://localhost:8000/docs`**.

> [!TIP]
> **Gemini API Integration**: Add `GEMINI_API_KEY=your_key` in `backend/.env` to enable live Gemini AI responses in roadmaps, chatbot, and question generation. If omitted, the system falls back gracefully to realistic, high-quality rule-based local generators!

---

### 2. Frontend Setup

Open a new terminal window in the root `prepboat` directory and run:

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the React Vite dev server
npm run dev
```

The frontend application will start running on **`http://localhost:5173`**. Open it in your browser.

---

## Quick Demo Logins

When on the Login screen, you can use the quick login buttons or enter:

- **Student User**: `student@prepboat.com` / `student123`
- **Admin User**: `admin@prepboat.com` / `admin123`

---

## Production Deployment Checklist

### Frontend -> Vercel
- Target deployment directory: `frontend/`
- Build command: `npm run build`
- Output directory: `dist/`
- Set Env variable: `VITE_API_URL` to your deployed backend URL.

### Backend -> Render
- Environment: Python
- Build command: `pip install -r backend/requirements.txt`
- Start command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
- Set Env variables: `JWT_SECRET`, `DATABASE_URL` ( रेलवे/railway MySQL connection string), and `GEMINI_API_KEY`.
