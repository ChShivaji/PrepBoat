import os
import json
import httpx
import time
import asyncio
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.database_models import Question
from app.core.config import settings

async def process_question(q, client):
    prompt = (
        f"Write optimized reference solutions for the coding question '{q.title}' in the following programming languages: "
        "Python 3, C++, Java, and JavaScript."
    )
    if q.category == "SQL":
        prompt += " Also write a SQL query solution (SQLite dialect)."
    prompt += (
        f"\n\nDescription:\n{q.description}\n\n"
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
    prompt += "}\n\nImportant: Do not wrap the JSON in markdown code blocks. Return ONLY the raw JSON text."

    models = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-2.0-flash"]
    
    # 1. Try Gemini models
    if settings.GEMINI_API_KEY:
        for model in models:
            for attempt in range(2):
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
                    headers = {"Content-Type": "application/json"}
                    data = {
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"responseMimeType": "application/json"}
                    }
                    res = await client.post(url, json=data, headers=headers, timeout=25.0)
                    if res.status_code == 200:
                        res_json = res.json()
                        text = res_json['candidates'][0]['content']['parts'][0]['text']
                        sols_data = json.loads(text.strip())
                        return sols_data
                    elif res.status_code == 429:
                        print(f"Received 429 for {model}. Sleeping 5s...")
                        await asyncio.sleep(5.0)
                    else:
                        break
                except Exception as e:
                    print(f"Error calling {model}: {e}")
                    await asyncio.sleep(1.0)
                
    # 2. Try Pollinations fallback (if Gemini failed/rate limited)
    print(f"Falling back to Pollinations for: {q.title}")
    for attempt in range(3):
        try:
            payload = {
                "messages": [
                    {"role": "system", "content": "You are a professional software engineer. You must return ONLY raw JSON with keys: python, cpp, java, javascript (and sql if SQL category). No explanations, no markdown blocks."},
                    {"role": "user", "content": prompt}
                ],
                "model": "qwen-coder"
            }
            res = await client.post("https://text.pollinations.ai/", json=payload, timeout=25.0)
            if res.status_code == 200 and res.text:
                txt = res.text.strip()
                if txt.startswith("```json"):
                    txt = txt[7:]
                if txt.endswith("```"):
                    txt = txt[:-3]
                sols_data = json.loads(txt.strip())
                return sols_data
            elif res.status_code == 429:
                print(f"Pollinations 429 on attempt {attempt+1}. Sleeping 6s...")
                await asyncio.sleep(6.0)
            else:
                print(f"Pollinations error {res.status_code} on attempt {attempt+1}. Sleeping 3s...")
                await asyncio.sleep(3.0)
        except Exception as e:
            print(f"Pollinations error on attempt {attempt+1}: {e}. Sleeping 3s...")
            await asyncio.sleep(3.0)
            
    return None

async def generate_and_seed():
    db = SessionLocal()
    try:
        # Fetch all questions where solutions are missing or empty
        questions = db.query(Question).all()
        print(f"Total questions in database: {len(questions)}")
        
        missing_solutions = []
        for q in questions:
            # Check if solutions_json is empty or invalid
            has_sol = False
            if q.solutions_json and q.solutions_json != "{}":
                try:
                    sols = json.loads(q.solutions_json)
                    if sols.get("python") or sols.get("sql"):
                        has_sol = True
                except Exception:
                    pass
            if not has_sol:
                missing_solutions.append(q)
                
        print(f"Questions missing solutions: {len(missing_solutions)}")
        if not missing_solutions:
            print("All questions already have solutions seeded!")
            return

        timeout = httpx.Timeout(40.0, connect=15.0)
        async with httpx.AsyncClient(timeout=timeout) as client:
            count = 0
            for q in missing_solutions:
                count += 1
                print(f"[{count}/{len(missing_solutions)}] Processing: {q.title} (ID: {q.id})...")
                sols_data = await process_question(q, client)
                
                if sols_data and isinstance(sols_data, dict):
                    q.solutions_json = json.dumps(sols_data)
                    if q.category == "SQL" and "sql" in sols_data:
                        q.solution = sols_data["sql"]
                    elif "python" in sols_data:
                        q.solution = sols_data["python"]
                    else:
                        q.solution = list(sols_data.values())[0]
                    db.commit()
                    print(f" -> Successfully saved solutions for: {q.title}")
                else:
                    print(f" -> Failed to generate solutions for: {q.title}")
                
                # Enforce rate-limit sleep between questions
                await asyncio.sleep(4.5)

    except Exception as e:
        print("Database error in solution seeder:", e)
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(generate_and_seed())
