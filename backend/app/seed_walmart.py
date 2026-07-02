import os
import json
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.database_models import Question

def seed_walmart_questions():
    print("Starting Walmart questions seeding...")
    db = SessionLocal()
    try:
        # Load the questions JSON
        json_path = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "services", "walmart_questions.json")
        json_path = os.path.abspath(json_path)
        
        if not os.path.exists(json_path):
            print(f"Error: JSON file not found at {json_path}")
            return
            
        with open(json_path, "r", encoding="utf-8") as f:
            questions_data = json.load(f)
            
        print(f"Loaded {len(questions_data)} questions from JSON.")
        
        added_count = 0
        skipped_count = 0
        
        for q in questions_data:
            # Check if question already exists in database
            existing = db.query(Question).filter(Question.title == q["title"], Question.company_tags.like("%Walmart%")).first()
            if existing:
                skipped_count += 1
                continue
                
            # Create starter code templates
            entry = q.get("title", "solve").replace(" ", "").replace("-", "").lower()
            starters = {
                "python": f"def {entry}():\n    # Write your Python code here\n    pass",
                "javascript": f"function {entry}() {{\n    // Write your JavaScript code here\n    \n}}",
                "java": f"class Solution {{\n    public void {entry}() {{\n        // Write your Java code here\n        \n    }}\n}}",
                "cpp": f"class Solution {{\npublic:\n    void {entry}() {{\n        // Write your C++ code here\n        \n    }}\n}};"
            }
            
            # Combine topics and round into tags
            topics_list = q.get("topics", [])
            topics_str = ",".join(topics_list)
            
            # Form clean description from description + examples
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
                company_tags="Walmart",
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
            added_count += 1
            
        db.commit()
        print(f"Seeding completed. Added: {added_count}, Skipped: {skipped_count}.")
        
    except Exception as e:
        print("Error during seeding:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    seed_walmart_questions()
