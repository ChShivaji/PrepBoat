import json
import sqlite3
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.database_models import User, Question, Test, TestQuestion

def seed_more_tests():
    db = SessionLocal()
    try:
        # Find admin user
        admin = db.query(User).filter(User.role == "admin").first()
        if not admin:
            admin = db.query(User).first()
        if not admin:
            print("No users found. Please run seed.py first.")
            return

        admin_id = admin.id
        print(f"Using Admin ID: {admin_id}")

        questions_list = []

        # =========================================================================
        # 1. MINDTREE SPECIFIC QUESTIONS
        # =========================================================================
        
        # Q1: Coding Question (Vowels & Consonants)
        vc_cases = [
            {"input": "Hello World", "output": [3, 7]},
            {"input": "PrepBoat", "output": [3, 5]},
            {"input": "123 ae", "output": [2, 0]}
        ]
        vc_sols = {
            "python": "def countVowelsAndConsonants(s):\n    vowels = set('aeiouAEIOU')\n    v_count = 0\n    c_count = 0\n    for char in s:\n        if char.isalpha():\n            if char in vowels:\n                v_count += 1\n            else:\n                c_count += 1\n    return [v_count, c_count]",
            "javascript": "function countVowelsAndConsonants(s) {\n    const vowels = new Set('aeiouAEIOU');\n    let v_count = 0;\n    let c_count = 0;\n    for (let i = 0; i < s.length; i++) {\n        const char = s[i];\n        if (/[a-zA-Z]/.test(char)) {\n            if (vowels.has(char)) {\n                v_count++;\n            } else {\n                c_count++;\n            }\n        }\n    }\n    return [v_count, c_count];\n}",
            "java": "class Solution {\n    public int[] countVowelsAndConsonants(String s) {\n        int v_count = 0;\n        int c_count = 0;\n        String vowels = \"aeiouAEIOU\";\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (Character.isLetter(c)) {\n                if (vowels.indexOf(c) != -1) {\n                    v_count++;\n                } else {\n                    c_count++;\n                }\n            }\n        }\n        return new int[]{v_count, c_count};\n    }\n}",
            "cpp": "class Solution {\npublic:\n    vector<int> countVowelsAndConsonants(string s) {\n        int v_count = 0;\n        int c_count = 0;\n        string vowels = \"aeiouAEIOU\";\n        for (char c : s) {\n            if (isalpha(c)) {\n                if (vowels.find(c) != string::npos) {\n                    v_count++;\n                } else {\n                    c_count++;\n                }\n            }\n        }\n        return {v_count, c_count};\n    }\n};"
        }
        vc_starters = {
            "python": "def countVowelsAndConsonants(s):\n    # Write your Python code here\n    pass",
            "javascript": "function countVowelsAndConsonants(s) {\n    // Write your JavaScript code here\n    \n}",
            "java": "class Solution {\n    public int[] countVowelsAndConsonants(String s) {\n        // Write your Java code here\n        \n    }\n}",
            "cpp": "class Solution {\npublic:\n    vector<int> countVowelsAndConsonants(string s) {\n        // Write your C++ code here\n        \n    }\n}"
        }
        mt_q1 = Question(
            title="Count Vowels and Consonants",
            description="Write a function `countVowelsAndConsonants` that takes a string `s` and returns an array of two integers: the first integer should be the count of vowels (a, e, i, o, u, case-insensitive) in the string, and the second should be the count of consonants (alphabetic characters that are not vowels). Ignore digits, spaces, and punctuation.\n\nExample:\n- Input: `\"Hello World\"` -> Output: `[3, 7]` (Vowels: e, o, o. Consonants: H, l, l, W, r, l, d)\n- Input: `\"PrepBoat\"` -> Output: `[3, 5]`",
            difficulty="Easy", topic="Strings", category="DSA", tags="Strings,Arrays",
            company_tags="Mindtree,TCS",
            solution=vc_sols["python"],
            explanation="Scan the string character by character. Check if character is a letter. If it is, check if it exists in the vowel set. Increment vowel or consonant counter accordingly.",
            entrypoint="countVowelsAndConsonants",
            test_cases=json.dumps(vc_cases),
            solutions_json=json.dumps(vc_sols),
            starters_json=json.dumps(vc_starters)
        )

        # Q2: Conceptual DBMS
        mt_q2 = Question(
            title="DBMS Indexing: B-Trees vs Hash Indexing",
            description="Explain the core differences between B-Tree indexes and Hash indexes in database management systems. In what scenarios is each type preferred?",
            difficulty="Medium", topic="DBMS", category="Core Subjects", tags="DBMS,Indexing",
            company_tags="Mindtree,Oracle",
            solution="B-Tree Index:\n- Keeps keys in a sorted balanced tree structure.\n- Supports range queries (e.g. `WHERE age BETWEEN 20 AND 30`) and prefix matching.\n- Query complexity is O(log N).\n\nHash Index:\n- Uses a hash table key-value map.\n- Supports point lookup queries ONLY (e.g. `WHERE id = 5`). Does not support range scans.\n- Query complexity is O(1) on average.",
            explanation="Use B-Trees for general indexes supporting ranges and sorted queries. Use Hash Indexes for direct matches on unique key Lookups."
        )

        # Q3: OS Memory
        mt_q3 = Question(
            title="Operating Systems: Virtual Memory Page Faults",
            description="What is a Page Fault in virtual memory management? Detail the exact sequence of events that the Operating System performs to handle a page fault.",
            difficulty="Hard", topic="Operating Systems", category="Core Subjects", tags="OS,Paging",
            company_tags="Mindtree,Microsoft",
            solution="A Page Fault occurs when a program attempts to access a memory block mapped to its virtual address space but is not currently loaded in physical RAM (invalid bit set in page table).\nOS handling sequence:\n1. Trap to Operating System: CPU generates an interrupt.\n2. State Saved: CPU registers and process state are saved.\n3. Disk Access: OS looks up the page location on disk swap space.\n4. Allocate Frame: OS finds a free physical frame in RAM (running page replacement like LRU if full).\n5. Disk Read: OS schedules disk read to load the page into the frame.\n6. Update Page Table: OS updates the page table entry, marking the page as valid (present).\n7. Resume Instruction: CPU restarts the instruction that caused the fault.",
            explanation="Page fault maps disk-backed pages into memory frames on demand."
        )

        # Q4: Aptitude (Work & Time)
        mt_q4 = Question(
            title="Mindtree Aptitude: Work Rate Joint Effort",
            description="A can complete a task in 8 days. B can complete the same task in 12 days. They work together for 3 days, then B leaves. How many more days will A need to finish the remaining work?",
            difficulty="Easy", topic="Aptitude", category="Aptitude", tags="Aptitude,Time Work",
            company_tags="Mindtree,Accenture",
            solution="A's daily work rate = 1/8.\nB's daily work rate = 1/12.\nCombined daily rate = 1/8 + 1/12 = 5/24.\nWork completed in 3 days = 3 * (5/24) = 5/8.\nRemaining work = 1 - 5/8 = 3/8.\nTime taken by A to complete remaining work = (3/8) / (1/8) = 3 days.",
            explanation="Calculate daily rates, compute joint work done, find remaining work, and divide by the single worker's rate."
        )

        # Q5: Networks
        mt_q5 = Question(
            title="Computer Networks: DNS Resolution Steps",
            description="Detail the step-by-step resolution process when a browser requests the URL 'www.google.com'. Explain recursive vs iterative queries.",
            difficulty="Medium", topic="Computer Networks", category="Core Subjects", tags="Networks,DNS",
            company_tags="Mindtree,Cisco",
            solution="DNS Resolution sequence:\n1. Browser checks cache. If not found, requests Local DNS Resolver (recursive query).\n2. Local Resolver queries DNS Root Servers (iterative) -> returns Top-Level Domain (TLD) server IP (.com).\n3. Local Resolver queries TLD Server (iterative) -> returns Authoritative Name Server IP (google.com).\n4. Local Resolver queries Authoritative Server -> returns IP address for www.google.com.\n5. Resolver caches and returns IP to browser.\n\nRecursive Query: Resolver takes full responsibility to find the IP, returning a final answer.\nIterative Query: Server returns the best referrer reference (next hop IP) it knows.",
            explanation="DNS resolves human-readable names to network IP addresses using hierarchical iterative queries."
        )
        
        questions_list.extend([mt_q1, mt_q2, mt_q3, mt_q4, mt_q5])

        # =========================================================================
        # 2. TESTBOOK SPECIFIC APTITUDE QUESTIONS
        # =========================================================================
        
        tb_q1 = Question(
            title="Testbook Quantitative: Work Joint Rate",
            description="Three pipes A, B, and C can fill a water tank in 6 hours. After working together for 2 hours, pipe C is closed and A and B fill the remaining tank in 7 hours. How many hours will pipe C take alone to fill the tank?",
            difficulty="Medium", topic="Aptitude", category="Aptitude", tags="Aptitude,Pipes",
            company_tags="TCS,Infosys",
            solution="A, B, and C combined fill rate = 1/6.\nIn 2 hours, they fill = 2 * (1/6) = 1/3 of the tank.\nRemaining tank = 1 - 1/3 = 2/3.\nRemaining 2/3 is filled by A and B in 7 hours.\nSo A and B combined fill rate = (2/3) / 7 = 2/21.\nWe know (A + B + C) = 1/6.\nSo C's rate = (A + B + C) - (A + B) = 1/6 - 2/21 = (7 - 4)/42 = 3/42 = 1/14.\nPipe C alone will take 14 hours.",
            explanation="Use combined fractional rates, subtract combined rate of A+B from total rate of A+B+C to find C's rate."
        )

        tb_q2 = Question(
            title="Testbook Logical: Linear Seating Arrangement",
            description="Five friends P, Q, R, S, and T are sitting in a row facing North. S is sitting immediately between P and T. Q is sitting to the immediate right of T. R is sitting at the extreme left. Who is sitting in the middle?",
            difficulty="Easy", topic="Aptitude", category="Aptitude", tags="Aptitude,Logical",
            company_tags="Infosys,Capgemini",
            solution="Given clues:\n1. R is at the extreme left. Row starts: R, _, _, _, _\n2. Q is to the immediate right of T. So they sit as: [T, Q]\n3. S is immediately between P and T. So they sit as: [P, S, T]\nCombining [P, S, T] and [T, Q] gives: [P, S, T, Q]\nPlacing this sequence next to R: R, P, S, T, Q\nThe middle position is S.",
            explanation="Translate arrangement constraints into small sequences, align with absolute indices (like left/right ends), and merge them."
        )

        tb_q3 = Question(
            title="Testbook Quantitative: Compound Interest Comparison",
            description="A sum of money doubles itself in 15 years at compound interest. In how many years will it become 8 times itself at the same rate?",
            difficulty="Easy", topic="Aptitude", category="Aptitude", tags="Aptitude,Interest",
            company_tags="Accenture,Wipro",
            solution="Sum becomes 2 times (2^1) in 15 years.\nUnder compound interest, growth is exponential.\nTo become 8 times (which is 2^3):\nTime required = Power * Base Years = 3 * 15 = 45 years.",
            explanation="Compounded growth scales by factors: 1x -> 2x in 15 yrs -> 4x in 30 yrs -> 8x in 45 yrs."
        )

        tb_q4 = Question(
            title="Testbook Logical: Blood Relations Tree",
            description="Pointing to a photograph of a boy, Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to that boy?",
            difficulty="Easy", topic="Aptitude", category="Aptitude", tags="Aptitude,Relations",
            company_tags="Cognizant,Wipro",
            solution="Break down the phrase:\n- 'My mother' refers to Suresh's mother.\n- 'Only son of my mother' refers to Suresh himself (assuming Suresh is male).\n- 'Son of the only son' refers to Suresh's son.\nTherefore, Suresh is the father of the boy.",
            explanation="Trace blood relations from the inside out to resolve reference terms."
        )

        tb_q5 = Question(
            title="Testbook Quantitative: Averages & Weighted Means",
            description="The average weight of 8 persons increases by 2.5 kg when a new person comes in place of one of them weighing 65 kg. What is the weight of the new person?",
            difficulty="Easy", topic="Aptitude", category="Aptitude", tags="Aptitude,Averages",
            company_tags="TCS,Deloitte",
            solution="Total increase in weight for 8 persons = 8 * 2.5 kg = 20 kg.\nSince this increase is caused by replacing a 65 kg person with the new person:\nWeight of new person = Weight of replaced person + Total increase = 65 + 20 = 85 kg.",
            explanation="The difference between the new person's weight and the old person's weight must equal the net weight increase of the group."
        )
        
        questions_list.extend([tb_q1, tb_q2, tb_q3, tb_q4, tb_q5])

        # Save to DB
        print(f"Saving {len(questions_list)} new questions...")
        db.add_all(questions_list)
        db.commit()
        for q in questions_list:
            db.refresh(q)

        # Create tests
        t1 = Test(
            title="Mindtree Placement Specific Mock Test",
            category="Mixed",
            duration_minutes=20,
            total_marks=50,
            created_by=admin_id
        )
        t2 = Test(
            title="Testbook Placement Aptitude Challenge",
            category="Aptitude",
            duration_minutes=15,
            total_marks=50,
            created_by=admin_id
        )

        print("Saving 2 new Tests...")
        db.add_all([t1, t2])
        db.commit()
        db.refresh(t1)
        db.refresh(t2)

        # Map questions
        test_questions_mapping = []
        
        # Test 1 gets first 5 questions (Mindtree)
        for q in questions_list[0:5]:
            test_questions_mapping.append(TestQuestion(test_id=t1.id, question_id=q.id, weight=10))

        # Test 2 gets next 5 questions (Testbook)
        for q in questions_list[5:10]:
            test_questions_mapping.append(TestQuestion(test_id=t2.id, question_id=q.id, weight=10))

        db.add_all(test_questions_mapping)
        db.commit()

        print("Seeded all additional mock tests and mapped questions successfully!")

    except Exception as e:
        print(f"Error in seed_more_tests: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_more_tests()
