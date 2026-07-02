import sys
import os

# Add root folder to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.seed import seed_db
from app.seed_all_companies import seed_all_company_questions
from app.seed_all_solutions import seed_all_solutions_data
from app.seed_new_tests import seed_new_tests_data
from app.seed_more_tests import seed_more_tests_data

def run_all_seeding():
    print("=========================================")
    print("PrepBoat AI - Cloud Database Master Seeding")
    print("=========================================\n")
    
    print("Step 1: Running primary database seed (Users, DSA Questions)...")
    seed_db()
    
    print("\nStep 2: Running bulk company questions seed...")
    seed_all_company_questions()
    
    print("\nStep 3: Seeding detailed solutions...")
    try:
        seed_all_solutions_data()
    except Exception as e:
        print(f"Error seeding solutions: {e}")
        
    print("\nStep 4: Seeding mock tests (Part 1)...")
    try:
        seed_new_tests_data()
    except Exception as e:
        print(f"Error seeding mock tests Part 1: {e}")
        
    print("\nStep 5: Seeding mock tests (Part 2)...")
    try:
        seed_more_tests_data()
    except Exception as e:
        print(f"Error seeding mock tests Part 2: {e}")

    print("\n=========================================")
    print("Master Seeding Completed Successfully!")
    print("=========================================")

if __name__ == "__main__":
    run_all_seeding()
