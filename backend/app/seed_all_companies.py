import os
import json
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.database_models import Question

company_name_map = {
    "tcs": "TCS",
    "jpmorgan": "JPMorgan",
    "google": "Google",
    "wipro": "Wipro",
    "accenture": "Accenture",
    "deloitte": "Deloitte",
    "cisco": "Cisco",
    "microsoft": "Microsoft",
    "cognizant": "Cognizant",
    "oracle": "Oracle",
    "tcscodevita": "TCS CodeVita",
    "infosys": "Infosys"
}

def seed_all_company_questions():
    print("Starting bulk company questions seeding...")
    db = SessionLocal()
    try:
        services_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "services")
        services_dir = os.path.abspath(services_dir)
        
        if not os.path.exists(services_dir):
            print(f"Error: Services directory not found at {services_dir}")
            return
            
        json_files = [f for f in os.listdir(services_dir) if f.endswith("_questions.json")]
        print(f"Found {len(json_files)} company questions JSON files to seed.")
        
        total_added = 0
        total_skipped = 0
        
        for file_name in json_files:
            prefix = file_name.replace("_questions.json", "")
            company_display_name = company_name_map.get(prefix, prefix.capitalize())
            
            file_path = os.path.join(services_dir, file_name)
            with open(file_path, "r", encoding="utf-8") as f:
                questions_data = json.load(f)
                
            print(f"Seeding {len(questions_data)} questions for {company_display_name}...")
            
            company_added = 0
            company_skipped = 0
            
            for q in questions_data:
                # Check if question already exists in database with this company tag
                existing = db.query(Question).filter(
                    Question.title == q["title"],
                    Question.company_tags.like(f"%{company_display_name}%")
                ).first()
                
                if existing:
                    company_skipped += 1
                    continue
                    
                entry = q.get("title", "solve").replace(" ", "").replace("-", "").lower()
                starters = {
                    "python": f"def {entry}():\n    # Write your Python code here\n    pass",
                    "javascript": f"function {entry}() {{\n    // Write your JavaScript code here\n    \n}}",
                    "java": f"class Solution {{\n    public void {entry}() {{\n        // Write your Java code here\n        \n    }}\n}}",
                    "cpp": f"class Solution {{\npublic:\n    void {entry}() {{\n        // Write your C++ code here\n        \n    }}\n}};"
                }
                
                topics_list = q.get("topics", [])
                topics_str = ",".join(topics_list)
                
                desc = q.get("description", "")
                if q.get("examples"):
                    desc += "\n\n### Examples\n```text\n" + q.get("examples") + "\n```"
                    
                new_q = Question(
                    title=q["title"],
                    description=desc,
                    difficulty=q["difficulty"],
                    topic=topics_list[0] if topics_list else "General DSA",
                    category="DSA",
                    tags=topics_str,
                    company_tags=company_display_name,
                    solution="",
                    explanation=q.get("approach", ""),
                    time_complexity=q.get("complexity", "O(N)"),
                    space_complexity="",
                    entrypoint=entry,
                    test_cases="[]",
                    solutions_json="{}",
                    starters_json=json.dumps(starters)
                )
                
                db.add(new_q)
                company_added += 1
                
            db.commit()
            print(f"Done {company_display_name}. Added: {company_added}, Skipped: {company_skipped}")
            total_added += company_added
            total_skipped += company_skipped
            
        print(f"Bulk seeding completed. Total questions added: {total_added}, skipped: {total_skipped}.")
        
    except Exception as e:
        print("Error during bulk seeding:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    seed_all_company_questions()
