import re
import httpx
import json
import asyncio
from PyPDF2 import PdfReader
from typing import Dict, Any, List
from app.core.config import settings

class ResumeService:
    # Set of common industry skills to look for in text
    COMMON_SKILLS = [
        "python", "javascript", "react", "node.js", "node", "express", "sql", "mysql", "mongodb",
        "html", "css", "tailwind", "git", "github", "docker", "kubernetes", "aws", "gcp", "azure",
        "java", "c++", "c", "c#", "php", "django", "flask", "fastapi", "machine learning", "deep learning",
        "scikit-learn", "tensorflow", "pytorch", "pandas", "numpy", "powerbi", "tableau", "linux",
        "data structures", "algorithms", "typescript", "angular", "vue", "graphql", "redis", "postgresql",
        "agile", "scrum", "ci/cd", "jenkins", "rest api", "system design", "microservices", "rust", "go",
        "next.js", "spring boot", "django", "redux", "jest", "pytest", "firebase", "sqlite", "sass", "webpack"
    ]

    STOP_WORDS = {
        "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself",
        "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself",
        "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that",
        "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
        "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because",
        "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into",
        "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out",
        "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where",
        "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no",
        "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just",
        "don", "should", "now", "using", "work", "experience", "role", "team", "skills", "required", "knowledge",
        "ability", "strong", "years", "candidate", "development", "developer", "engineering", "engineer",
        "excellent", "written", "verbal", "communication", "working", "preferred"
    }

    @staticmethod
    def parse_pdf(file_bytes) -> str:
        """
        Extracts raw text from a PDF file byte stream.
        """
        try:
            reader = PdfReader(file_bytes)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text
        except Exception as e:
            print(f"Error parsing PDF: {e}")
            return ""

    @classmethod
    async def analyze_resume(cls, resume_text: str, target_role: str = "", job_description: str = "", filename: str = None) -> Dict[str, Any]:
        """
        Main entry point for resume analysis.
        Uses Gemini API if the key is present; otherwise falls back to a local text miner.
        """
        analysis = None
        if settings.GEMINI_API_KEY:
            try:
                analysis = await cls._analyze_with_gemini(resume_text, target_role, job_description, filename)
            except Exception as e:
                print(f"Gemini resume analysis failed: {e}. Falling back to local analyzer...")

        if not analysis:
            analysis = cls._analyze_locally(resume_text, target_role, job_description, filename)
            
        return cls._post_process_analysis(analysis, resume_text, filename)

    @classmethod
    async def _analyze_with_gemini(cls, resume_text: str, target_role: str, job_description: str, filename: str = None) -> Dict[str, Any]:
        target_role = target_role or "Software Engineer"
        has_jd = bool(job_description and job_description.strip())
        
        mode_instruction = ""
        if has_jd:
            mode_instruction = f"""
You are in 'Job Description Tailoring' mode. Compare the resume to the Job Description:
{job_description}
Tasks:
- Calculate 'match_score' (0-100) representing fit.
- Identify 'missing_keywords' and 'matched_keywords' based strictly on the JD.
- Populate 'skill_gaps' comparing resume skills to JD requirements.
- Suggest 2-3 tailored bullet point rewrites to specifically target the Job Description.
"""
        else:
            mode_instruction = f"""
You are in 'Target Role Benchmarking' mode. There is no Job Description provided.
Analyze the suitability of the resume against industry standards and core expectations for the target role: '{target_role}'.
Tasks:
- Calculate 'match_score' (0-100) representing how well the candidate's skills suit this target role.
- Identify 'missing_keywords' (core role skills missing in the resume) and 'matched_keywords' (core role skills present).
- Populate 'skill_gaps' comparing resume skills to standard expectations for the target role.
- Suggest 2-3 improved bullet points using strong action verbs and metrics tailored to the target role.
"""

        prompt = f"""
You are a senior recruiter, ATS (Applicant Tracking System) reviewer, hiring manager, career coach, and professional resume reviewer.
Thoroughly analyze the candidate's resume text for the target role: '{target_role}'.

Uploaded Filename: {filename or "Not provided (Pasted Text)"}
Resume Text:
{resume_text}

{mode_instruction}

INSTRUCTIONS:
1. Base your evaluation strictly on the candidate's actual resume text. Do not assume missing sections or contact info if they are present in the text.
2. If contact details like email, phone, LinkedIn, or GitHub/Git links are present in the text, extract them. If they are not present, return empty string (""). Do not return placeholder descriptions like "Candidate's Email (extracted)" or "(extracted or empty)".
3. For "strengths" and "weaknesses", list items specific to the candidate's actual experience and skills. If a contact detail (like LinkedIn or GitHub) is present, do not list it as a weakness or a missing keyword.
4. The JSON must be valid and conform to the schema. Do not write any text outside the JSON object.

JSON Schema:
{{
  "name": "", // Extracted Candidate Name. Leave empty if not found.
  "email": "", // Extracted email address. Leave empty if not found.
  "phone": "", // Extracted phone number. Leave empty if not found.
  "linkedin": "", // Extracted LinkedIn URL. Leave empty if not found.
  "github": "", // Extracted GitHub/Git URL. Leave empty if not found.
  "ats_score": 85, // 0-100 overall ATS formatting and header compliance
  "overall_score": 80, // 0-100 weighted quality score
  "match_score": 75, // 0-100 suitability score for target role (or JD if provided)
  "project_score": 80, // 0-100
  "experience_score": 85, // 0-100
  "skills_score": 90, // 0-100
  "strengths": ["list of strengths specific to candidate"],
  "weaknesses": ["list of weaknesses specific to candidate"],
  "missing_keywords": [], // list of missing keywords/skills for target role or JD
  "matched_keywords": [], // list of matched keywords/skills for target role or JD
  "recommended_keywords": [], // recommended keywords for this role
  "skill_gaps": {{
    "current_skills": ["React", "JavaScript"],
    "required_skills": ["React", "JavaScript", "AWS", "Docker"],
    "gap_skills": ["AWS", "Docker"],
    "summary": "Summary of current skills vs required skills.",
    "learning_path": [
      {{
        "skill": "Docker",
        "description": "Learn to containerize components, manage node packages, and use docker-compose.",
        "difficulty": "Medium"
      }}
    ]
  }},
  "ats_issues": [],
  "grammar_issues": [
    {{
      "issue": "Brief description of issue",
      "correction": "Correction or rewrite suggestion"
    }}
  ],
  "formatting_issues": [],
  "missing_sections": [],
  "project_review": [
    {{
      "title": "Project Title",
      "score": 85,
      "tech_stack": ["React"],
      "complexity": "Medium",
      "impact": "Serves 500+ users",
      "suggestions": ["Add deployment link"]
    }}
  ],
  "experience_review": [
    {{
      "role": "Intern",
      "company": "Tech Corp",
      "relevance": "High",
      "relevance_score": 90,
      "evaluation": "Evaluation details"
    }}
  ],
  "recruiter_feedback": {{
    "decision": "Yes", // "Yes", "Maybe", or "No"
    "reasoning": "Reasoning summary"
  }},
  "improved_bullet_points": [
    {{
      "section": "Experience",
      "original": "Original weak bullet from resume.",
      "suggested": "Improved metric-driven bullet point.",
      "explanation": "Provide detailed feedback on why this bullet was weak (e.g. passive tone, lack of metrics) and how the suggest rewrite improves it."
    }}
  ],
  "final_recommendations": [],
  "interview_readiness": {{
    "score": 78,
    "level": "Good" // "Excellent", "Good", "Average", or "Poor"
  }},
  "ats_optimization_guide": {{
    "things_to_add": [],
    "things_to_remove": [],
    "restructure_tips": []
  }},
  "filler_words_found": [], // List of flagged buzzwords or generic/vague filler words found in the resume text
  "repetitive_words": [
    {{
      "word": "word/verb repeated excessively (3+ times)",
      "count": 5,
      "alternatives": ["alternative_action_verb1", "alternative_action_verb2"]
    }}
  ],
  "metrics_density_score": 60, // Percentage (0-100) of experience/project bullets that contain quantifiable metrics (numbers, %, financial values)
  "filename_audit": {{
    "filename": "", // Uploaded filename
    "is_professional": true, // Whether the filename fits professional patterns (e.g. FirstName_LastName_Resume.pdf)
    "critique": "A detailed critique of the uploaded filename structure.",
    "suggestions": ["List of better naming suggestions"]
  }},
  "summary": "Summary text"
}}
"""
        models = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-2.0-flash"]
        async with httpx.AsyncClient() as client:
            for model in models:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
                headers = {"Content-Type": "application/json"}
                data = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"responseMimeType": "application/json"}
                }
                for attempt in range(2):
                    try:
                        response = await client.post(url, json=data, headers=headers, timeout=30.0)
                        if response.status_code == 200:
                            res_json = response.json()
                            text = res_json['candidates'][0]['content']['parts'][0]['text']
                            cleaned_text = text.strip()
                            if cleaned_text.startswith("```json"):
                                cleaned_text = cleaned_text[7:]
                            if cleaned_text.endswith("```"):
                                cleaned_text = cleaned_text[:-3]
                            cleaned_text = cleaned_text.strip()
                            result = json.loads(cleaned_text)
                            if isinstance(result, dict):
                                result["has_jd"] = has_jd
                            return result
                    except Exception as e:
                        print(f"Gemini {model} attempt {attempt+1} failed: {e}")
                        await asyncio.sleep(1)
        return None

    @classmethod
    def _analyze_locally(cls, text: str, target_role: str, job_description: str, filename: str = None) -> Dict[str, Any]:
        """
        Analyzes resume text and generates a full structured report locally.
        """
        text_lower = text.lower()
        target_role = target_role or "Software Engineer"
        target_lower = target_role.lower()
        has_jd = bool(job_description and job_description.strip())

        # 1. Identify skills
        found_skills = []
        for skill in cls.COMMON_SKILLS:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if skill == "c++":
                pattern = r'c\+\+'
            elif skill == "node.js":
                pattern = r'node\.js'
            
            if re.search(pattern, text_lower):
                found_skills.append(skill.capitalize())

        # 2. Section Checks
        has_education = any(x in text_lower for x in ["education", "academic", "university", "college", "btech", "b.tech", "degree"])
        has_projects = any(x in text_lower for x in ["projects", "personal projects", "academic projects", "key projects"])
        has_experience = any(x in text_lower for x in ["experience", "employment", "intern", "internship", "work history", "professional experience"])
        has_certifications = any(x in text_lower for x in ["certifications", "certificates", "courses", "achievements"])
        has_achievements = any(x in text_lower for x in ["achievements", "awards", "honors", "competitions", "scholarships"])

        missing_sections = []
        if not has_education: missing_sections.append("Education")
        if not has_projects: missing_sections.append("Projects")
        if not has_experience: missing_sections.append("Experience")
        if not has_certifications: missing_sections.append("Certifications")
        if not has_achievements: missing_sections.append("Achievements")

        # 3. Keywords & Suitability Scoring setup
        missing_keywords = []
        matched_keywords = []
        recommended_keywords = []
        
        # Target role specific skill lists
        role_skills_map = {
            "frontend": ["React", "Javascript", "CSS", "Tailwind", "Typescript", "Git"],
            "backend": ["Python", "Fastapi", "Django", "SQL", "Docker", "Aws", "Redis"],
            "full stack": ["React", "Node.js", "SQL", "Express", "Docker", "Git"],
            "data analyst": ["Python", "Sql", "Pandas", "Numpy", "Powerbi", "Tableau", "Excel"],
            "software engineer": ["Data structures", "Algorithms", "Java", "C++", "Sql", "Git"],
            "machine learning": ["Python", "Machine learning", "Deep learning", "Tensorflow", "Pytorch", "Pandas", "Numpy", "Scikit-learn"],
            "data scientist": ["Python", "Machine learning", "SQL", "Pandas", "Numpy", "Tableau", "R", "Statistics"],
            "devops": ["Docker", "Kubernetes", "AWS", "Linux", "CI/CD", "Jenkins", "Ansible", "Git"],
            "cloud": ["AWS", "Docker", "Kubernetes", "GCP", "Azure", "Linux", "Terraform"],
            "mobile": ["Kotlin", "Swift", "Java", "Flutter", "React Native", "Git", "REST APIs"],
            "ui": ["Figma", "UI/UX", "HTML", "CSS", "Wireframing", "Prototyping", "User Research"],
            "ux": ["Figma", "UI/UX", "HTML", "CSS", "Wireframing", "Prototyping", "User Research"],
            "cybersecurity": ["Linux", "Network security", "Cryptography", "Python", "Penetration testing", "OWASP"],
            "qa": ["Selenium", "Jest", "Pytest", "QA", "Automation testing", "Git", "Postman"],
            "project manager": ["Agile", "Scrum", "Jira", "SQL", "Tableau", "Product roadmaps"]
        }

        matched_role_key = "software engineer"
        for key in role_skills_map:
            if key in target_lower:
                matched_role_key = key
                break
        
        required_role_skills = role_skills_map[matched_role_key]

        if has_jd:
            # Job Description Tailoring Mode
            jd_lower = job_description.lower()
            jd_words = re.findall(r'\b[a-zA-Z]{3,}\b', jd_lower)
            jd_keywords = set()
            for word in jd_words:
                if word not in cls.STOP_WORDS:
                    jd_keywords.add(word)

            jd_skills_found = []
            for skill in cls.COMMON_SKILLS:
                pattern = r'\b' + re.escape(skill) + r'\b'
                if re.search(pattern, jd_lower):
                    jd_skills_found.append(skill.capitalize())
            
            for skill in jd_skills_found:
                if skill.lower() in [s.lower() for s in found_skills]:
                    matched_keywords.append(skill)
                else:
                    missing_keywords.append(skill)
            
            # General keywords matching
            for kw in jd_keywords:
                pattern = r'\b' + re.escape(kw) + r'\b'
                if re.search(pattern, text_lower):
                    if kw.capitalize() not in matched_keywords and kw in cls.COMMON_SKILLS:
                        matched_keywords.append(kw.capitalize())
                else:
                    if kw.capitalize() not in missing_keywords:
                        if kw in cls.COMMON_SKILLS:
                            missing_keywords.append(kw.capitalize())
                        elif len(kw) > 4:
                            recommended_keywords.append(kw.capitalize())
        else:
            # Target Role Suitability mode
            for skill in required_role_skills:
                if skill.lower() in [s.lower() for s in found_skills]:
                    matched_keywords.append(skill)
                else:
                    missing_keywords.append(skill)
            
            recommended_keywords = [s for s in cls.COMMON_SKILLS if s.capitalize() not in required_role_skills][:8]

        missing_keywords = missing_keywords[:8]
        matched_keywords = matched_keywords[:8]
        recommended_keywords = recommended_keywords[:8]

        # 4. Suitability Match Score (calculated against either JD or role standards)
        if has_jd:
            total_req = len(matched_keywords) + len(missing_keywords)
            match_score = int((len(matched_keywords) / total_req) * 100) if total_req > 0 else 75
        else:
            total_req = len(required_role_skills)
            match_score = int((len(matched_keywords) / total_req) * 100) if total_req > 0 else 75
            
        match_score = int(min(max(match_score, 15), 95))

        # Skill Gap
        learning_path = []
        diff_map = {
            "Docker": "Medium", "Kubernetes": "High", "AWS": "High", "GCP": "High", "Azure": "High",
            "Python": "Low", "React": "Medium", "Fastapi": "Low", "Django": "Medium", "SQL": "Low",
            "Redis": "Medium", "Linux": "Low", "CI/CD": "Medium", "Tensorflow": "High", "Pytorch": "High",
            "Algorithms": "High", "Data structures": "High", "Java": "Medium", "C++": "Medium",
            "Figma": "Low", "UI/UX": "Low", "Kotlin": "Medium", "Swift": "Medium", "Jira": "Low"
        }
        for s in missing_keywords[:4]:
            diff = diff_map.get(s, "Medium")
            learning_path.append({
                "skill": s,
                "description": f"Master core concepts of {s} and apply them to build integration milestones or open-source portfolios.",
                "difficulty": diff
            })
        
        skill_gaps = {
            "current_skills": found_skills[:8],
            "required_skills": (required_role_skills if not has_jd else (found_skills[:4] + missing_keywords))[:8],
            "gap_skills": missing_keywords,
            "summary": f"The candidate has relevant foundations in {', '.join(found_skills[:3]) or 'technical skills'}. To align with the standards for a '{target_role}' role, they should prioritize learning and documenting experience in {', '.join(missing_keywords[:3]) or 'industry tools'}.",
            "learning_path": learning_path
        }

        # 5. ATS & Formatting scores
        ats_score = 65
        if has_education: ats_score += 10
        if has_experience: ats_score += 15
        if has_projects: ats_score += 10
        ats_score = int(min(ats_score, 100))

        project_score = 90 if has_projects else 40
        experience_score = 85 if has_experience else 50
        skills_score = min(50 + len(found_skills) * 5, 95)
        
        overall_score = int(ats_score * 0.20 + project_score * 0.20 + experience_score * 0.25 + skills_score * 0.15 + (100 if has_achievements else 50) * 0.10 + 90 * 0.10)

        # 6. Improved bullets (General or specific)
        raw_bullets = []
        for line in text.split('\n'):
            line = line.strip()
            if line.startswith(('-', '*', '•', 'o')) and len(line) > 15:
                raw_bullets.append(line.lstrip('-*•o ').strip())
        
        if not raw_bullets:
            for line in text.split('\n'):
                line = line.strip()
                if len(line) > 30 and any(verb in line.lower() for verb in ["developed", "worked", "managed", "helped", "created", "designed"]):
                    raw_bullets.append(line)
                    if len(raw_bullets) >= 3:
                        break

        improved_bullet_points = []
        default_weak_originals = [
            "Worked on frontend design using libraries.",
            "Responsible for managing database queries.",
            "Helped the team with testing and debugging."
        ]
        strong_verbs = ["Spearheaded", "Engineered", "Architected", "Optimized", "Designed", "Formulated", "Automated"]
        
        for idx, orig in enumerate(raw_bullets[:3] or default_weak_originals):
            orig_clean = orig.strip().rstrip('.')
            verb = strong_verbs[idx % len(strong_verbs)]
            if "react" in orig_clean.lower() or "frontend" in orig_clean.lower() or "ui" in orig_clean.lower():
                suggested = f"{verb} responsive frontend components and state-management modules, reducing browser rendering latency by 20%."
            elif "sql" in orig_clean.lower() or "database" in orig_clean.lower() or "backend" in orig_clean.lower():
                suggested = f"{verb} optimized database schemas and queries, enhancing API endpoint throughput by 35%."
            elif "test" in orig_clean.lower() or "debug" in orig_clean.lower() or "qa" in orig_clean.lower():
                suggested = f"{verb} automated end-to-end testing suites, increasing code test coverage to 92%."
            else:
                suggested = f"{verb} scalable modules and logic structures for the {target_role} scope, boosting execution speed by 15%."
            
            improved_bullet_points.append({
                "section": "Experience / Projects",
                "original": orig_clean,
                "suggested": suggested
            })

        # 7. Audits & Issues
        ats_issues = []
        if not has_experience:
            ats_issues.append("Resume lacks chronological employment history headers. Add work details or label projects chronologically.")
        if "curriculum" in text_lower or "resume" in text_lower:
            ats_issues.append("Remove redundant title labels like 'Resume' or 'Curriculum Vitae' from the top header.")

        grammar_issues = []
        if "was developed" in text_lower or "was completed" in text_lower:
            grammar_issues.append({
                "issue": "Passive voice detected ('was developed')",
                "correction": "Rewrite using active action verbs (e.g. 'Developed and deployed...')"
            })

        formatting_issues = []
        word_count = len(text.split())
        if word_count < 300:
            formatting_issues.append("Resume length is low (under 300 words). Add project milestones to fill vertical white spaces.")
        elif word_count > 900:
            formatting_issues.append("Text height exceeds 1-page margins. Compress descriptions to prevent spillover onto page 2.")

        # 8. Component Reviews
        project_review = []
        extracted_projects = []
        for line in text.split('\n'):
            line = line.strip()
            if "project" in line.lower() and len(line) < 50 and not any(x in line.lower() for x in ["academic", "personal", "key"]):
                proj_name = re.sub(r'[:\-•\-*]', '', line).strip()
                if len(proj_name) > 3:
                    extracted_projects.append(proj_name)
        
        for proj in (extracted_projects[:2] or ["Technical Project"]):
            project_review.append({
                "title": proj,
                "score": 85,
                "tech_stack": found_skills[:3] or ["React", "Python"],
                "complexity": "Medium",
                "impact": "Serves user traffic; code patterns are clean",
                "suggestions": ["Include hosting deployment link (e.g. Vercel/Render)", "Explicitly link target repository to show code cleanliness."]
            })
        
        experience_review = []
        extracted_roles = []
        for line in text.split('\n'):
            line = line.strip()
            if any(r in line.lower() for r in ["engineer", "developer", "intern", "analyst", "manager"]) and len(line) < 60:
                role_name = re.sub(r'[:\-•\-*]', '', line).strip()
                if len(role_name) > 4:
                    extracted_roles.append(role_name)
                    
        for role in (extracted_roles[:2] or [target_role]):
            experience_review.append({
                "role": role,
                "company": "Technical Employment / Placement Scope",
                "relevance": "High",
                "relevance_score": 85,
                "evaluation": "Showcases solid developer foundations and collaboration. Include more metrics to quantify performance."
            })

        # 9. Recruiter decision
        decision = "Maybe"
        reasoning = f"The candidate possesses strong core programming skills in {', '.join(found_skills[:4])}. However, to match professional recruiter cutoffs, they should expand achievements metrics."
        if match_score >= 80:
            decision = "Yes"
        elif match_score < 50:
            decision = "No"

        # 10. Strengths & Weaknesses
        strengths = []
        if len(found_skills) >= 5: strengths.append(f"Broad technical skill set covering {', '.join(found_skills[:4])}")
        if has_projects: strengths.append("Dedicated project section highlighting implementation stacks")
        if has_education: strengths.append("Solid educational degree listings")
        if not strengths: strengths = ["Clean format", "Standard technical headers"]

        weaknesses = []
        if not has_experience: weaknesses.append("Lacks chronological industry internship/work history")
        if missing_keywords: 
            weaknesses.append(f"Missing critical requirements like {', '.join(missing_keywords[:2])}")
        if not has_achievements: weaknesses.append("No achievements or honors section to showcase excellence")
        if not weaknesses: weaknesses = ["Metric details could be expanded"]

        # 11. Interview Readiness
        ir_score = int((overall_score + match_score) / 2)
        ir_level = "Average"
        if ir_score >= 80: ir_level = "Excellent"
        elif ir_score >= 65: ir_level = "Good"
        elif ir_score < 40: ir_level = "Poor"

        # 12. Recommendations
        final_recommendations = [
            f"Integrate these top keywords directly into your experience bullet points: {', '.join(missing_keywords[:3])}",
            "Revise weak bullet points using the action-verb suggestions below.",
            "Add live URLs to your project summaries."
        ]

        # 13. Extracted contact info
        extracted_email = ""
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        if email_match:
            extracted_email = email_match.group(0)

        extracted_name = ""
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        if lines:
            if len(lines[0].split()) <= 4 and not any(x in lines[0].lower() for x in ["resume", "cv", "curriculum", "page"]):
                extracted_name = lines[0]

        extracted_phone = ""
        phone_match = re.search(r'\+?\d{1,4}[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
        if phone_match:
            extracted_phone = phone_match.group(0)

        extracted_linkedin = ""
        extracted_linkedin = ""
        linkedin_match = re.search(r'linkedin\.com/[^\s,]+', text_lower) or re.search(r'linkedin', text_lower)
        if linkedin_match:
            full_match = re.search(r'linkedin\.com/[^\s,]+', text_lower)
            extracted_linkedin = "https://" + full_match.group(0) if full_match else "https://linkedin.com"

        extracted_github = ""
        github_match = re.search(r'github\.com/[^\s,]+', text_lower) or re.search(r'github', text_lower) or re.search(r'\bgit\b', text_lower)
        if github_match:
            full_match = re.search(r'github\.com/[^\s,]+', text_lower)
            extracted_github = "https://" + full_match.group(0) if full_match else "https://github.com"

        # Build ATS optimization guide
        things_to_add = []
        things_to_remove = []
        restructure_tips = [
            "Use clear standard section headers: 'Work Experience', 'Education', 'Projects', 'Skills'.",
            "Keep the resume layout to a single column. ATS scanners read left-to-right and merge parallel columns.",
            "Use clear bullet points instead of paragraphs for job descriptions.",
            "Ensure the file is saved as a PDF with selectable text, not scanned images."
        ]

        if not has_education:
            things_to_add.append("Education section including degree and graduation date")
        if not has_projects:
            things_to_add.append("Technical projects section to demonstrate hands-on application")
        if not has_experience:
            things_to_add.append("Chronological professional experience or internships")
        if not has_certifications:
            things_to_add.append("Professional Certifications or online course completions")
        
        if not extracted_email:
            things_to_add.append("Professional email address in the contact header")
        if not extracted_phone:
            things_to_add.append("Active phone number with country/area code")
        if not extracted_linkedin:
            things_to_add.append("LinkedIn profile URL to allow recruiter callbacks")
        if not extracted_github:
            things_to_add.append("GitHub repository link to showcase projects")

        if "curriculum" in text_lower or "resume" in text_lower:
            things_to_remove.append("Redundant headers like 'Resume' or 'Curriculum Vitae' from the top of the page")
        
        things_to_remove.extend([
            "Visual assets such as headshot photos, icons, charts, progress bars, and custom skill gauges",
            "Multi-column tables, textboxes, and nested layout wrappers that break parsing order",
            "Headers and footers containing crucial contact details (some ATS systems ignore headers/footers completely)",
            "Non-standard web fonts. Stick to safe fonts like Arial, Calibri, Garamond, or Times New Roman"
        ])

        ats_optimization_guide = {
            "things_to_add": things_to_add if things_to_add else ["LinkedIn/GitHub URLs in contact details", "Relevant technical certifications"],
            "things_to_remove": things_to_remove,
            "restructure_tips": restructure_tips
        }

        return {
            "name": extracted_name or "Resume Candidate",
            "email": extracted_email or "Not found",
            "phone": extracted_phone or "Not found",
            "linkedin": extracted_linkedin or "Not found",
            "github": extracted_github or "Not found",
            "ats_score": ats_score,
            "overall_score": overall_score,
            "match_score": match_score,
            "project_score": int(project_score),
            "experience_score": int(experience_score),
            "skills_score": int(skills_score),
            "strengths": strengths,
            "weaknesses": weaknesses,
            "missing_keywords": missing_keywords,
            "matched_keywords": matched_keywords,
            "recommended_keywords": recommended_keywords,
            "skill_gaps": skill_gaps,
            "ats_issues": ats_issues,
            "grammar_issues": grammar_issues,
            "formatting_issues": formatting_issues,
            "missing_sections": missing_sections,
            "project_review": project_review,
            "experience_review": experience_review,
            "recruiter_feedback": {
                "decision": decision,
                "reasoning": reasoning
            },
            "improved_bullet_points": improved_bullet_points,
            "final_recommendations": final_recommendations,
            "interview_readiness": {
                "score": ir_score,
                "level": ir_level
            },
            "has_jd": has_jd,
            "ats_optimization_guide": ats_optimization_guide,
            "summary": f"Candidate profile evaluated for target role: '{target_role}'. Layout formatting complies with recruiter standards. Tailor key achievements to increase screening callback rates."
        }

    @classmethod
    def _post_process_analysis(cls, analysis: Dict[str, Any], raw_text: str, filename: str = None) -> Dict[str, Any]:
        """
        Ensures consistency between raw resume text and extraction metrics.
        Corrects AI hallucinations and ensures contact links or sections are not flagged as missing.
        """
        text_lower = raw_text.lower()

        # Advanced local parsing/heuristics to ensure high quality metrics
        if "filler_words_found" not in analysis:
            analysis["filler_words_found"] = []
        if "repetitive_words" not in analysis:
            analysis["repetitive_words"] = []
        if "metrics_density_score" not in analysis:
            analysis["metrics_density_score"] = 0
        if "filename_audit" not in analysis:
            analysis["filename_audit"] = {}

        # Heuristic 1: Flagged buzzwords/filler words
        buzzwords = {"passionate", "detail-oriented", "hardworking", "motivated", "results-driven", 
                     "synergy", "team-player", "self-starter", "go-getter", "ambitious", "innovative", "dynamic"}
        found_buzzwords = []
        for bw in buzzwords:
            if re.search(r'\b' + re.escape(bw) + r'\b', text_lower):
                found_buzzwords.append(bw)
        analysis["filler_words_found"] = list(set(analysis.get("filler_words_found", []) + found_buzzwords))

        # Heuristic 2: Repetitive Action Verbs check
        verbs_to_check = {
            "managed": ["spearheaded", "orchestrated", "coordinated", "directed"],
            "developed": ["engineered", "architected", "implemented", "authored"],
            "worked": ["collaborated", "participated", "contributed", "supported"],
            "assisted": ["facilitated", "backed", "reinforced", "promoted"],
            "helped": ["empowered", "assisted", "guided", "aided"],
            "utilized": ["leveraged", "applied", "deployed", "harnessed"],
            "created": ["formulated", "designed", "originated", "devised"],
            "responsible": ["accountable", "charged with", "trusted to"]
        }
        rep_list = []
        for verb, alts in verbs_to_check.items():
            count = len(re.findall(r'\b' + re.escape(verb) + r'\b', text_lower))
            if count >= 3:
                rep_list.append({
                    "word": verb,
                    "count": count,
                    "alternatives": alts
                })
        
        existing_rep = {item["word"]: item for item in analysis.get("repetitive_words", []) if isinstance(item, dict) and "word" in item}
        for item in rep_list:
            if item["word"] not in existing_rep:
                existing_rep[item["word"]] = item
        analysis["repetitive_words"] = list(existing_rep.values())

        # Heuristic 3: Metrics Density check
        bullets = []
        for line in raw_text.split('\n'):
            line = line.strip()
            if line.startswith(('-', '*', '•', 'o')) and len(line) > 10:
                bullets.append(line)
        
        if bullets:
            bullets_with_metrics = 0
            for b in bullets:
                if re.search(r'\d', b) or '%' in b or any(c in b for c in ['$', '₹', '£', '€']):
                    bullets_with_metrics += 1
            density = int((bullets_with_metrics / len(bullets)) * 100)
            analysis["metrics_density_score"] = density
        else:
            sentences = [s.strip() for s in re.split(r'[.!?]', raw_text) if len(s.strip()) > 15]
            if sentences:
                sentences_with_metrics = sum(1 for s in sentences if re.search(r'\d', s) or '%' in s)
                analysis["metrics_density_score"] = int((sentences_with_metrics / len(sentences)) * 100)
            else:
                analysis["metrics_density_score"] = 0

        # Heuristic 4: Filename Audit
        if filename:
            fn_lower = filename.lower()
            is_prof = True
            critique = "The filename complies with professional applicant tracking system formats."
            suggestions = []
            
            bad_patterns = ["draft", "final", "version", "v1", "v2", "v3", "copy", "new"]
            flagged_bad = [p for p in bad_patterns if p in fn_lower]
            
            if flagged_bad:
                is_prof = False
                critique = f"The filename contains internal developer suffixes: {', '.join(flagged_bad)}. Recruiters recommend removing version numbers and draft labels."
                suggestions.append("Remove version tags (e.g. use 'Name_Resume.pdf' instead of 'Resume_v2_final.pdf')")
            
            if not any(x in fn_lower for x in ["resume", "cv", "portfolio"]):
                is_prof = False
                critique = "The filename is generic and does not contain identifying keywords like 'Resume' or 'CV'."
                suggestions.append("Include identifying keywords (e.g. 'Jane_Doe_Resume.pdf')")
                
            if is_prof:
                suggestions = ["Keep the format standard: 'Firstname_Lastname_Resume.pdf'"]
            else:
                if not suggestions:
                    suggestions.append("Format as 'Firstname_Lastname_Resume.pdf'")
                    
            analysis["filename_audit"] = {
                "filename": filename,
                "is_professional": is_prof,
                "critique": critique,
                "suggestions": suggestions
            }
        else:
            analysis["filename_audit"] = {
                "filename": "Not uploaded (Pasted Plain Text)",
                "is_professional": False,
                "critique": "You pasted plain text instead of uploading a PDF file. Filenames cannot be audited.",
                "suggestions": ["Upload a PDF file named 'Firstname_Lastname_Resume.pdf' to verify the ATS filename structure."]
            }

        # Backwards compatibility and styling helper for bullet point explanations
        if "improved_bullet_points" in analysis and isinstance(analysis["improved_bullet_points"], list):
            for bp in analysis["improved_bullet_points"]:
                if isinstance(bp, dict) and "explanation" not in bp:
                    bp["explanation"] = "Focus on action-verbs and state quantifiable results to show the recruiter your scale of impact."

        def clean_placeholder(val: str) -> str:
            if not val:
                return ""
            v = str(val).strip()
            if any(p in v.lower() for p in ["candidate's", "extracted", "empty", "placeholder", "click here", "enter your", "your_"]):
                return ""
            return v

        # Clean up placeholders in string fields
        for field in ["name", "email", "phone", "linkedin", "github"]:
            if field in analysis:
                analysis[field] = clean_placeholder(analysis[field])

        # 1. Email Extraction
        has_email = "@" in text_lower
        if has_email:
            if not analysis.get("email"):
                email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text_lower)
                if email_match:
                    analysis["email"] = email_match.group(0)
            
            # Remove email warnings from optimization guides/weaknesses
            if "ats_optimization_guide" in analysis:
                guide = analysis["ats_optimization_guide"]
                if "things_to_add" in guide:
                    guide["things_to_add"] = [item for item in guide["things_to_add"] if "email" not in item.lower()]

        # 2. Phone Extraction
        phone_digits = re.findall(r'\d', text_lower)
        has_phone = len(phone_digits) >= 7
        if has_phone:
            if not analysis.get("phone"):
                phone_match = re.search(r'\+?\d{1,4}[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{3}[-.\s]?\d{4}', text_lower)
                if phone_match:
                    analysis["phone"] = phone_match.group(0)
            
            if "ats_optimization_guide" in analysis:
                guide = analysis["ats_optimization_guide"]
                if "things_to_add" in guide:
                    guide["things_to_add"] = [item for item in guide["things_to_add"] if "phone" not in item.lower() and "contact" not in item.lower()]

        # 3. Check LinkedIn presence
        has_linkedin_text = "linkedin" in text_lower or "lnkd.in" in text_lower or "li.me" in text_lower
        if has_linkedin_text:
            if not analysis.get("linkedin"):
                match = re.search(r'(?:https?://)?(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_\-\.\/\?\#\&\=\%]+', text_lower)
                if not match:
                    match = re.search(r'(?:https?://)?(?:www\.)?linkedin\.com/[a-zA-Z0-9_\-\.\/\?\#\&\=\%]+', text_lower)
                if not match:
                    match = re.search(r'linkedin\s*[:\-@]\s*([a-zA-Z0-9_-]+)', text_lower)
                    if match:
                        analysis["linkedin"] = f"https://linkedin.com/in/{match.group(1)}"
                
                if match and not analysis.get("linkedin"):
                    val = match.group(0)
                    analysis["linkedin"] = val if val.startswith("http") else "https://" + val
            
            # If still not found, set to generic link
            if not analysis.get("linkedin"):
                analysis["linkedin"] = "https://linkedin.com"

            # Remove "LinkedIn" from missing warnings
            if "ats_optimization_guide" in analysis:
                guide = analysis["ats_optimization_guide"]
                if "things_to_add" in guide:
                    guide["things_to_add"] = [item for item in guide["things_to_add"] if "linkedin" not in item.lower()]
            
            if "weaknesses" in analysis:
                analysis["weaknesses"] = [w for w in analysis["weaknesses"] if "linkedin" not in w.lower()]
                
            if "final_recommendations" in analysis:
                analysis["final_recommendations"] = [r for r in analysis["final_recommendations"] if "linkedin" not in r.lower()]

            if "strengths" in analysis:
                has_li_strength = any("linkedin" in s.lower() for s in analysis["strengths"])
                if not has_li_strength:
                    analysis["strengths"].append("Includes a professional LinkedIn profile link")

        # 4. Check GitHub presence (using word boundary for git)
        has_github_text = "github" in text_lower or bool(re.search(r'\bgit\b', text_lower)) or "gitlab" in text_lower or "bitbucket" in text_lower
        if has_github_text:
            if not analysis.get("github"):
                match = re.search(r'(?:https?://)?(?:www\.)?github\.com/[a-zA-Z0-9_\-\.\/\?\#\&\=\%]+', text_lower)
                if not match:
                    match = re.search(r'(?:https?://)?(?:www\.)?(?:github\.io|gitlab\.com|bitbucket\.org)/[a-zA-Z0-9_\-\.\/\?\#\&\=\%]+', text_lower)
                if not match:
                    match = re.search(r'github\s*[:\-@]\s*([a-zA-Z0-9_-]+)', text_lower)
                    if match:
                        analysis["github"] = f"https://github.com/{match.group(1)}"
                
                if match and not analysis.get("github"):
                    val = match.group(0)
                    analysis["github"] = val if val.startswith("http") else "https://" + val
            
            # If still not found, set to generic link
            if not analysis.get("github"):
                analysis["github"] = "https://github.com"

            if "ats_optimization_guide" in analysis:
                guide = analysis["ats_optimization_guide"]
                if "things_to_add" in guide:
                    guide["things_to_add"] = [item for item in guide["things_to_add"] if "github" not in item.lower() and "git" not in item.lower()]

            if "weaknesses" in analysis:
                analysis["weaknesses"] = [w for w in analysis["weaknesses"] if "github" not in w.lower() and "git" not in w.lower()]
                
            if "final_recommendations" in analysis:
                analysis["final_recommendations"] = [r for r in analysis["final_recommendations"] if "github" not in r.lower() and "git" not in r.lower()]

            if "strengths" in analysis:
                has_git_strength = any("github" in s.lower() or "git" in s.lower() for s in analysis["strengths"])
                if not has_git_strength:
                    analysis["strengths"].append("Includes a GitHub portfolio link to showcase codebase and projects")

        # 5. Check Section Headers
        header_map = {
            "education": ["education", "academic", "university", "college", "degree"],
            "projects": ["project", "portfolio"],
            "experience": ["experience", "employment", "intern", "history", "work"],
            "certifications": ["certification", "certificate", "course"],
            "achievements": ["achievement", "award", "honor", "contest"]
        }

        for sec, keywords in header_map.items():
            if any(kw in text_lower for kw in keywords):
                if "missing_sections" in analysis:
                    analysis["missing_sections"] = [s for s in analysis["missing_sections"] if s.lower() != sec]
                
                if "ats_optimization_guide" in analysis:
                    guide = analysis["ats_optimization_guide"]
                    if "things_to_add" in guide:
                        guide["things_to_add"] = [item for item in guide["things_to_add"] if sec not in item.lower()]

                if "weaknesses" in analysis:
                    analysis["weaknesses"] = [w for w in analysis["weaknesses"] if f"missing {sec}" not in w.lower() and f"no {sec}" not in w.lower()]

        # 6. Ensure matched keywords include any found skills
        found_skills = []
        for skill in cls.COMMON_SKILLS:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if skill == "c++":
                pattern = r'c\+\+'
            elif skill == "node.js":
                pattern = r'node\.js'
            
            if re.search(pattern, text_lower):
                found_skills.append(skill.capitalize())
        
        if "missing_keywords" in analysis and "matched_keywords" in analysis:
            for skill in found_skills:
                if skill in analysis["missing_keywords"]:
                    analysis["missing_keywords"].remove(skill)
                if skill not in analysis["matched_keywords"] and len(analysis["matched_keywords"]) < 10:
                    analysis["matched_keywords"].append(skill)
                    
        return analysis

    @classmethod
    async def generate_summary(cls, data: Dict[str, Any]) -> str:
        """
        Generates a compelling, 2-3 sentence ATS-optimized resume summary using Gemini.
        """
        title = data.get("title", "Software Engineer")
        skills_str = ", ".join(data.get("skills", []))
        exp_summary = data.get("experience_summary", "")
        
        prompt = f"""You are an elite career coach and executive resume writer. 
Write a highly compelling, professional 2-3 sentence resume summary for a candidate targeting the role: '{title}'.

Candidate Skills: {skills_str}
Candidate Experience Summary: {exp_summary}

Rules:
1. Do not use filler buzzwords (e.g., passionate, self-starter, motivated). Use active, impact-driven description.
2. Focus on technical core skills and the value they bring.
3. Keep it to exactly 2-3 sentences.
4. Output ONLY the summary text, with no introductory or concluding notes."""

        if settings.GEMINI_API_KEY:
            models = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-2.0-flash"]
            async with httpx.AsyncClient() as client:
                for model in models:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
                    headers = {"Content-Type": "application/json"}
                    data_payload = {
                        "contents": [{"parts": [{"text": prompt}]}],
                    }
                    for attempt in range(2):
                        try:
                            response = await client.post(url, json=data_payload, headers=headers, timeout=15.0)
                            if response.status_code == 200:
                                res_json = response.json()
                                text = res_json['candidates'][0]['content']['parts'][0]['text']
                                return text.strip()
                        except Exception:
                            await asyncio.sleep(0.5)
                            
        # Local fallback if Gemini fails
        fallback = f"Results-oriented professional targeting {title} opportunities. Possesses technical competencies in {skills_str} to construct scalable applications."
        return fallback

    @classmethod
    async def generate_optimized_resume(cls, data: Dict[str, Any]) -> str:
        """
        Generates a highly optimized, 100% ATS-compliant resume in Markdown using Gemini.
        Applies the Google XYZ bullet formula and action-driven language.
        """
        # Construct raw inputs for the LLM
        experience_blocks = []
        for exp in data.get("experience", []):
            experience_blocks.append(f"""
Company: {exp.get('company')}
Role: {exp.get('role')}
Duration: {exp.get('duration')}
Responsibilities:
{exp.get('responsibilities')}
Achievements:
{exp.get('achievements', '')}
""")
            
        project_blocks = []
        for proj in data.get("projects", []):
            project_blocks.append(f"""
Project Title: {proj.get('title')}
Technologies: {proj.get('tech_stack')}
Description:
{proj.get('description')}
GitHub Link: {proj.get('github_link', '')}
Live Demo Link: {proj.get('live_demo', '')}
Key Features: {proj.get('key_features', '')}
""")
            
        education_blocks = []
        for edu in data.get("education", []):
            education_blocks.append(f"- {edu.get('school')} | {edu.get('degree')} in {edu.get('branch')} (Graduation: {edu.get('start_year')} - {edu.get('end_year')}) | Grade: {edu.get('cgpa_or_percentage')}")
            
        cert_blocks = []
        for cert in data.get("certifications", []):
            date_str = f" ({cert.get('completion_date')})" if cert.get('completion_date') else ""
            link_str = f" [Link]({cert.get('credential_link')})" if cert.get('credential_link') else ""
            cert_blocks.append(f"- {cert.get('name')} | {cert.get('organization')}{date_str}{link_str}")
            
        skills_category = data.get("skills", {})
        skills_lines = []
        if skills_category.get("languages"):
            skills_lines.append(f"- **Programming Languages**: {', '.join(skills_category.get('languages'))}")
        if skills_category.get("frameworks"):
            skills_lines.append(f"- **Frameworks/Frontend**: {', '.join(skills_category.get('frameworks'))}")
        if skills_category.get("databases"):
            skills_lines.append(f"- **Databases**: {', '.join(skills_category.get('databases'))}")
        if skills_category.get("tools"):
            skills_lines.append(f"- **Tools**: {', '.join(skills_category.get('tools'))}")
        if skills_category.get("cloud"):
            skills_lines.append(f"- **Cloud**: {', '.join(skills_category.get('cloud'))}")
        if skills_category.get("soft_skills"):
            skills_lines.append(f"- **Soft Skills**: {', '.join(skills_category.get('soft_skills'))}")
            
        achievements_list = data.get("achievements", [])
        achievements_str = "\n".join([f"- {ach}" for ach in achievements_list]) if achievements_list else "None"
        
        profiles = data.get("coding_profiles", {})
        profiles_parts = []
        if data.get("linkedin"):
            profiles_parts.append(f"[LinkedIn](https://{data.get('linkedin').replace('https://', '').replace('http://', '')})")
        if data.get("github"):
            profiles_parts.append(f"[GitHub](https://{data.get('github').replace('https://', '').replace('http://', '')})")
        if profiles.get("leetcode"):
            profiles_parts.append(f"[LeetCode](https://leetcode.com/{profiles.get('leetcode')})")
        if profiles.get("hackerrank"):
            profiles_parts.append(f"[HackerRank](https://hackerrank.com/{profiles.get('hackerrank')})")
        if profiles.get("codechef"):
            profiles_parts.append(f"[CodeChef](https://codechef.com/users/{profiles.get('codechef')})")
        if profiles.get("geeksforgeeks"):
            profiles_parts.append(f"[GeeksforGeeks](https://auth.geeksforgeeks.org/user/{profiles.get('geeksforgeeks')})")
            
        profiles_str = " | ".join(profiles_parts)
        skills_str = "\n".join(skills_lines)
        education_str = "\n".join(education_blocks)
        cert_str = "\n".join(cert_blocks)
        experience_str = "".join(experience_blocks)
        project_str = "".join(project_blocks)
        
        user_data_prompt = f"""
Candidate Name: {data.get('name')}
Professional Title: {data.get('title')}
Email: {data.get('email')}
Phone: {data.get('phone')}
Location: {data.get('location')}
Portfolio Website: {data.get('portfolio')}
Coding Profiles & Links: {profiles_str}
Professional Summary: {data.get('summary')}

Technical Skills:
{skills_str}

Work Experience / Internships:
{experience_str}

Projects:
{project_str}

Education:
{education_str}

Certifications:
{cert_str}

Achievements:
{achievements_str}
"""
        
        system_instruction = """You are an elite Executive Recruiter and ATS-Optimization Expert. Your objective is to take raw user input (personal details, work experience, projects, education, and skills) and transform it into a highly professional, 100% ATS-compliant resume.

You must strictly adhere to the following rules:

1. STRUCTURE & HEADINGS: Use only standard, universally recognized ATS headings: Summary, Skills, Experience, Projects, Education, Certifications, Achievements, Coding Profiles.
2. ATS FORMATTING: Do not use tables, multiple columns, or complex layouts. Output the final resume entirely in clean, standardized Markdown.
3. BULLET POINT OPTIMIZATION: Rewrite all project and experience descriptions using the Google-recommended XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]". 
4. ACTION-DRIVEN: Start every bullet point with a powerful, past-tense action verb (e.g., Architected, Spearheaded, Optimized, Deployed). Remove all passive voice and filler words.
5. KEYWORD INTEGRATION: Analyze the provided technical tools and seamlessly weave those keywords into the project/experience bullet points to ensure high ATS keyword matching.
6. ZERO FILLER: Do not include any introductory pleasantries, conversational text, or concluding remarks. Your output must ONLY be the final Markdown formatted resume, starting immediately with the user's name.
7. OMIT EMPTY SECTIONS: If the user has not provided any data for a section (such as no work experience, no projects, no certifications, or no achievements), do NOT write the heading or any placeholder text for that section. Completely exclude it from the final resume.
8. CLICKABLE URLS: Output all links (like LinkedIn, GitHub, LeetCode, email, portfolio, credential links) as clickable markdown links, e.g. [linkedin.com/in/username](https://linkedin.com/in/username)."""

        prompt = f"""{system_instruction}

User Data:
{user_data_prompt}

Transform the provided user data into the final resume now. Output ONLY the clean Markdown format."""

        if settings.GEMINI_API_KEY:
            models = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-2.0-flash"]
            async with httpx.AsyncClient() as client:
                for model in models:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
                    headers = {"Content-Type": "application/json"}
                    data_payload = {
                        "contents": [{"parts": [{"text": prompt}]}],
                    }
                    for attempt in range(2):
                        try:
                            response = await client.post(url, json=data_payload, headers=headers, timeout=40.0)
                            if response.status_code == 200:
                                res_json = response.json()
                                text = res_json['candidates'][0]['content']['parts'][0]['text']
                                return text.strip()
                        except Exception as e:
                            print(f"Gemini {model} resume generation attempt {attempt+1} failed: {e}")
                            await asyncio.sleep(1)
        
        # Local fallback if Gemini fails: construct basic Markdown
        email_link = f"[{data.get('email')}](mailto:{data.get('email')})" if data.get('email') else ""
        
        def clean_url(val: str, prefix: str) -> str:
            if not val:
                return ""
            v = val.strip()
            if v.startswith("http://"):
                v = v[7:]
            elif v.startswith("https://"):
                v = v[8:]
            return f"[{v}]({prefix}{v})"
            
        linkedin_link = clean_url(data.get('linkedin', ''), 'https://')
        github_link = clean_url(data.get('github', ''), 'https://')
        
        header_parts = [p for p in [data.get('name'), email_link, data.get('phone'), data.get('location'), linkedin_link, github_link] if p]
        
        fallback_md = f"# {data.get('name')}\n"
        fallback_md += " | ".join(header_parts[1:]) + "\n\n"
        
        if data.get('summary'):
            fallback_md += f"## Summary\n{data.get('summary')}\n\n"
            
        skills_category = data.get("skills", {})
        skills_lines = []
        if skills_category.get("languages"):
            skills_lines.append(f"- **Programming Languages**: {', '.join(skills_category.get('languages'))}")
        if skills_category.get("frameworks"):
            skills_lines.append(f"- **Frameworks/Frontend**: {', '.join(skills_category.get('frameworks'))}")
        if skills_category.get("databases"):
            skills_lines.append(f"- **Databases**: {', '.join(skills_category.get('databases'))}")
        if skills_category.get("tools"):
            skills_lines.append(f"- **Tools**: {', '.join(skills_category.get('tools'))}")
        if skills_category.get("cloud"):
            skills_lines.append(f"- **Cloud**: {', '.join(skills_category.get('cloud'))}")
        if skills_category.get("soft_skills"):
            skills_lines.append(f"- **Soft Skills**: {', '.join(skills_category.get('soft_skills'))}")
            
        if skills_lines:
            fallback_md += "## Skills\n" + "\n".join(skills_lines) + "\n\n"
            
        active_exps = data.get("experience", [])
        if active_exps:
            fallback_md += "## Experience\n"
            for exp in active_exps:
                fallback_md += f"### {exp.get('company')} - {exp.get('role')}\n*{exp.get('duration')}*\n"
                resp = exp.get('responsibilities', '')
                for line in resp.split('\n'):
                    if line.strip():
                        bullet = line.strip() if line.strip().startswith('-') else f"- {line.strip()}"
                        fallback_md += f"{bullet}\n"
                ach = exp.get('achievements', '')
                if ach:
                    fallback_md += "*Achievements:*\n"
                    for line in ach.split('\n'):
                        if line.strip():
                            bullet = line.strip() if line.strip().startswith('-') else f"- {line.strip()}"
                            fallback_md += f"{bullet}\n"
                fallback_md += "\n"
                
        active_projs = data.get("projects", [])
        if active_projs:
            fallback_md += "## Projects\n"
            for proj in active_projs:
                link_parts = []
                if proj.get('github_link'):
                    link_parts.append(f"[GitHub]({proj.get('github_link')})")
                if proj.get('live_demo'):
                    link_parts.append(f"[Live Demo]({proj.get('live_demo')})")
                link_str = f" ({' | '.join(link_parts)})" if link_parts else ""
                fallback_md += f"### {proj.get('title')}{link_str}\n*Technologies: {proj.get('tech_stack')}*\n"
                desc = proj.get('description', '')
                for line in desc.split('\n'):
                    if line.strip():
                        bullet = line.strip() if line.strip().startswith('-') else f"- {line.strip()}"
                        fallback_md += f"{bullet}\n"
                kf = proj.get('key_features', '')
                if kf:
                    fallback_md += "*Key Features:*\n"
                    for line in kf.split('\n'):
                        if line.strip():
                            bullet = line.strip() if line.strip().startswith('-') else f"- {line.strip()}"
                            fallback_md += f"{bullet}\n"
                fallback_md += "\n"
                
        active_edus = data.get("education", [])
        if active_edus:
            fallback_md += "## Education\n"
            for edu in active_edus:
                fallback_md += f"- **{edu.get('school')}** | {edu.get('degree')} in {edu.get('branch')} (Graduation: {edu.get('start_year')} - {edu.get('end_year')}) | Grade: {edu.get('cgpa_or_percentage')}\n"
            fallback_md += "\n"
            
        active_certs = data.get("certifications", [])
        if active_certs:
            fallback_md += "## Certifications\n"
            for cert in active_certs:
                date_str = f" ({cert.get('completion_date')})" if cert.get('completion_date') else ""
                link_str = f" [Link]({cert.get('credential_link')})" if cert.get('credential_link') else ""
                fallback_md += f"- {cert.get('name')} | {cert.get('organization')}{date_str}{link_str}\n"
            fallback_md += "\n"
            
        achievements_list = data.get("achievements", [])
        if achievements_list:
            fallback_md += "## Achievements\n"
            for ach in achievements_list:
                fallback_md += f"- {ach}\n"
            fallback_md += "\n"
            
        profiles = data.get("coding_profiles", {})
        profiles_parts = []
        if profiles.get("leetcode"):
            profiles_parts.append(f"[LeetCode](https://leetcode.com/{profiles.get('leetcode')})")
        if profiles.get("hackerrank"):
            profiles_parts.append(f"[HackerRank](https://hackerrank.com/{profiles.get('hackerrank')})")
        if profiles.get("codechef"):
            profiles_parts.append(f"[CodeChef](https://codechef.com/users/{profiles.get('codechef')})")
        if profiles.get("geeksforgeeks"):
            profiles_parts.append(f"[GeeksforGeeks](https://auth.geeksforgeeks.org/user/{profiles.get('geeksforgeeks')})")
            
        if profiles_parts:
            fallback_md += "## Coding Profiles\n"
            fallback_md += " | ".join(profiles_parts) + "\n\n"
            
        return fallback_md

