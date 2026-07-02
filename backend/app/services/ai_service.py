import httpx
import json
from app.core.config import settings
from typing import List, Dict, Any

class AIService:
    @staticmethod
    async def get_roadmap(target_role: str) -> Dict[str, Any]:
        """
        Generates a 30-60-90 day roadmap for a given target role.
        Uses Gemini API if key is present; otherwise falls back to highly-detailed mock data.
        """
        role_lower = target_role.lower()
        
        # 1. Try Live Gemini Call if API key exists
        if settings.GEMINI_API_KEY:
            prompt = (
                f"Create a structured 30-60-90 day preparation roadmap for the role of '{target_role}'. "
                f"Return ONLY a JSON object matching this structure: "
                f'{{"role": "{target_role}", "plan_30": {{"title": "Day 1-30: ...", "skills": ["..."], "resources": ["..."], "practice_goals": "..."}}, '
                f'"plan_60": {{"title": "Day 31-60: ...", "skills": ["..."], "resources": ["..."], "practice_goals": "..."}}, '
                f'"plan_90": {{"title": "Day 61-90: ...", "skills": ["..."], "resources": ["..."], "practice_goals": "..."}} }}'
            )
            models = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-2.0-flash"]
            headers = {"Content-Type": "application/json"}
            data = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"responseMimeType": "application/json"}
            }
            async with httpx.AsyncClient() as client:
                for model in models:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
                    try:
                        response = await client.post(url, json=data, headers=headers, timeout=15.0)
                        if response.status_code == 200:
                            res_json = response.json()
                            text = res_json['candidates'][0]['content']['parts'][0]['text']
                            return json.loads(text)
                    except Exception as e:
                        print(f"Gemini API roadmap error with {model}: {e}")

        # 2. Detailed Mock Generator Fallback
        # We define customized profiles for common roles
        if "data" in role_lower or "analyst" in role_lower:
            return {
                "role": target_role,
                "plan_30": {
                    "title": "Day 1-30: Foundation & SQL Mastery",
                    "skills": ["Advanced SQL (Joins, Window Functions, Group By)", "Excel for Business Analytics", "Basic Statistics"],
                    "resources": ["LeetCode SQL 50", "Kaggle SQL Tutorials", "Khan Academy Statistics Course"],
                    "practice_goals": "Solve 30+ SQL queries. Learn to create interactive pivot tables and calculate standard deviation/probabilities."
                },
                "plan_60": {
                    "title": "Day 31-60: Python Data Libraries & BI Tools",
                    "skills": ["Python (Pandas, NumPy, Matplotlib)", "PowerBI or Tableau Dashboards", "Exploratory Data Analysis (EDA)"],
                    "resources": ["Pandas Official User Guide", "Maven Analytics PowerBI Bootcamp", "Kaggle EDA Notebooks"],
                    "practice_goals": "Build 2 interactive dashboard reports. Complete 5 python notebook analyses on public datasets."
                },
                "plan_90": {
                    "title": "Day 61-90: Machine Learning Basics & Mock Interviews",
                    "skills": ["Regression models", "Clustering (K-Means)", "Data storytelling & presentation"],
                    "resources": ["Introduction to Statistical Learning (ISLR)", "Towards Data Science Articles", "PrepBoat Mock Tests"],
                    "practice_goals": "Develop a capstone data analysis project, publish on GitHub. Take 5+ data analytics mock tests."
                }
            }
        elif "front" in role_lower or "react" in role_lower or "ui" in role_lower:
            return {
                "role": target_role,
                "plan_30": {
                    "title": "Day 1-30: Modern JavaScript & CSS Foundations",
                    "skills": ["ES6+ Javascript (Promises, Async/Await)", "CSS Flexbox/Grid", "Tailwind CSS", "Semantic HTML & DOM Manipulation"],
                    "resources": ["MDN Web Docs", "JavaScript.info", "Tailwind CSS Documentation"],
                    "practice_goals": "Build 5 mini-projects (e.g. Weather App, Calculator) using Vanilla JS and Tailwind. Solve 15+ JS-based DSA problems."
                },
                "plan_60": {
                    "title": "Day 31-60: React framework & State Management",
                    "skills": ["React Hooks (useState, useEffect, useContext)", "React Router", "State Management (Redux Toolkit or Zustand)", "Axios Integration"],
                    "resources": ["React.dev New Docs", "Redux Toolkit Quick Start", "FreeCodeCamp React Course"],
                    "practice_goals": "Create a fully functional multi-page dashboard app connecting to a public API. Practice custom hooks creation."
                },
                "plan_90": {
                    "title": "Day 61-90: Performance, Testing & Career Portfolio",
                    "skills": ["Web Vitals optimization", "Unit Testing (Jest/React Testing Library)", "Next.js essentials", "Portfolio optimization"],
                    "resources": ["Lighthouse Performance Docs", "Testing Library Guides", "Next.js Learning Paths"],
                    "practice_goals": "Host your developer portfolio. Optimize a website load score to 90+. Solve mock frontend coding tests."
                }
            }
        else:
            # Default / Software Engineer / Full Stack
            return {
                "role": target_role,
                "plan_30": {
                    "title": "Day 1-30: DSA Core & Language Proficiency",
                    "skills": ["Data Structures (Arrays, Strings, HashMaps, Linked Lists)", "Complexity Analysis (Big O)", "Object Oriented Programming (OOP)"],
                    "resources": ["LeetCode Top Interview 150", "GeeksforGeeks DSA Self Paced", "PrepBoat DSA Question Bank"],
                    "practice_goals": "Solve 40+ Easy/Medium coding challenges. Implement fundamental structures from scratch."
                },
                "plan_60": {
                    "title": "Day 31-60: Advanced DSA & Core Computer Science Subjects",
                    "skills": ["Advanced DSA (Trees, Graphs, Dynamic Programming)", "Database Management Systems (DBMS) & SQL", "Operating Systems & Networking"],
                    "resources": ["NeetCode 150", "Gate Smasher Core Subjects lectures", "PrepBoat SQL Modules"],
                    "practice_goals": "Solve 30+ Tree/Graph/DP problems. Practice writing complex subqueries and transactions."
                },
                "plan_90": {
                    "title": "Day 61-90: Projects, System Design & Mock Interviews",
                    "skills": ["System Design Basics (Scalability, Load Balancers, Caching)", "Mock Interviews & Soft Skills", "Resume optimization"],
                    "resources": ["ByteByteGo System Design", "Tech Dummies Youtube", "PrepBoat Resume Analyzer & Mock Tests"],
                    "practice_goals": "Develop 1 full-stack project. Perform 5 timed mock tests. Read 15+ company interview experiences."
                }
            }

    @staticmethod
    async def generate_interview_questions(target_role: str) -> List[Dict[str, Any]]:
        """
        Generates 50 custom interview questions (Technical, Behavioral, Project-based).
        """
        # Fallback to smart local matching engine
        from app.services.interview_questions_data import get_custom_questions
        return get_custom_questions(target_role)

    @staticmethod
    async def chat_mentor(message: str, history: List[Dict[str, str]]) -> str:
        """
        AI Mentor chat response generator.
        """
        # Try Live Gemini Call
        if settings.GEMINI_API_KEY:
            try:
                system_instruction = (
                    "You are 'Rudra', an expert placement coach, DSA instructor, and interview preparation advisor. "
                    "Your goal is to explain concepts clearly, suggest resources, solve coding doubts, and provide positive encouragement. "
                    "Be brief and format your responses nicely in Markdown."
                )
                formatted_contents = [{"parts": [{"text": system_instruction}]}]
                for hist_msg in history[-6:]:  # Send last 6 messages context
                    formatted_contents.append({
                        "role": "user" if hist_msg['role'] == "user" else "model",
                        "parts": [{"text": hist_msg['content']}]
                    })
                formatted_contents.append({
                    "role": "user",
                    "parts": [{"text": message}]
                })
                
                models = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-2.0-flash"]
                headers = {"Content-Type": "application/json"}
                data = {"contents": formatted_contents}
                
                async with httpx.AsyncClient() as client:
                    for model in models:
                        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
                        try:
                            response = await client.post(url, json=data, headers=headers, timeout=15.0)
                            if response.status_code == 200:
                                res_json = response.json()
                                return res_json['candidates'][0]['content']['parts'][0]['text']
                        except Exception as e:
                            print(f"Gemini API chat error with {model}: {e}")
            except Exception as e:
                print(f"Gemini API Error: {e}. Falling back to default assistant bot...")

        # Try keyless Pollinations.AI API for answering ANY question (acts like ChatGPT/Gemini)
        try:
            system_instruction = (
                "You are 'Rudra', an expert placement coach, DSA instructor, and interview preparation advisor. "
                "Your goal is to explain concepts clearly, suggest resources, solve coding doubts, and provide positive encouragement. "
                "Be brief and format your responses nicely in Markdown."
            )
            # Compile messages for Pollinations
            messages_payload = [{"role": "system", "content": system_instruction}]
            for hist_msg in history[-6:]:
                messages_payload.append({
                    "role": "system" if hist_msg['role'] == 'assistant' else "user",
                    "content": hist_msg['content']
                })
            messages_payload.append({"role": "user", "content": message})
            
            async with httpx.AsyncClient() as client:
                res = await client.post("https://text.pollinations.ai/", json={"messages": messages_payload}, timeout=10.0)
                if res.status_code == 200 and res.text:
                    # Clean response text if it contains markdown markers
                    return res.text
        except Exception as e:
            print(f"Pollinations API Error: {e}. Falling back to local NLP matching...")

        # Fallback to local smart matching NLP logic
        from app.services.interview_questions_data import find_local_answer
        return find_local_answer(message)
