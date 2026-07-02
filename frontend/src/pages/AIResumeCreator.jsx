import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  User, Mail, Phone, Globe, Briefcase, FileCode,
  GraduationCap, Award, Plus, Trash2, Download,
  Sparkles, RefreshCw, ChevronLeft, ChevronRight,
  Eye, Edit3, CheckCircle, HelpCircle, FileText,
  MapPin, ExternalLink, Code, Save, CloudLightning
} from 'lucide-react';

const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const AIResumeCreator = () => {
  // Step navigation: 1: Profile & Summary, 2: Education & Skills, 3: Experience & Projects, 4: Certifications & Profiles
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');
  const [template, setTemplate] = useState('tech'); // 'classic', 'tech', 'executive'
  const [viewMode, setViewMode] = useState('split'); // 'split', 'form', 'preview'

  // Resume State matching the 9 student-focused fields
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: ''
  });

  const [summary, setSummary] = useState('');

  const [educations, setEducations] = useState([
    { school: '', degree: '', branch: '', cgpa_or_percentage: '', start_year: '', end_year: '' }
  ]);

  const [skills, setSkills] = useState({
    languages: [],
    frameworks: [],
    databases: [],
    tools: [],
    cloud: [],
    soft_skills: []
  });

  // Inputs for skills categories
  const [skillInputs, setSkillInputs] = useState({
    languages: '',
    frameworks: '',
    databases: '',
    tools: '',
    cloud: '',
    soft_skills: ''
  });

  const [experiences, setExperiences] = useState([
    { company: '', role: '', duration: '', responsibilities: '', achievements: '' }
  ]);

  const [projects, setProjects] = useState([
    { title: '', tech_stack: '', description: '', github_link: '', live_demo: '', key_features: '' }
  ]);

  const [certifications, setCertifications] = useState([
    { name: '', organization: '', completion_date: '', credential_link: '' }
  ]);

  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState('');

  const [codingProfiles, setCodingProfiles] = useState({
    leetcode: '',
    hackerrank: '',
    codechef: '',
    geeksforgeeks: ''
  });

  // Load saved resume draft on startup from database
  useEffect(() => {
    const fetchSavedResume = async () => {
      try {
        const res = await api.get('/api/ai/resume/load');
        if (res.data && res.data.resume_data) {
          const rd = res.data.resume_data;
          if (rd.profile) setProfile(rd.profile);
          if (rd.summary !== undefined) setSummary(rd.summary);
          if (rd.educations) setEducations(rd.educations);
          if (rd.skills) setSkills(rd.skills);
          if (rd.experiences) setExperiences(rd.experiences);
          if (rd.projects) setProjects(rd.projects);
          if (rd.certifications) setCertifications(rd.certifications);
          if (rd.achievements) setAchievements(rd.achievements);
          if (rd.codingProfiles) setCodingProfiles(rd.codingProfiles);
          if (res.data.optimized_markdown) setOptimizedResume(res.data.optimized_markdown);
          setSuccessMsg('Loaded your saved resume draft from the cloud.');
        }
      } catch (err) {
        console.error('Failed to load saved resume:', err);
      }
    };
    fetchSavedResume();
  }, []);

  // Save current progress to DB
  const saveProgress = async (silent = false) => {
    if (!silent) setSaveLoading(true);
    setError('');
    
    const payload = {
      resume_data: {
        profile,
        summary,
        educations,
        skills,
        experiences,
        projects,
        certifications,
        achievements,
        codingProfiles
      },
      optimized_markdown: optimizedResume
    };

    try {
      await api.post('/api/ai/resume/save', payload);
      if (!silent) {
        setSuccessMsg('Resume draft saved robustly to cloud database!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Failed to save resume:', err);
      if (!silent) {
        setError('Failed to save progress. Please sign in to save data.');
      }
    } finally {
      if (!silent) setSaveLoading(false);
    }
  };

  // Prefill default profile with John Doe's resume details
  const loadDemoData = () => {
    setProfile({
      name: 'John Doe',
      title: 'Computer Science Student',
      email: 'johndoe@gmail.com',
      phone: '+1-555-0199',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      portfolio: ''
    });

    setSummary('Computer Science student skilled in software development, machine learning, and problem-solving with experience in AI-based and web application development. Passionate about emerging technologies and building innovative technology-driven solutions.');

    setEducations([
      {
        school: 'State Engineering College',
        degree: 'Bachelor of Technology',
        branch: 'Computer Science',
        cgpa_or_percentage: 'CGPA: 9.2 / 10',
        start_year: '2023',
        end_year: 'Present'
      },
      {
        school: 'State Junior College',
        degree: 'Intermediate Education',
        branch: 'Mathematics, Physics, and Chemistry',
        cgpa_or_percentage: 'Percentage: 97.3%',
        start_year: '2021',
        end_year: '2023'
      }
    ]);

    setSkills({
      languages: ['Python', 'Java', 'JavaScript', 'C'],
      frameworks: ['HTML', 'CSS', 'JavaScript'],
      databases: ['MySQL', 'MongoDB'],
      tools: ['Scikit-learn', 'NumPy', 'Pandas', 'Tableau', 'Matplotlib', 'Seaborn', 'Git', 'GitHub'],
      cloud: [],
      soft_skills: ['Data Structures and Algorithms', 'DBMS', 'OOPs', 'Operating Systems', 'Computer Networks']
    });

    setExperiences([
      {
        company: 'Tech Solutions Inc.',
        role: 'Agentic AI Intern (Remote)',
        duration: 'Feb 2026 - Present',
        responsibilities: '- Developing Generative AI and NLP applications using Python and Hugging Face Transformers, focusing on intelligent text processing, prompt engineering, and automation workflows for real-world AI-based solutions and chatbot systems.\n- Performing data preprocessing, prompt engineering, and AI workflow development to build real-world chatbot and automation solutions.',
        achievements: ''
      },
      {
        company: 'Data Systems LLC',
        role: 'AIML Intern (Remote)',
        duration: 'Apr 2026 - Present',
        responsibilities: '- Implementing machine learning algorithms including Linear Regression, KNN, Decision Trees, and Random Forests using Scikit-learn for predictive analytics, classification tasks, and model performance improvement.\n- Performing data preprocessing, and model evaluation using Pandas, NumPy, Matplotlib, and Seaborn.',
        achievements: ''
      }
    ]);

    setProjects([
      {
        title: 'Automated Report Generator (Industrial Project)',
        tech_stack: 'Python, Pandas, NumPy, Matplotlib, Seaborn',
        description: 'Built an interactive web application that automates dataset uploading, preprocessing and visualization.',
        github_link: 'github.com/johndoe/report-generator',
        live_demo: '',
        key_features: '- Built an interactive web application that automates dataset uploading, preprocessing and visualization using Python, Pandas, NumPy, Matplotlib and Seaborn.\n- Enhanced data analysis efficiency by enabling multi-file merging, descriptive statistics generation, and customizable user notes, reducing manual effort and improving accuracy.'
      },
      {
        title: 'Blood Bank Management System',
        tech_stack: 'Python (Flask), HTML, CSS, JavaScript, MySQL, EmailJS',
        description: 'Developed a web-based system for donor registration and blood request management.',
        github_link: 'github.com/johndoe/blood-bank',
        live_demo: '',
        key_features: '- Developed a web-based system using Python (Flask), HTML, CSS, JavaScript, and MySQL for donor registration and blood request management.\n- Implemented automated donor matching, real-time blood availability search, and email notifications using EmailJS to improve communication and response time.'
      },
      {
        title: 'Movie Recommendation System',
        tech_stack: 'Streamlit, Pandas, Scikit-learn',
        description: 'Developed a movie recommendation system using the MovieLens dataset containing 100K+ ratings.',
        github_link: 'github.com/johndoe/movie-recommendation',
        live_demo: '',
        key_features: '- Developed a movie recommendation system using the MovieLens dataset containing 100K+ ratings, implementing collaborative and content-based filtering techniques for personalized movie suggestions.\n- Built an interactive recommendation interface using Streamlit, integrating data preprocessing, genre-based filtering, and machine learning models using Pandas and Scikit-learn for improved user experience.'
      }
    ]);

    setCertifications([
      {
        name: 'Qualified GATE 2026',
        organization: 'IIT',
        completion_date: '2026',
        credential_link: ''
      },
      {
        name: 'Oracle Certified Generative AI Professional',
        organization: 'Oracle',
        completion_date: '2025',
        credential_link: ''
      },
      {
        name: 'TATA-Accredited Certification in Generative AI',
        organization: 'TATA',
        completion_date: '2025',
        credential_link: ''
      },
      {
        name: 'Cisco Introduction to Data Science',
        organization: 'Cisco',
        completion_date: '2024',
        credential_link: ''
      },
      {
        name: 'TCS iON Career Edge - Young Professional',
        organization: 'TCS iON',
        completion_date: '2024',
        credential_link: ''
      },
      {
        name: 'Udemy Full Stack Development Certification',
        organization: 'Udemy',
        completion_date: '2023',
        credential_link: ''
      }
    ]);

    setAchievements([
      'Hackathon Runner-Up at Annual Hackfest',
      'Top 5% Rank in National Coding Challenge 2024'
    ]);
    
    setCodingProfiles({
      leetcode: 'johndoe_leetcode',
      hackerrank: 'johndoe_hr',
      codechef: '',
      geeksforgeeks: ''
    });

    setOptimizedResume('');
    setSuccessMsg('Demo comprehensive profile loaded! Click "Generate & Optimize" to see AI resume enhancements.');
  };

  // Helper functions for dynamic lists
  const addExperience = () => {
    setExperiences([...experiences, { company: '', role: '', duration: '', responsibilities: '', achievements: '' }]);
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = experiences.map((exp, i) => {
      if (i === index) return { ...exp, [field]: value };
      return exp;
    });
    setExperiences(updated);
  };

  const addProject = () => {
    setProjects([...projects, { title: '', tech_stack: '', description: '', github_link: '', live_demo: '', key_features: '' }]);
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleProjectChange = (index, field, value) => {
    const updated = projects.map((proj, i) => {
      if (i === index) return { ...proj, [field]: value };
      return proj;
    });
    setProjects(updated);
  };

  const addEducation = () => {
    setEducations([...educations, { school: '', degree: '', branch: '', cgpa_or_percentage: '', start_year: '', end_year: '' }]);
  };

  const removeEducation = (index) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index, field, value) => {
    const updated = educations.map((edu, i) => {
      if (i === index) return { ...edu, [field]: value };
      return edu;
    });
    setEducations(updated);
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: '', organization: '', completion_date: '', credential_link: '' }]);
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleCertificationChange = (index, field, value) => {
    const updated = certifications.map((cert, i) => {
      if (i === index) return { ...cert, [field]: value };
      return cert;
    });
    setCertifications(updated);
  };

  const handleAddSkillTag = (category, e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = skillInputs[category].trim();
      if (val && !skills[category].includes(val)) {
        setSkills({
          ...skills,
          [category]: [...skills[category], val]
        });
        setSkillInputs({
          ...skillInputs,
          [category]: ''
        });
      }
    }
  };

  const handleRemoveSkillTag = (category, tag) => {
    setSkills({
      ...skills,
      [category]: skills[category].filter(t => t !== tag)
    });
  };

  const addAchievement = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = newAchievement.trim();
      if (val && !achievements.includes(val)) {
        setAchievements([...achievements, val]);
        setNewAchievement('');
      }
    }
  };

  const removeAchievement = (ach) => {
    setAchievements(achievements.filter(a => a !== ach));
  };

  // Step Navigation Helpers with auto-saving triggers
  const handleNextStep = () => {
    saveProgress(true);
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    saveProgress(true);
    setStep(step - 1);
  };

  // AI Summary Generator call
  const handleAutoGenerateSummary = async () => {
    setSummaryLoading(true);
    setError('');
    
    const allSkills = Object.values(skills).flat();
    const expSummaries = experiences
      .filter(exp => exp.company && exp.role)
      .map(exp => `${exp.role} at ${exp.company}`)
      .join(', ');

    const payload = {
      title: profile.title || 'Software Developer',
      skills: allSkills,
      experience_summary: expSummaries
    };

    if (allSkills.length === 0) {
      setError('Please add a few core technical skills first so the AI can tailor your summary.');
      setSummaryLoading(false);
      return;
    }

    try {
      const res = await api.post('/api/ai/resume/generate-summary', payload);
      setSummary(res.data.summary);
      setSuccessMsg('AI professional summary generated successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to auto-generate summary. Please fill it manually.');
    } finally {
      setSummaryLoading(false);
    }
  };

  // Compile local draft Markdown. Entirely omits empty sections
  const generateLocalDraft = () => {
    let md = '';
    
    if (summary && summary.trim()) {
      md += `## Summary\n${summary.trim()}\n\n`;
    }
    
    // Grouped skills
    const skillsLines = [];
    if (skills.languages?.length > 0) skillsLines.push(`- **Programming Languages**: ${skills.languages.join(', ')}`);
    if (skills.frameworks?.length > 0) skillsLines.push(`- **Frameworks/Frontend**: ${skills.frameworks.join(', ')}`);
    if (skills.databases?.length > 0) skillsLines.push(`- **Databases**: ${skills.databases.join(', ')}`);
    if (skills.tools?.length > 0) skillsLines.push(`- **Tools**: ${skills.tools.join(', ')}`);
    if (skills.cloud?.length > 0) skillsLines.push(`- **Cloud**: ${skills.cloud.join(', ')}`);
    if (skills.soft_skills?.length > 0) skillsLines.push(`- **Soft Skills**: ${skills.soft_skills.join(', ')}`);
    
    if (skillsLines.length > 0) {
      md += `## Skills\n${skillsLines.join('\n')}\n\n`;
    }
    
    const activeExps = experiences.filter(exp => exp.company.trim() || exp.role.trim());
    if (activeExps.length > 0) {
      md += `## Experience\n`;
      activeExps.forEach(exp => {
        md += `### ${exp.company} | ${exp.role} | ${exp.duration || 'Duration'}\n`;
        if (exp.responsibilities && exp.responsibilities.trim()) {
          const lines = exp.responsibilities.split('\n');
          lines.forEach(l => {
            if (l.trim()) {
              const bullet = l.trim().startsWith('-') ? l.trim() : `- ${l.trim()}`;
              md += `${bullet}\n`;
            }
          });
        }
        if (exp.achievements && exp.achievements.trim()) {
          md += `*Achievements:*\n`;
          const lines = exp.achievements.split('\n');
          lines.forEach(l => {
            if (l.trim()) {
              const bullet = l.trim().startsWith('-') ? l.trim() : `- ${l.trim()}`;
              md += `${bullet}\n`;
            }
          });
        }
        md += `\n`;
      });
    }

    const activeProjs = projects.filter(proj => proj.title.trim());
    if (activeProjs.length > 0) {
      md += `## Projects\n`;
      activeProjs.forEach(proj => {
        const linkParts = [];
        if (proj.github_link) linkParts.push(`[GitHub](https://${proj.github_link.replace(/^(https?:\/\/)?/, '')})`);
        if (proj.live_demo) linkParts.push(`[Live Demo](https://${proj.live_demo.replace(/^(https?:\/\/)?/, '')})`);
        const linkStr = linkParts.length > 0 ? ` | ${linkParts.join(' | ')}` : '';
        md += `### ${proj.title} | ${proj.tech_stack || 'None'}${linkStr}\n`;
        if (proj.description && proj.description.trim()) {
          md += `${proj.description.trim()}\n`;
        }
        if (proj.key_features && proj.key_features.trim()) {
          const lines = proj.key_features.split('\n');
          lines.forEach(l => {
            if (l.trim()) {
              const bullet = l.trim().startsWith('-') ? l.trim() : `- ${l.trim()}`;
              md += `${bullet}\n`;
            }
          });
        }
        md += `\n`;
      });
    }

    const activeEdus = educations.filter(edu => edu.school.trim());
    if (activeEdus.length > 0) {
      md += `## Education\n`;
      activeEdus.forEach(edu => {
        const branchPart = edu.branch ? ` in ${edu.branch}` : '';
        md += `- **${edu.school}** | ${edu.degree}${branchPart} | ${edu.start_year || 'N/A'} - ${edu.end_year || 'N/A'} | Grade: ${edu.cgpa_or_percentage || 'N/A'}\n`;
      });
      md += `\n`;
    }

    const activeCerts = certifications.filter(c => c.name.trim());
    if (activeCerts.length > 0) {
      md += `## Certifications\n`;
      activeCerts.forEach(cert => {
        const dateStr = cert.completion_date ? ` (${cert.completion_date})` : '';
        const linkStr = cert.credential_link ? ` | [Credential](https://${cert.credential_link.replace(/^(https?:\/\/)?/, '')})` : '';
        md += `- **${cert.name}** | ${cert.organization}${dateStr}${linkStr}\n`;
      });
      md += `\n`;
    }

    const activeAchievements = achievements.filter(ach => ach.trim());
    if (activeAchievements.length > 0) {
      md += `## Achievements\n`;
      activeAchievements.forEach(ach => {
        md += `- ${ach}\n`;
      });
      md += `\n`;
    }

    const profileLinks = [];
    if (codingProfiles.leetcode) profileLinks.push(`[LeetCode](https://leetcode.com/${codingProfiles.leetcode})`);
    if (codingProfiles.hackerrank) profileLinks.push(`[HackerRank](https://hackerrank.com/${codingProfiles.hackerrank})`);
    if (codingProfiles.codechef) profileLinks.push(`[CodeChef](https://codechef.com/${codingProfiles.codechef})`);
    if (codingProfiles.geeksforgeeks) profileLinks.push(`[GeeksforGeeks](https://auth.geeksforgeeks.org/user/${codingProfiles.geeksforgeeks})`);
    
    if (profileLinks.length > 0) {
      md += `## Coding Profiles\n${profileLinks.join(' | ')}\n\n`;
    }

    return md;
  };

  const handleGenerate = async () => {
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const payload = {
      name: profile.name || 'Your Name',
      title: profile.title || 'Software Developer',
      email: profile.email || 'your.email@example.com',
      phone: profile.phone || '123-456-7890',
      location: profile.location || '',
      linkedin: profile.linkedin || '',
      github: profile.github || '',
      portfolio: profile.portfolio || '',
      summary: summary || '',
      skills: skills,
      experience: experiences.filter(exp => exp.company.trim() || exp.role.trim()),
      projects: projects.filter(proj => proj.title.trim()),
      education: educations.filter(edu => edu.school.trim()),
      certifications: certifications.filter(c => c.name.trim()),
      achievements: achievements.filter(a => a.trim()),
      coding_profiles: codingProfiles
    };

    if (!payload.name || Object.values(skills).flat().length === 0) {
      setError('Name and at least one technical skill are required to generate optimized resume.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/api/ai/resume/generate', payload);
      setOptimizedResume(res.data.markdown);
      setSuccessMsg('Resume optimized by AI Recruiter using XYZ structure!');
      
      // Auto-save generated version to DB
      saveProgress(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to communicate with AI generation backend.');
    } finally {
      setLoading(false);
    }
  };

  // Regex markdown link parser
  const parseMarkdownToHTML = (md) => {
    if (!md) return '';
    
    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
      
    html = html.replace(/^#\s+(.+)$/gm, '');

    // Headers: ## Header -> <h2>Header</h2>
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    
    // Subheaders: ### Header -> <h3>Header</h3>
    html = html.replace(/^###\s+(.+)$/gm, (match, p1) => {
      const parts = p1.split('|');
      if (parts.length > 1) {
        return `<h3><span>${parts[0].trim()}${parts.slice(2).length > 0 ? ' | ' + parts.slice(2).join(' | ').trim() : ''}</span><span class="date">${parts[1].trim()}</span></h3>`;
      }
      return `<h3>${p1}</h3>`;
    });
    
    // Bullet points: - list -> <li>list</li>
    html = html.replace(/^\s*[-*•]\s+(.+)$/gm, '<li>$1</li>');
    
    // Wrap list items in <ul>
    const lines = html.split('\n');
    let inList = false;
    const processedLines = [];
    
    for (let line of lines) {
      if (line.trim().startsWith('<li>') && line.trim().endsWith('</li>')) {
        if (!inList) {
          processedLines.push('<ul>');
          inList = true;
        }
        processedLines.push(line);
      } else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(line);
      }
    }
    if (inList) processedLines.push('</ul>');
    
    html = processedLines.join('\n');
    
    // Bold: **text** -> <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text* -> <em>text</em>
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Markdown Links: [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="preview-md-link">$1</a>');
    
    return html;
  };

  // Compile visual headers into clean interleaved links
  const renderHeaderLinks = (colorClass) => {
    const parts = [];
    if (profile.phone) {
      parts.push(<span key="phone">{profile.phone}</span>);
    }
    if (profile.email) {
      parts.push(
        <a key="email" href={`mailto:${profile.email}`} className={`${colorClass} hover:underline`}>
          {profile.email}
        </a>
      );
    }
    if (profile.location) {
      parts.push(<span key="location" className="inline-flex items-center gap-1"><MapPin size={12} />{profile.location}</span>);
    }
    if (profile.linkedin) {
      const cleanLi = profile.linkedin.replace(/^(https?:\/\/)?(www\.)?/, "");
      parts.push(
        <a key="linkedin" href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className={`${colorClass} hover:underline`}>
          {cleanLi}
        </a>
      );
    }
    if (profile.github) {
      const cleanGit = profile.github.replace(/^(https?:\/\/)?(www\.)?/, "");
      parts.push(
        <a key="github" href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`} target="_blank" rel="noopener noreferrer" className={`${colorClass} hover:underline`}>
          {cleanGit}
        </a>
      );
    }
    if (profile.portfolio) {
      const cleanPort = profile.portfolio.replace(/^(https?:\/\/)?(www\.)?/, "");
      parts.push(
        <a key="portfolio" href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`} target="_blank" rel="noopener noreferrer" className={`${colorClass} hover:underline`}>
          {cleanPort}
        </a>
      );
    }
    
    const interleaved = [];
    parts.forEach((part, index) => {
      interleaved.push(part);
      if (index < parts.length - 1) {
        interleaved.push(
          <span key={`div-${index}`} className="text-slate-400 mx-2 font-normal">
            {template === 'tech' ? '•' : '|'}
          </span>
        );
      }
    });
    return interleaved;
  };

  const handleDownloadPDF = () => {


    const printWindow = window.open('', '_blank');


    const { name, email, phone, linkedin, github } = profile;



    let fontStyle = "";


    let customClasses = "";



    const parseMarkdownToHTML = (md) => {


      if (!md) return "";


      let html = md;


      html = html.replace(/^\s*##\s+(.+)$/gm, '<h2>$1</h2>');


      html = html.replace(/^\s*###\s+(.+)$/gm, '<h3>$1</h3>');


      html = html.replace(/^\s*\*\s+(.+)$/gm, '<li>$1</li>');


      html = html.replace(/<li>(.+)<\/li>\n<li>/g, '<li>$1</li><li>');


      html = html.replace(/(<li>.+<\/li>)/g, '<ul>$1</ul>');


      html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');


      html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');


      html = html.replace(/<\/ul>\s*<ul>/g, '');


      return html;


    };



    if (template === 'classic') {


      fontStyle = "font-family: 'Times New Roman', Times, serif; color: #333;";


      customClasses = `


        h1 { text-align: center; font-size: 24pt; margin: 0 0 5pt 0; color: #111827; }


        .contact-info { text-align: center; font-size: 10pt; margin-bottom: 15pt; color: #4b5563; }


        .contact-info span { margin: 0 5pt; }


        h2 { font-size: 12pt; text-transform: uppercase; color: #111827; border-bottom: 1px solid #111827; padding-bottom: 2pt; margin-top: 15pt; margin-bottom: 6pt; font-weight: bold; }


        h3 { font-size: 11pt; font-weight: bold; color: #111827; margin-top: 8pt; margin-bottom: 3pt; display: flex; justify-content: space-between; }


        h3 span.date { font-weight: normal; color: #4b5563; }


        p, li { font-size: 10pt; line-height: 1.4; margin-bottom: 3pt; }


        ul { padding-left: 15pt; margin-top: 3pt; margin-bottom: 6pt; list-style-type: square; }


      `;


    } else if (template === 'tech') {


      fontStyle = "font-family: 'Inter', Arial, sans-serif; color: #1f2937;";


      customClasses = `


        h1 { font-size: 24pt; font-weight: 800; margin: 0 0 3pt 0; color: #111827; letter-spacing: -0.5px; }


        .contact-info { font-size: 9.5pt; margin-bottom: 15pt; display: flex; flex-wrap: wrap; gap: 6pt; color: #4b5563; }


        .contact-info span { display: inline-flex; align-items: center; }


        .contact-info span::after { content: "•"; margin-left: 6pt; color: #d1d5db; }


        .contact-info span:last-child::after { content: ""; }


        h2 { font-size: 11pt; text-transform: uppercase; color: #4f46e5; border-bottom: 2px solid #f3f4f6; padding-bottom: 2pt; margin-top: 16pt; margin-bottom: 6pt; font-weight: 700; letter-spacing: 1px; }


        h3 { font-size: 10.5pt; font-weight: 700; color: #111827; margin-top: 8pt; margin-bottom: 3pt; display: flex; justify-content: space-between; }


        h3 span.date { font-weight: 500; color: #6b7280; font-size: 9pt; }


        p, li { font-size: 9.5pt; line-height: 1.45; margin-bottom: 3pt; }


        ul { padding-left: 12pt; margin-top: 3pt; margin-bottom: 6pt; list-style-type: circle; }


        strong { color: #111827; }


      `;


    } else {


      fontStyle = "font-family: Georgia, serif; color: #222;";


      customClasses = `


        h1 { text-align: center; font-size: 23pt; font-weight: bold; margin: 0 0 4pt 0; color: #111827; }


        .contact-info { text-align: center; font-size: 9.5pt; margin-bottom: 15pt; font-style: italic; color: #4b5563; border-bottom: 1px double #9ca3af; padding-bottom: 5pt; }


        .contact-info span { margin: 0 5pt; }


        h2 { font-size: 12pt; text-align: center; border-bottom: 1px solid #222; padding-bottom: 2pt; margin-top: 15pt; margin-bottom: 6pt; font-weight: bold; }


        h3 { font-size: 10.5pt; font-weight: bold; color: #111827; margin-top: 8pt; margin-bottom: 2pt; display: flex; justify-content: space-between; }


        h3 span.date { font-style: italic; font-weight: normal; }


        p, li { font-size: 9.5pt; line-height: 1.4; margin-bottom: 3pt; }


        ul { padding-left: 15pt; margin-top: 3pt; margin-bottom: 6pt; }


      `;


    }



    printWindow.document.write(`


      <!DOCTYPE html>


      <html>


        <head>


          <title>Resume - ${name}</title>


          <style>


            @page {


              size: A4;


              margin: 1.5cm;


            }


            body {


              ${fontStyle}


              margin: 0;


              padding: 0;


            }


            ${customClasses}


            @media print {


              body {


                -webkit-print-color-adjust: exact;


                print-color-adjust: exact;


              }


            }


          </style>


        </head>


        <body>


          <div>


            <h1>${name}</h1>


            <div class="contact-info">


              <span>${email}</span>


              <span>${phone}</span>


              ${linkedin ? `<span>LinkedIn: ${linkedin}</span>` : ''}


              ${github ? `<span>GitHub: ${github}</span>` : ''}


            </div>


            ${parseMarkdownToHTML(optimizedResume || "")}


          </div>


          <script>


            window.onload = function() {


              setTimeout(function() {


                window.print();


                window.close();


              }, 250);


            };


          </script>


        </body>


      </html>


    `);


    printWindow.document.close();


  };



  const getTemplatePreviewClasses = () => {
    if (template === 'classic') return 'font-serif text-slate-900 bg-white border border-slate-300 p-4 shadow-sm max-w-[800px] mx-auto min-h-[842px] relative rounded-sm text-left';
    if (template === 'tech') return 'font-sans text-slate-800 bg-white border border-slate-300 p-4 shadow-sm max-w-[800px] mx-auto min-h-[842px] relative rounded-sm text-left';
    return 'font-serif text-slate-900 bg-white border border-slate-300 p-4 shadow-sm max-w-[800px] mx-auto min-h-[842px] relative rounded-sm italic-headings text-left';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-4 animate-fadeIn relative overflow-hidden">
      
      {/* Dynamic Glowing background nodes for 3D depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="text-indigo-400 animate-pulse" />
            AI Resume Creator
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build a highly optimized, 100% ATS-compliant resume with Google XYZ formulas and action-driven language.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => saveProgress(false)}
            disabled={saveLoading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg hover:shadow-[0_0_10px_rgba(255,255,255,0.05)] transition-all duration-200"
          >
            {saveLoading ? <LoadingSpinner size="sm" /> : <Save size={14} />}
            <span>Save Draft</span>
          </button>
          <button
            onClick={loadDemoData}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition-all duration-200"
          >
            <RefreshCw size={14} />
            <span>Load Demo Profile</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border border-indigo-500/30 hover:border-indigo-400 shadow-[0_0_12px_rgba(79,70,229,0.3)] transition-all duration-200"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Message Notifications */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-rose-500/15 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3 relative z-10 animate-bounceFast">
          <HelpCircle className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-sm flex items-start gap-3 relative z-10 animate-fadeIn">
          <CheckCircle className="mt-0.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Layout Toggle for responsive/split screens */}
      <div className="flex justify-end gap-1 mb-6 bg-slate-900/60 p-1 rounded-lg border border-slate-800 w-fit ml-auto relative z-10">
        <button
          onClick={() => setViewMode('form')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            viewMode === 'form' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Edit3 size={13} />
          <span>Form Editor</span>
        </button>
        <button
          onClick={() => setViewMode('split')}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            viewMode === 'split' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Eye size={13} />
          <span>Split Screen</span>
        </button>
        <button
          onClick={() => setViewMode('preview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            viewMode === 'preview' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileText size={13} />
          <span>Resume Sheet</span>
        </button>
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start relative z-10">
        
        {/* Left Side: Form Editor (Visible when in 'form' or 'split' view) */}
        <div className={`${viewMode === 'preview' ? 'hidden' : viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} flex flex-col gap-4`}>
          
          {/* Step indicators */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 flex justify-between items-center relative overflow-hidden backdrop-blur-md hover-card-3d">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => { saveProgress(true); setStep(s); }}
                className={`flex-1 flex flex-col items-center py-2 relative z-10 transition-all ${
                  step === s ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm mb-1 transition-all ${
                  step === s 
                    ? 'bg-indigo-600/35 border-indigo-400 text-indigo-200 shadow-[0_0_8px_rgba(99,102,241,0.4)]' 
                    : step > s 
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  {s}
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold">
                  {s === 1 ? 'Profile' : s === 2 ? 'Edu & Skills' : s === 3 ? 'Exp & Projects' : 'Cert & Profiles'}
                </span>
              </button>
            ))}
          </div>

          {/* Form Content Cards */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-lg p-4 backdrop-blur-md min-h-[480px] flex flex-col justify-between hover-card-3d">
            
            <div>
              {/* STEP 1: PERSONAL DETAILS & SUMMARY */}
              {step === 1 && (
                <div className="space-y-4 animate-slideRight">
                  <div className="border-b border-slate-800 pb-3 mb-4">
                    <h2 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                      <User size={18} />
                      Personal Information & Summary
                    </h2>
                    <p className="text-xs text-slate-400 font-normal">Add contact details for recruiter communication.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wide">Full Name</label>
                      <input
                        type="text"
                        placeholder="Alex Mercer"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wide">Professional Title</label>
                      <input
                        type="text"
                        placeholder="Full Stack Developer"
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wide">Email Address</label>
                      <input
                        type="email"
                        placeholder="alex.mercer@gmail.com"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wide">Phone Number</label>
                      <input
                        type="text"
                        placeholder="+91-6303528417"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wide">Location (City, State)</label>
                      <input
                        type="text"
                        placeholder="Hyderabad, Telangana"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wide">Portfolio Website (Optional)</label>
                      <input
                        type="text"
                        placeholder="alexmercer.dev"
                        value={profile.portfolio}
                        onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wide">LinkedIn Profile Link</label>
                      <div className="relative">
                        <LinkedinIcon className="absolute left-3.5 top-3.5 text-slate-500" />
                        <input
                          type="text"
                          placeholder="linkedin.com/in/username"
                          value={profile.linkedin}
                          onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                          className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wide">GitHub Link</label>
                      <div className="relative">
                        <GithubIcon className="absolute left-3.5 top-3.5 text-slate-500" />
                        <input
                          type="text"
                          placeholder="github.com/username"
                          value={profile.github}
                          onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                          className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Professional Summary</label>
                      <button
                        onClick={handleAutoGenerateSummary}
                        disabled={summaryLoading}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1 hover:scale-105 transition-all"
                      >
                        {summaryLoading ? <LoadingSpinner size="sm" /> : <Sparkles size={11} />}
                        <span>Auto-Generate with AI</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Briefly state your core technical achievements and career objective..."
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: ACADEMIC EDUCATION & SKILLS */}
              {step === 2 && (
                <div className="space-y-4 animate-slideRight">
                  
                  {/* Education list */}
                  <div>
                    <div className="border-b border-slate-800 pb-3 flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                        <GraduationCap size={18} />
                        Academic Education
                      </h2>
                      <button
                        onClick={addEducation}
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                      >
                        <Plus size={14} /> Add School
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[190px] overflow-y-auto pr-1">
                      {educations.map((edu, idx) => (
                        <div key={idx} className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-lg relative space-y-3 hover:border-slate-700 transition">
                          {educations.length > 1 && (
                            <button
                              onClick={() => removeEducation(idx)}
                              className="absolute top-2 right-2 text-slate-600 hover:text-rose-400 transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="College / University Name"
                              value={edu.school}
                              onChange={(e) => handleEducationChange(idx, 'school', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                            <input
                              type="text"
                              placeholder="Degree (e.g. B.Tech)"
                              value={edu.degree}
                              onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="md:col-span-2">
                              <input
                                type="text"
                                placeholder="Branch / Specialization (e.g. Computer Science)"
                                value={edu.branch}
                                onChange={(e) => handleEducationChange(idx, 'branch', e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="GPA / % (e.g. CGPA: 9.2)"
                              value={edu.cgpa_or_percentage}
                              onChange={(e) => handleEducationChange(idx, 'cgpa_or_percentage', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                            <div className="grid grid-cols-2 gap-1">
                              <input
                                type="text"
                                placeholder="Start"
                                value={edu.start_year}
                                onChange={(e) => handleEducationChange(idx, 'start_year', e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded px-1.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 text-center"
                              />
                              <input
                                type="text"
                                placeholder="End"
                                value={edu.end_year}
                                onChange={(e) => handleEducationChange(idx, 'end_year', e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded px-1.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 text-center"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills category inputs */}
                  <div>
                    <h2 className="text-sm font-bold text-indigo-300 border-b border-slate-800 pb-2 mb-3">Technical Skills by Category</h2>
                    <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                      {['languages', 'frameworks', 'databases', 'tools', 'cloud', 'soft_skills'].map((cat) => (
                        <div key={cat} className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            {cat === 'languages' ? 'Programming Languages' : cat === 'frameworks' ? 'Frameworks / Frontend' : cat === 'soft_skills' ? 'Core Concepts / Soft Skills' : cat}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder={`Add tags...`}
                              value={skillInputs[cat]}
                              onChange={(e) => setSkillInputs({ ...skillInputs, [cat]: e.target.value })}
                              onKeyDown={(e) => handleAddSkillTag(cat, e)}
                              className="flex-1 bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                            <button
                              onClick={(e) => handleAddSkillTag(cat, e)}
                              className="bg-indigo-600 hover:bg-indigo-500 px-3 rounded-lg text-xs font-bold transition hover:scale-105 active:scale-95"
                            >
                              Add
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 bg-slate-950/30 p-1.5 rounded-lg border border-slate-800/80 min-h-[30px]">
                            {skills[cat]?.length === 0 ? (
                              <span className="text-[10px] text-slate-700 p-0.5">None added</span>
                            ) : (
                              skills[cat]?.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-medium animate-fadeIn"
                                >
                                  {tag}
                                  <button
                                    onClick={() => handleRemoveSkillTag(cat, tag)}
                                    className="text-indigo-400 hover:text-indigo-200 transition"
                                  >
                                    &times;
                                  </button>
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: WORK EXPERIENCE & PROJECTS */}
              {step === 3 && (
                <div className="space-y-4 animate-slideRight">
                  
                  {/* Experience list */}
                  <div>
                    <div className="border-b border-slate-800 pb-3 flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                        <Briefcase size={18} />
                        Experience / Internships
                      </h2>
                      <button
                        onClick={addExperience}
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                      >
                        <Plus size={14} /> Add Role
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[190px] overflow-y-auto pr-1">
                      {experiences.map((exp, idx) => (
                        <div key={idx} className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-lg relative space-y-3 hover:border-slate-700 transition">
                          {experiences.length > 1 && (
                            <button
                              onClick={() => removeExperience(idx)}
                              className="absolute top-2 right-2 text-slate-600 hover:text-rose-400 transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                            <input
                              type="text"
                              placeholder="Role / Title"
                              value={exp.role}
                              onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                            <input
                              type="text"
                              placeholder="Duration (e.g. Feb 2026 - Present)"
                              value={exp.duration}
                              onChange={(e) => handleExperienceChange(idx, 'duration', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <textarea
                              rows={2}
                              placeholder="Core Responsibilities (Bullet points)"
                              value={exp.responsibilities}
                              onChange={(e) => handleExperienceChange(idx, 'responsibilities', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                            />
                          </div>
                          <div>
                            <textarea
                              rows={1}
                              placeholder="Achievements (Optional)"
                              value={exp.achievements}
                              onChange={(e) => handleExperienceChange(idx, 'achievements', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects list */}
                  <div>
                    <div className="border-b border-slate-800 pb-3 flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                        <FileCode size={18} />
                        Projects
                      </h2>
                      <button
                        onClick={addProject}
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                      >
                        <Plus size={14} /> Add Project
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[190px] overflow-y-auto pr-1">
                      {projects.map((proj, idx) => (
                        <div key={idx} className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-lg relative space-y-3 hover:border-slate-700 transition">
                          {projects.length > 1 && (
                            <button
                              onClick={() => removeProject(idx)}
                              className="absolute top-2 right-2 text-slate-600 hover:text-rose-400 transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Project Name"
                              value={proj.title}
                              onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                            <input
                              type="text"
                              placeholder="Technologies Used"
                              value={proj.tech_stack}
                              onChange={(e) => handleProjectChange(idx, 'tech_stack', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="GitHub Link (e.g. github.com/username/project)"
                              value={proj.github_link}
                              onChange={(e) => handleProjectChange(idx, 'github_link', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                            <input
                              type="text"
                              placeholder="Live Demo Link (e.g. project.vercel.app)"
                              value={proj.live_demo}
                              onChange={(e) => handleProjectChange(idx, 'live_demo', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Short Description"
                              value={proj.description}
                              onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <textarea
                              rows={2}
                              placeholder="Key Features & Accomplishments"
                              value={proj.key_features}
                              onChange={(e) => handleProjectChange(idx, 'key_features', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 4: CERTIFICATIONS & CODING PROFILES */}
              {step === 4 && (
                <div className="space-y-4 animate-slideRight">
                  
                  {/* Certifications list */}
                  <div>
                    <div className="border-b border-slate-800 pb-3 flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                        <Award size={18} />
                        Professional Certifications
                      </h2>
                      <button
                        onClick={addCertification}
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                      >
                        <Plus size={14} /> Add Cert
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[160px] overflow-y-auto pr-1">
                      {certifications.map((cert, idx) => (
                        <div key={idx} className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-lg relative space-y-2 hover:border-slate-700 transition">
                          {certifications.length > 1 && (
                            <button
                              onClick={() => removeCertification(idx)}
                              className="absolute top-1 right-1 text-slate-600 hover:text-rose-400 transition"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Certification Name"
                              value={cert.name}
                              onChange={(e) => handleCertificationChange(idx, 'name', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                            <input
                              type="text"
                              placeholder="Issuing Organization"
                              value={cert.organization}
                              onChange={(e) => handleCertificationChange(idx, 'organization', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Credential Link"
                              value={cert.credential_link}
                              onChange={(e) => handleCertificationChange(idx, 'credential_link', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 md:col-span-2"
                            />
                            <input
                              type="text"
                              placeholder="Date"
                              value={cert.completion_date}
                              onChange={(e) => handleCertificationChange(idx, 'completion_date', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 text-center"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Sparkles size={14} className="text-amber-500 animate-pulse" />
                      Key Achievements
                    </h2>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Hackathon Winner, Codeforces Rank, etc. (Enter to add)"
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        onKeyDown={addAchievement}
                        className="flex-1 bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={addAchievement}
                        className="bg-indigo-600 hover:bg-indigo-500 px-4 rounded-lg text-xs font-bold transition hover:scale-105"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 bg-slate-950/30 p-1.5 rounded-lg border border-slate-800/80 max-h-[80px] overflow-y-auto">
                      {achievements.length === 0 ? (
                        <span className="text-[10px] text-slate-700 p-0.5">No achievements added</span>
                      ) : (
                        achievements.map((ach) => (
                          <span
                            key={ach}
                            className="inline-flex items-center gap-1.5 bg-slate-850 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded text-[10px] font-medium animate-fadeIn"
                          >
                            {ach}
                            <button
                              onClick={() => removeAchievement(ach)}
                              className="text-slate-400 hover:text-slate-200 transition"
                            >
                              &times;
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Coding Profiles */}
                  <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Code size={14} className="text-indigo-400" />
                      Coding Profiles Handles (Usernames)
                    </h2>
                    <div className="grid grid-cols-2 gap-3 bg-slate-950/20 p-3 rounded-lg border border-slate-800">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">LeetCode</label>
                        <input
                          type="text"
                          placeholder="Username"
                          value={codingProfiles.leetcode}
                          onChange={(e) => setCodingProfiles({ ...codingProfiles, leetcode: e.target.value })}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">HackerRank</label>
                        <input
                          type="text"
                          placeholder="Username"
                          value={codingProfiles.hackerrank}
                          onChange={(e) => setCodingProfiles({ ...codingProfiles, hackerrank: e.target.value })}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">CodeChef</label>
                        <input
                          type="text"
                          placeholder="Username"
                          value={codingProfiles.codechef}
                          onChange={(e) => setCodingProfiles({ ...codingProfiles, codechef: e.target.value })}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">GeeksforGeeks</label>
                        <input
                          type="text"
                          placeholder="Username"
                          value={codingProfiles.geeksforgeeks}
                          onChange={(e) => setCodingProfiles({ ...codingProfiles, geeksforgeeks: e.target.value })}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Bottom Form Navigation controls */}
            <div className="border-t border-slate-800 pt-6 mt-6 flex justify-between items-center gap-4">
              <button
                onClick={handlePrevStep}
                disabled={step === 1}
                className="flex items-center gap-1 px-4 py-2 text-xs font-bold border border-slate-800 hover:border-slate-700 hover:bg-slate-900 rounded-lg text-slate-400 disabled:opacity-40 disabled:pointer-events-none transition"
              >
                <ChevronLeft size={14} /> Back
              </button>
              
              {step < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-1 px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition ml-auto hover:scale-105 active:scale-95"
                >
                  Next <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 md:flex-initial ml-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 disabled:opacity-60 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)] transition hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Optimizing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Generate & Optimize</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right Side: Live Preview Sheet (Visible when in 'preview' or 'split' view) */}
        <div className={`${viewMode === 'form' ? 'hidden' : viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} flex flex-col gap-4 w-full`}>
          
          {/* Template selector controls */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-md hover-card-3d">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Design Style:</span>
            <div className="flex gap-2 w-full md:w-auto">
              {['tech', 'classic', 'executive'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                    template === t 
                      ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {t === 'tech' ? 'Modern Tech' : t === 'classic' ? 'Minimal Classic' : 'Executive Pro'}
                </button>
              ))}
            </div>
          </div>

          {/* Styled Resume Sheet Container */}
          <div className="overflow-x-auto w-full rounded-lg bg-slate-950 border border-slate-800 p-2 shadow-2xl hover-card-3d">
            <div className="min-w-[700px] overflow-hidden">
              <div 
                id="resume-preview-sheet" 
                className={getTemplatePreviewClasses()}
              >
                {/* Header Contact Info */}
                <div className="text-slate-900 mb-6">
                  {template === 'classic' && (
                    <div className="text-center">
                      <h1 className="text-2.5xl font-bold uppercase tracking-wide leading-none">{profile.name || 'Your Name'}</h1>
                      <div className="contact-info text-xs mt-2.5 text-slate-600 flex justify-center items-center flex-wrap">
                        {renderHeaderLinks('text-blue-700')}
                      </div>
                    </div>
                  )}

                  {template === 'tech' && (
                    <div>
                      <h1 className="text-2.5xl font-extrabold text-slate-900 tracking-tight leading-none">{profile.name || 'Your Name'}</h1>
                      <p className="text-indigo-600 font-semibold text-xs uppercase tracking-wider mt-1">{profile.title || 'Target Title'}</p>
                      <div className="contact-info text-xs mt-3 text-slate-500 flex flex-wrap items-center gap-y-1.5 border-b border-slate-100 pb-3">
                        {renderHeaderLinks('text-indigo-600')}
                      </div>
                    </div>
                  )}

                  {template === 'executive' && (
                    <div className="text-center">
                      <h1 className="text-2.5xl font-semibold leading-none">{profile.name || 'Your Name'}</h1>
                      <div className="contact-info text-xs mt-2.5 text-slate-600 italic font-serif pb-2 flex justify-center items-center flex-wrap border-b border-double border-slate-300">
                        {renderHeaderLinks('text-blue-800')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Render parsed markdown text */}
                <div 
                  className="resume-markdown-output"
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdownToHTML(optimizedResume || generateLocalDraft())
                  }}
                />
              </div>
            </div>
          </div>
          
        </div>

      </div>

      {/* Styled Resume Styles injected for Preview Sheet */}
      <style>{`
        /* 3D Card Hover transformations */
        .hover-card-3d {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .hover-card-3d:hover {
          transform: translateY(-4px) scale(1.008);
          box-shadow: 0 20px 40px -15px rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.3);
        }

        /* Animation frames */
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideRight {
          animation: slideRight 0.3s ease-out forwards;
        }

        /* Classic Serif Styling */
        .font-serif {
          font-family: 'Times New Roman', Times, Georgia, serif;
        }
        .font-serif h2 {
          font-size: 13px;
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: 1.5px solid #222;
          padding-bottom: 2px;
          margin-top: 18px;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
          text-align: left;
        }
        .font-serif h3 {
          font-size: 11px;
          font-weight: bold;
          margin-top: 10px;
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;
          text-align: left;
        }
        .font-serif h3 span.date {
          font-weight: normal;
        }
        .font-serif p, .font-serif li {
          font-size: 10.5px;
          line-height: 1.4;
          margin-bottom: 4px;
          color: #222;
          text-align: left;
        }
        .font-serif ul {
          padding-left: 15px;
          list-style-type: square;
          margin-top: 3px;
          margin-bottom: 8px;
          text-align: left;
        }
        
        /* Modern Tech Styling */
        .font-sans {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
        }
        .font-sans h2 {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #4f46e5;
          border-bottom: 2px solid #f3f4f6;
          padding-bottom: 3px;
          margin-top: 18px;
          margin-bottom: 8px;
          letter-spacing: 1px;
          text-align: left;
        }
        .font-sans h3 {
          font-size: 11px;
          font-weight: 700;
          color: #111827;
          margin-top: 10px;
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;
          text-align: left;
        }
        .font-sans h3 span.date {
          font-weight: 500;
          color: #6b7280;
          font-size: 9.5px;
        }
        .font-sans p, .font-sans li {
          font-size: 10px;
          line-height: 1.5;
          margin-bottom: 4px;
          color: #374151;
          text-align: left;
        }
        .font-sans ul {
          padding-left: 12px;
          list-style-type: circle;
          margin-top: 3px;
          margin-bottom: 8px;
          text-align: left;
        }
        
        /* Executive Styling details */
        .italic-headings h2 {
          font-size: 12px;
          text-align: center;
          border-bottom: 1px solid #111827;
          padding-bottom: 2px;
          margin-top: 18px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .italic-headings h3 {
          font-size: 11px;
          font-weight: bold;
          margin-top: 10px;
          margin-bottom: 3px;
          display: flex;
          justify-content: space-between;
          text-align: left;
        }
        .italic-headings h3 span.date {
          font-style: italic;
          font-weight: normal;
        }
        .italic-headings p, .italic-headings li {
          font-size: 10px;
          line-height: 1.4;
          margin-bottom: 4px;
          color: #222;
          text-align: left;
        }
        .italic-headings ul {
          padding-left: 15px;
          margin-top: 3px;
          margin-bottom: 8px;
          text-align: left;
        }

        /* Shared Preview Overrides */
        #resume-preview-sheet strong {
          color: #111827 !important;
          font-weight: 600;
        }
        
        /* Link styling inside the markdown text */
        .preview-md-link {
          color: #4f46e5 !important;
          text-decoration: underline !important;
        }
        .font-serif .preview-md-link {
          color: #1e3a8a !important;
        }
        .italic-headings .preview-md-link {
          color: #1e40af !important;
        }
      `}</style>

    </div>
  );
};

export default AIResumeCreator;
