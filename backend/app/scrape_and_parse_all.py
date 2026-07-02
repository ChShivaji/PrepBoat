import os
import re
import json
import httpx
import time
from bs4 import BeautifulSoup

urls = {
    "tcs": "https://www.lets-code.co.in/previousyearcodingquestion/tcspyq/",
    "jpmorgan": "https://www.lets-code.co.in/previousyearcodingquestion/jp-morgan-previous-year-coding-questions/",
    "google": "https://www.lets-code.co.in/previousyearcodingquestion/google-previous-year-coding-questions/",
    "wipro": "https://www.lets-code.co.in/previousyearcodingquestion/wiprocodingquestions/",
    "accenture": "https://www.lets-code.co.in/previousyearcodingquestion/accenturequestions/",
    "deloitte": "https://www.lets-code.co.in/previousyearcodingquestion/deloitte-previous-year-coding-questions/",
    "cisco": "https://www.lets-code.co.in/previousyearcodingquestion/cisco-previous-year-coding-questions/",
    "microsoft": "https://www.lets-code.co.in/previousyearcodingquestion/microsoft-previous-year-coding-questions/",
    "cognizant": "https://www.lets-code.co.in/previousyearcodingquestion/cognizantcodingquestions/",
    "oracle": "https://www.lets-code.co.in/previousyearcodingquestion/oracle-previous-year-coding-questions/",
    "tcscodevita": "https://www.lets-code.co.in/previousyearcodingquestion/tcs-codevita-previous-year-coding-questions/",
    "infosys": "https://www.lets-code.co.in/previousyearcodingquestion/infosys-sp-and-dse-previous-year-coding-questions/"
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

output_dir = r"C:\Users\Shivaji\OneDrive\Documents\Desktop\prepboat\frontend\src\services"
os.makedirs(output_dir, exist_ok=True)

BLACKLIST_KEYWORDS = [
    "about", "hiring", "process", "pattern", "career", "application",
    "interview", "most commonly", "dsa questions by role", "nqt dsa questions",
    "digital dsa questions", "ninja dsa questions", "join", "learning",
    "ai tools", "community", "support", "useful resources", "introduction",
    "why choose", "sp vs dse", "coding round", "preparation", "recommended",
    "online platforms", "books", "youtube", "week before", "day of",
    "conclusion", "history and evolution", "core services", "recruitment",
    "milestones", "services and operations", "part 1", "part 2", "part 3",
    "official", "students", "tips", "why join", "key skills", "curated list",
    "most asked", "arrays & matrices", "strings", "number problems",
    "array & string problems", "mathematical & logic", "tree & graph",
    "sorting & searching", "dynamic programming", "stack & queue",
    "linked list problems", "hash table & set", "oracle-specific",
    "advanced problems", "puzzles and networking-related", "accenture coding questions",
    "wipro elite 2025 coding questions", "wipro elite 2024 coding questions",
    "feedback", "contribute", "join our discord"
]

hiring_processes = {
    "google": [
        {"title": "Stage 1: Resume Screening", "desc": "Recruiters screen profiles for strong CS fundamentals, open-source contributions, or competitive programming achievements.", "tip": "Highlight impact, metrics, and technical contributions on your resume."},
        {"title": "Stage 2: Technical Phone Screen", "desc": "1-2 rounds of 45-60 min live coding with a Google engineer. Focuses on core algorithms, graphs, recursion, or dynamic programming.", "tip": "Google values thinking process, clean code, and time/space complexity analysis."},
        {"title": "Stage 3: Virtual Onsite Loop", "desc": "4-5 rounds of interviews: 3-4 coding rounds testing advanced DSA and system architecture, and 1 behavioral (Googliness) round.", "tip": "Always think out loud, ask clarifying questions, and write tests for edge cases."},
        {"title": "Stage 4: Hiring Committee & Team Matching", "desc": "An independent committee reviews the interview reports to make the final hiring decision, followed by team match calls.", "tip": "Be expressive and align your preferences with team projects."}
    ],
    "microsoft": [
        {"title": "Stage 1: Online Assessment (Codility)", "desc": "A timed 90-minute assessment with 2 to 3 coding problems covering arrays, strings, stacks, or trees.", "tip": "Aim for complete code correctness and test against hidden edge cases."},
        {"title": "Stage 2: Technical Phone Screen", "desc": "A 45-60 min live coding session focusing on core DSA, database queries, or object-oriented design.", "tip": "Be prepared to explain your design choices and discuss project architecture."},
        {"title": "Stage 3: Onsite Interview Loop", "desc": "4 rounds of interviews including 3 coding rounds (LLD/DSA) and 1 system design / architectural round.", "tip": "Master object-oriented design patterns and low-level design diagrams."}
    ],
    "tcs": [
        {"title": "Stage 1: National Qualifier Test (NQT)", "desc": "Integrated assessment evaluating numerical ability, logical reasoning, verbal skills, and hands-on coding.", "tip": "Focus on speed and accuracy. Practice standard foundation programming."},
        {"title": "Stage 2: Technical Interview", "desc": "Face-to-face loop covering final-year projects, programming basics (C++/Java/Python), OOP, DBMS, and simple coding.", "tip": "Prepare core CS subjects like Operating Systems, DBMS concepts, and normalization."},
        {"title": "Stage 3: Managerial & HR Interview", "desc": "Evaluates logical thinking, communication skills, career aspirations, and adaptability to company culture.", "tip": "Keep a positive attitude and demonstrate willingness to learn new technologies."}
    ],
    "wipro": [
        {"title": "Stage 1: Wipro Elite Online Test", "desc": "Aptitude section, logical analysis, verbal skills, and 2 hands-on coding problems on a platform like AMCAT.", "tip": "Brush up on basic arithmetic, logic, and standard coding patterns like arrays and strings."},
        {"title": "Stage 2: Technical Interview", "desc": "Focuses on programming logic, resume projects, basic web development, and database concepts.", "tip": "Be confident about what you wrote in your resume and explain project code clearly."},
        {"title": "Stage 3: HR Interview", "desc": "Verifies communication skills, shifts adaptability, relocation preferences, and documents check.", "tip": "Show flexibility and positive interest in working with Wipro's global projects."}
    ],
    "accenture": [
        {"title": "Stage 1: Cognitive & Technical Assessment", "desc": "Multiple choice questions assessing English ability, critical thinking, abstract reasoning, and pseudocode logic.", "tip": "Practice solving MCQs quickly. Technical sections often test loops, logical operators, and dry runs."},
        {"title": "Stage 2: Coding Assessment", "desc": "2 coding problems to be solved in 45 minutes. Expect array manipulations, strings, or math problems.", "tip": "Code compile correctness is critical. Make sure all sample test cases pass."},
        {"title": "Stage 3: Communication Assessment", "desc": "Automated oral test checking pronunciation, reading fluency, listening, and speaking skills.", "tip": "Speak clearly, maintain a steady pace, and use a good headset in a quiet room."},
        {"title": "Stage 4: Interview (Technical & HR)", "desc": "Interactive loop focusing on final-year projects, tech stack choices, team dynamics, and conflict resolutions.", "tip": "Prepare using the STAR method for behavioral and situational questions."}
    ],
    "deloitte": [
        {"title": "Stage 1: Online Technical Test", "desc": "MCQs on quantitative aptitude, logical reasoning, verbal ability, and programming fundamentals.", "tip": "Focus on time management; do not spend too much time on a single MCQ."},
        {"title": "Stage 2: Group Discussion / Case Study", "desc": "Candidates analyze a real-world business case and collaborate in a group to pitch a strategy.", "tip": "Be collaborative, support your arguments with logic, and avoid speaking over others."},
        {"title": "Stage 3: Technical Interview", "desc": "Covers coding logic, SQL queries, database indexing, web technologies, and systems engineering concepts.", "tip": "Be prepared to write SQL queries on join operations, aggregation, and indexing."},
        {"title": "Stage 4: Partner/HR Round", "desc": "Strategic conversations with director/partner level managers checking long-term aspirations and business fit.", "tip": "Understand Deloitte's consulting model and express enthusiasm for client-facing work."}
    ],
    "cisco": [
        {"title": "Stage 1: Online Assessment (HackerRank)", "desc": "Technical MCQs + 2 coding questions on basic data structures, arrays, strings, or graph traversal.", "tip": "Practice time management. Coding questions are typically of LeetCode Easy-to-Medium difficulty."},
        {"title": "Stage 2: Technical Interview Round 1", "desc": "Covers computer networking (OSI model, TCP/IP, routing protocols), operating systems, and coding.", "tip": "Master networking concepts: IP addressing, subnetting, TCP handshake, and DNS resolution."},
        {"title": "Stage 3: Technical Interview Round 2", "desc": "Focuses on Low-Level Design (LLD), system architecture, live code refactoring, and database queries.", "tip": "Practice designing modular code structures and discuss concurrency/multithreading."},
        {"title": "Stage 4: Managerial & HR Interview", "desc": "Assesses leadership traits, team collaboration scenarios, value alignment, and cultural fit.", "tip": "Be authentic and show strong interest in Cisco's hardware/software ecosystem."}
    ],
    "cognizant": [
        {"title": "Stage 1: Online Assessment", "desc": "AMCAT-based test including quantitative ability, reasoning, verbal skills, and hands-on coding.", "tip": "Ensure that your code is clean and handles standard inputs correctly."},
        {"title": "Stage 2: Technical Interview", "desc": "Discusses coding questions, logic verification, OOP design principles, DBMS queries, and web basics.", "tip": "Prepare to explain differences between OOP concepts like abstract class vs interface."},
        {"title": "Stage 3: HR Round", "desc": "Verifies communication, adaptability, terms and conditions, and details in your resume.", "tip": "Demonstrate professional communication and express willingness to relocate."}
    ],
    "oracle": [
        {"title": "Stage 1: Online Assessment", "desc": "Aptitude and computer science MCQs + 2 coding questions on databases or algorithms.", "tip": "Oracle assessments heavily test database concepts, SQL logic, and basic data structures."},
        {"title": "Stage 2: Technical Interview 1", "desc": "Deep dive into data structures, SQL queries (joins, indexing), and object-oriented programming.", "tip": "Brush up on complex SQL queries, database transaction properties (ACID), and normal forms."},
        {"title": "Stage 3: Technical Interview 2", "desc": "Focuses on system design, multi-threading, concurrency control, and advanced algorithms.", "tip": "Understand how memory management works and talk about resource locking mechanisms."},
        {"title": "Stage 4: HR & Hiring Manager Interview", "desc": "Discussion on career alignment, past projects, oracle cloud systems, and values fit.", "tip": "Show awareness of Oracle's cloud offerings (OCI) and express enthusiasm for client-facing work."}
    ],
    "tcscodevita": [
        {"title": "Stage 1: Pre-Qualifier Round", "desc": "A 6-hour competitive coding challenge with 6 programming problems of varying difficulty levels.", "tip": "You need to solve at least 1-2 questions with all test cases passing to get shortlisted for interview calls."},
        {"title": "Stage 2: Round 2 (Qualifier)", "desc": "A proctored 6-hour coding round for top performers of Stage 1 to filter candidate ranks.", "tip": "Practice competitive programming. Questions require highly optimized time complexity."},
        {"title": "Stage 3: Grand Finale & Interviews", "desc": "Top rankers are called for the Grand Finale and face interview panels for TCS Digital or Innovator roles.", "tip": "Be prepared to perform code walk-throughs of the solutions you submitted in the contest."}
    ],
    "infosys": [
        {"title": "Stage 1: HackWithInfy / Infytq Coding Rounds", "desc": "A competitive coding assessment testing advanced data structures, dynamic programming, and math.", "tip": "Practice topics like graphs, DP, backtracking, and mathematical logic."},
        {"title": "Stage 2: Technical Interview", "desc": "Interviewers verify your coding solutions, and grill on database queries, OOP design, and web stack.", "tip": "Be prepared to dry run your code and explain alternative optimal solutions."},
        {"title": "Stage 3: HR Interview", "desc": "Standard verification loop discussing career growth, relocation, and salary options.", "tip": "Maintain good communication and express long-term interest in technology consulting."}
    ],
    "jpmorgan": [
        {"title": "Stage 1: Online Assessment (HackerRank)", "desc": "2 coding problems to be solved in 60 minutes, focusing on arrays, strings, or heap metrics.", "tip": "Practice speed coding. Problems are typically of LeetCode Medium difficulty."},
        {"title": "Stage 2: HireVue Video Interview", "desc": "Recorded video responses to standard behavioral, situational, and soft-skills questions.", "tip": "Look at the camera, speak clearly, and structure responses with the STAR framework."},
        {"title": "Stage 3: Code for Good Hackathon", "desc": "A 24-hour virtual/onsite hackathon where candidates build real applications for non-profit organizations.", "tip": "Teamwork, collaboration, and agile project delivery are heavily evaluated by JP Morgan mentors."},
        {"title": "Stage 4: Final Technical & Behavioral Loops", "desc": "Conversations on project engineering, database architecture, testing, and team culture.", "tip": "Highlight clean coding practices, microservice designs, and testing methodologies."}
    ]
}

def clean_html(text):
    if not text:
        return ""
    cleaned = re.sub(r'<[^>]+>', '', text)
    cleaned = (cleaned
               .replace("&nbsp;", " ")
               .replace("&amp;", "&")
               .replace("&lt;", "<")
               .replace("&gt;", ">")
               .replace("&quot;", '"')
               .replace("&#39;", "'")
               .replace("&#35;", "#")
               .replace("\u00b7", "·")
               )
    return cleaned.strip()

def is_blacklisted(title):
    t_low = title.lower()
    for kw in BLACKLIST_KEYWORDS:
        if kw in t_low:
            return True
    return False

def parse_company(company_key, html):
    soup = BeautifulSoup(html, "html.parser")
    questions = []
    
    if company_key == "oracle":
        h2_tags = soup.find_all("h2")
        q_id = 1
        for h2 in h2_tags:
            category = h2.get_text().strip()
            if category.lower() in [
                "pyq's", "oracle online assessment & interview questions", 
                "oracle’s hiring process: what to expect", 
                "curated list of oracle’s past year coding questions", 
                "most asked oracle coding questions",
                "useful resources for your placement prep"
            ] or "learning" in category.lower() or "ai tools" in category.lower() or "community" in category.lower() or "support" in category.lower():
                continue
            
            ol = h2.find_next("ol")
            if not ol:
                continue
            
            prev_h2 = ol.find_previous("h2")
            if prev_h2 != h2:
                continue
                
            for li in ol.find_all("li"):
                strong = li.find("strong")
                if not strong:
                    continue
                q_title = strong.get_text().strip()
                
                li_text = li.get_text().strip()
                desc = li_text
                if ":" in li_text:
                    desc = li_text.split(":", 1)[1].strip()
                elif " - " in li_text:
                    desc = li_text.split(" - ", 1)[1].strip()
                
                difficulty = "Medium"
                if any(x in q_title.lower() for x in ["two sum", "reverse", "palindrome", "anagram", "binary search", "fibonacci", "factorial"]):
                    difficulty = "Easy"
                elif any(x in q_title.lower() for x in ["sudoku", "n-queens", "hard", "median", "arbitrage"]):
                    difficulty = "Hard"
                    
                questions.append({
                    "id": q_id,
                    "title": q_title,
                    "difficulty": difficulty,
                    "round": "Interview",
                    "topics": [category.replace("Problems", "").replace("Problems", "").strip()],
                    "leetcode_link": "",
                    "leetcode_num": "",
                    "description": desc,
                    "examples": "",
                    "approach": f"Solve using the standard optimal approach for {q_title}.",
                    "complexity": "O(N) time · O(1) space",
                    "follow_up": "Can you optimize the space complexity further?"
                })
                q_id += 1
    else:
        heading_tags = ["h3"]
        if company_key in ["jpmorgan", "microsoft", "deloitte", "tcscodevita"]:
            heading_tags = ["h2"]
        elif company_key == "accenture":
            heading_tags = ["h3", "h4"]
            
        elements = soup.find_all(heading_tags)
        q_id = 1
        
        for idx, el in enumerate(elements):
            title_text = el.get_text().strip()
            
            if is_blacklisted(title_text):
                continue
                
            if company_key == "accenture" and el.name == "h3":
                continue
                
            clean_title = title_text
            clean_title = re.sub(r'^(?:Problem|Question|Step|Stage)?\s*(?:\d+)?\s*[:\.]\s*', '', clean_title)
            clean_title = re.sub(r'^(?:Problem|Question)\s*\d+\s*[:\-]?\s*', '', clean_title)
            clean_title = re.sub(r'^\d+\s*[:\.]\s*', '', clean_title)
            clean_title = clean_title.strip()
            
            if not clean_title or is_blacklisted(clean_title):
                continue
                
            content_parts = []
            sibling = el.next_sibling
            stop_tags = ["h1", "h2"]
            if el.name in ["h3", "h4"]:
                stop_tags.append("h3")
            if el.name == "h4":
                stop_tags.append("h4")
                
            while sibling:
                if sibling.name in stop_tags:
                    break
                if sibling.name:
                    content_parts.append(sibling)
                sibling = sibling.next_sibling
                
            paragraphs = [p for p in content_parts if p.name == "p"]
            pre_blocks = [pre for pre in content_parts if pre.name == "pre"]
            
            difficulty = "Medium"
            round_type = "Onsite"
            topics = ["General DSA"]
            leetcode_link = ""
            leetcode_num = ""
            description = ""
            examples = ""
            approach = ""
            complexity = "O(N) time · O(1) space"
            follow_up = ""
            
            if "easy" in title_text.lower():
                difficulty = "Easy"
            elif "hard" in title_text.lower():
                difficulty = "Hard"
            elif "medium" in title_text.lower():
                difficulty = "Medium"
                
            if company_key in ["jpmorgan", "microsoft"] and paragraphs:
                first_p = paragraphs[0].get_text().strip()
                if "Difficulty" in first_p:
                    diff_match = re.search(r'Difficulty:\s*(\w+)', first_p, re.IGNORECASE)
                    if diff_match:
                        difficulty = diff_match.group(1).capitalize()
                    
                    topic_match = re.search(r'Topic:\s*([^|\n]+)', first_p, re.IGNORECASE)
                    if topic_match:
                        topics = [t.strip() for t in topic_match.group(1).split(",")]
                        
                    if len(paragraphs) > 1:
                        statement_p = paragraphs[1].get_text().strip()
                    else:
                        statement_p = ""
                else:
                    statement_p = first_p
                    
                if statement_p:
                    stmt = statement_p
                    if "Problem Statement:" in stmt:
                        stmt = stmt.split("Problem Statement:", 1)[1].strip()
                        
                    if "Example:" in stmt:
                        description, rest = stmt.split("Example:", 1)
                        description = description.strip()
                        
                        if "Explanation:" in rest:
                            examples, approach = rest.split("Explanation:", 1)
                            examples = examples.strip()
                            approach = approach.strip()
                        else:
                            examples = rest.strip()
                    else:
                        description = stmt
            else:
                tag_bar = None
                for c in content_parts:
                    if c.name == "div" and "display:flex" in str(c.get("style", "")):
                        tag_bar = c
                        break
                        
                if tag_bar:
                    spans = tag_bar.find_all("span")
                    for span in spans:
                        clean_span = span.get_text().strip()
                        if clean_span in ["OA", "Online Assessment", "Phone Screen", "Onsite", "Interview"]:
                            round_type = clean_span
                        elif "LeetCode:" in clean_span or "#" in clean_span:
                            a_tag = span.find("a")
                            if a_tag:
                                leetcode_link = a_tag.get("href", "")
                            num_match = re.search(r'#(\d+)', clean_span)
                            if num_match:
                                leetcode_num = num_match.group(1)
                        else:
                            parts = [t.strip() for t in clean_span.split("·") if t.strip()]
                            if parts:
                                topics = parts
                                
                desc_texts = []
                for p in paragraphs:
                    p_text = p.get_text().strip()
                    if p_text.startswith("Approach") or p_text.startswith("Complexity") or p_text.startswith("Follow-up"):
                        continue
                    if "Difficulty:" in p_text and "Topic:" in p_text:
                        continue
                    desc_texts.append(p_text)
                description = "\n\n".join(desc_texts)
                
                if pre_blocks:
                    examples = pre_blocks[0].get_text().strip()
                    
                content_html = "".join([str(c) for c in content_parts])
                
                app_match = re.search(r'Approach</strong>:\s*(.*?)(?=<strong|$|<hr)', content_html, re.DOTALL)
                if app_match:
                    approach = clean_html(app_match.group(1))
                    
                comp_match = re.search(r'Complexity</strong>:\s*(.*?)(?=<strong|$|<hr)', content_html, re.DOTALL)
                if comp_match:
                    complexity = clean_html(comp_match.group(1))
                    
                fup_match = re.search(r'Follow-up</strong>:\s*(.*?)(?=<strong|$|<hr)', content_html, re.DOTALL)
                if fup_match:
                    follow_up = clean_html(fup_match.group(1))
                    
            if not description:
                description = f"Prepare and solve the coding question: {clean_title} asked in {company_key.upper()} recruitment."
            if not approach:
                approach = "Understand the problem statement, identify optimal data structures, and implement with clean code."
                
            if difficulty == "Medium" and any(x in clean_title.lower() for x in ["two sum", "reverse", "palindrome", "anagram", "binary search", "fibonacci", "factorial", "leap year", "prime"]):
                difficulty = "Easy"
            elif difficulty == "Medium" and any(x in clean_title.lower() for x in ["sudoku", "n-queens", "hard", "median", "arbitrage", "rain water", "skyline"]):
                difficulty = "Hard"
                
            questions.append({
                "id": q_id,
                "title": clean_title,
                "difficulty": difficulty,
                "round": round_type,
                "topics": topics,
                "leetcode_link": leetcode_link,
                "leetcode_num": leetcode_num,
                "description": description,
                "examples": examples,
                "approach": approach,
                "complexity": complexity,
                "follow_up": follow_up
            })
            q_id += 1
            
    hiring_steps = hiring_processes.get(company_key, [
        {"title": "Stage 1: Online Assessment", "desc": "A timed coding assessment evaluating candidates on data structures and algorithms.", "tip": "Revise high-frequency topics, focus on optimal code logic, and state complexities."},
        {"title": "Stage 2: Technical Interview", "desc": "A live loop focusing on coding, system architecture, database design, and fundamentals.", "tip": "Revise standard computer science subjects and speak clearly during design iterations."},
        {"title": "Stage 3: HR / Cultural Fit", "desc": "Interviews testing value alignment, behavioral scenarios, ownership, and adaptability.", "tip": "Use the STAR method for behavioral answers."}
    ])
    
    return {
        "questions": questions,
        "hiring_process": hiring_steps
    }

def main():
    print("Beginning robust multi-company scrape...")
    for key, url in urls.items():
        print(f"Scraping {key} from {url}...")
        try:
            res = httpx.get(url, headers=headers, timeout=20.0)
            if res.status_code != 200:
                print(f"Failed to scrape {key}, status: {res.status_code}")
                continue
                
            parsed = parse_company(key, res.text)
            
            q_file = os.path.join(output_dir, f"{key}_questions.json")
            with open(q_file, "w", encoding="utf-8") as f:
                json.dump(parsed["questions"], f, indent=2)
                
            h_file = os.path.join(output_dir, f"{key}_hiring.json")
            with open(h_file, "w", encoding="utf-8") as f:
                json.dump(parsed["hiring_process"], f, indent=2)
                
            print(f"Successfully saved datasets for {key}. Questions: {len(parsed['questions'])}")
            
            time.sleep(1.0)
            
        except Exception as e:
            print(f"Error scraping {key}: {e}")

if __name__ == "__main__":
    main()
