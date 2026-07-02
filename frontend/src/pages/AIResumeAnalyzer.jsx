import React, { useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FileText, Upload, AlertCircle, CheckCircle, 
  HelpCircle, Target, Sparkles, Plus, Check, Info,
  AlignLeft, ArrowRight, BookOpen, AlertTriangle, Terminal,
  RefreshCw, Award, Activity, Heart, Briefcase, FileCode,
  Download, Eye, User, Mail, Phone, X
} from 'lucide-react';

const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
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
    width="14"
    height="14"
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

const AIResumeAnalyzer = () => {
  const [inputMethod, setInputMethod] = useState('upload'); // 'upload' or 'text'
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [activeReportTab, setActiveReportTab] = useState('summary'); // 'summary', 'keywords', 'bullets', 'reviews'

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.pdf')) {
        setError('Only PDF resume files are supported.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');
    setAnalysis(null);

    if (inputMethod === 'upload' && !file) {
      setError('Please select a PDF resume file to upload.');
      return;
    }
    if (inputMethod === 'text' && !resumeText.trim()) {
      setError('Please paste your resume text in the area provided.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    if (inputMethod === 'upload') {
      formData.append('file', file);
    } else {
      formData.append('resume_text', resumeText);
    }
    formData.append('target_role', targetRole);
    formData.append('job_description', jobDescription);

    try {
      const res = await api.post('/api/ai/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setAnalysis(res.data);
      setActiveReportTab('summary');
    } catch (err) {
      console.error("Failed to analyze resume: ", err);
      setError(err.response?.data?.detail || "An error occurred during resume analysis. Please ensure inputs are correct.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'stroke-emerald-400 text-emerald-600 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 60) return 'stroke-amber-400 text-amber-600 border-amber-500/20 bg-amber-500/5';
    return 'stroke-rose-400 text-rose-600 border-rose-500/20 bg-rose-500/5';
  };

  const handleDownloadReport = () => {
    if (!analysis) return;
    const hasJD = analysis.has_jd;
    
    const reportText = `=========================================
PREPBOAT AI RESUME ANALYZER PRO REPORT
=========================================
Target Role: ${targetRole}
Candidate Name: ${analysis.name}
Email: ${analysis.email}
Phone: ${analysis.phone}
LinkedIn: ${analysis.linkedin}
GitHub: ${analysis.github}

-----------------------------------------
SCORES SUMMARY
-----------------------------------------
Overall Resume Score: ${analysis.overall_score}/100
ATS Compatibility Score: ${analysis.ats_score}/100
${hasJD ? `JD Compatibility Match: ${analysis.match_score}/100` : `Role Suitability Match: ${analysis.match_score}/100`}
Projects Score: ${analysis.project_score}/100
Experience Score: ${analysis.experience_score}/100
Skills Score: ${analysis.skills_score}/100
Interview Readiness: ${analysis.interview_readiness?.score}% (${analysis.interview_readiness?.level})

-----------------------------------------
RECRUITER FEEDBACK
-----------------------------------------
Decision: ${analysis.recruiter_feedback?.decision}
Reasoning: ${analysis.recruiter_feedback?.reasoning}

Summary: ${analysis.summary}

-----------------------------------------
STRENGTHS
-----------------------------------------
${analysis.strengths?.map(s => `- ${s}`).join('\n')}

-----------------------------------------
WEAKNESSES
-----------------------------------------
${analysis.weaknesses?.map(w => `- ${w}`).join('\n')}

-----------------------------------------
${hasJD ? 'MISSING KEYWORDS FROM JD' : 'MISSING KEYWORDS FOR ROLE'}
-----------------------------------------
${analysis.missing_keywords?.join(', ') || 'None'}

-----------------------------------------
SKILL GAPS ANALYSIS
-----------------------------------------
Current Skills: ${analysis.skill_gaps?.current_skills?.join(', ') || 'None'}
${hasJD ? 'Required Skills (JD)' : 'Required Skills (Role)'}: ${analysis.skill_gaps?.required_skills?.join(', ') || 'None'}
Gap Skills: ${analysis.skill_gaps?.gap_skills?.join(', ') || 'None'}

-----------------------------------------
ATS & FORMATTING CONSTRAINTS
-----------------------------------------
ATS Issues:
${analysis.ats_issues?.map(i => `- ${i}`).join('\n') || '- None'}

Formatting Issues:
${analysis.formatting_issues?.map(f => `- ${f}`).join('\n') || '- None'}

Grammar Issues:
${analysis.grammar_issues?.map(g => `- ${g.issue} -> Suggestion: ${g.correction}`).join('\n') || '- None'}

Missing Sections:
${analysis.missing_sections?.join(', ') || 'None'}

-----------------------------------------
ATS SCANNER COMPLIANCE GUIDE
-----------------------------------------
Things to Add:
${analysis.ats_optimization_guide?.things_to_add?.map(i => `- ${i}`).join('\n') || '- None'}

Things to Remove:
${analysis.ats_optimization_guide?.things_to_remove?.map(i => `- ${i}`).join('\n') || '- None'}

Restructuring Tips:
${analysis.ats_optimization_guide?.restructure_tips?.map((t, idx) => `${idx+1}. ${t}`).join('\n') || '- None'}

-----------------------------------------
SUGGESTED BULLET POINT REWRITES
-----------------------------------------
${analysis.improved_bullet_points?.map((bp, idx) => `Case ${idx+1}:
  Original: "${bp.original}"
  Suggested: "${bp.suggested}"`).join('\n\n')}

-----------------------------------------
FINAL RECOMMENDATIONS
-----------------------------------------
${analysis.final_recommendations?.map(r => `- ${r}`).join('\n')}
`;
    const element = document.createElement("a");
    const fileBlob = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = `PrepBoat_Resume_Report_${analysis.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const hasMatchScore = analysis && analysis.match_score !== null && analysis.match_score !== undefined;
  const hasJD = analysis && analysis.has_jd;

  return (
    <div className="space-y-4 animate-fadeIn w-full pb-12 page-mount-transition">
      
      {/* Visual AI Resume Banner Header */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-lg p-4 md:p-4 overflow-hidden shadow-2xl border border-indigo-500/10 animate-fadeIn">
        
        {/* Floating tech nodes and connections - Styled SVG / CSS */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-25 md:opacity-90 pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="blur-shadow-resume" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>

            <style>{`
              @keyframes float-resume {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-6px); }
                100% { transform: translateY(0px); }
              }
              @keyframes float-resume-delayed {
                0% { transform: translateY(0px); }
                50% { transform: translateY(6px); }
                100% { transform: translateY(0px); }
              }
              @keyframes scan {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(80px); }
              }
              .floating-node-resume {
                animation: float-resume 5s ease-in-out infinite;
              }
              .floating-node-resume-delayed {
                animation: float-resume-delayed 5s ease-in-out infinite;
              }
              .scanner-bar {
                animation: scan 4s ease-in-out infinite;
              }
            `}</style>

            {/* Connections */}
            <path d="M 200,150 Q 80,100 70,85" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 200,150 Q 100,160 65,150" stroke="#c084fc" strokeWidth="1.5" opacity="0.6" />
            <path d="M 200,150 Q 100,220 75,230" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 200,150 Q 300,80 310,60" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
            <path d="M 200,150 Q 300,140 330,130" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 200,150 Q 300,190 320,200" stroke="#f97316" strokeWidth="1.5" opacity="0.6" />

            {/* Central Resume Board */}
            <g transform="translate(140, 75)">
              {/* Clipboard base */}
              <rect x="5" y="5" width="110" height="140" rx="6" fill="#000000" opacity="0.4" filter="url(#blur-shadow-resume)" />
              <rect x="0" y="0" width="110" height="140" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              {/* Paper */}
              <rect x="10" y="20" width="90" height="110" rx="3" fill="#f8fafc" />
              
              {/* Paper Text Lines */}
              <rect x="20" y="32" width="40" height="5" rx="1.5" fill="#cbd5e1" />
              <rect x="20" y="44" width="70" height="3" rx="1" fill="#e2e8f0" />
              <rect x="20" y="52" width="60" height="3" rx="1" fill="#e2e8f0" />
              <rect x="20" y="60" width="65" height="3" rx="1" fill="#e2e8f0" />
              
              <rect x="20" y="74" width="30" height="5" rx="1.5" fill="#cbd5e1" />
              <rect x="20" y="86" width="70" height="3" rx="1" fill="#e2e8f0" />
              <rect x="20" y="94" width="55" height="3" rx="1" fill="#e2e8f0" />
              <rect x="20" y="102" width="60" height="3" rx="1" fill="#e2e8f0" />
              
              {/* Clipboard header clamp */}
              <rect x="35" y="-5" width="40" height="12" rx="3" fill="#475569" />
              <circle cx="55" cy="1" r="2.5" fill="#1e293b" />
              
              {/* Scanning Laser bar */}
              <g className="scanner-bar" transform="translate(0, 30)">
                <line x1="5" y1="0" x2="105" y2="0" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
                <polygon points="5,0 15,-4 15,4" fill="#ef4444" />
                <polygon points="105,0 95,-4 95,4" fill="#ef4444" />
                <rect x="8" y="-1" width="94" height="2" fill="#ef4444" opacity="0.3" />
              </g>
            </g>

            {/* Floating CSE Nodes */}
            {/* PDF Doc Node */}
            <g className="floating-node-resume" transform="translate(42, 60)">
              <rect x="0" y="0" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <path d="M12 10h12v16H12z" fill="#ef4444" opacity="0.2" />
              <path d="M14 8h6l4 4v10a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" stroke="#ef4444" strokeWidth="1.2" fill="none" />
              <path d="M16 12h4" stroke="#ef4444" strokeWidth="1.2" />
              <path d="M16 16h4" stroke="#ef4444" strokeWidth="1.2" />
            </g>

            {/* Python Node */}
            <g className="floating-node-resume-delayed" transform="translate(35, 130)">
              <rect x="0" y="0" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <path d="M18 10c-2 0-3.5 1.5-3.5 3.5v2.5h4v1h-5.5c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5h2v-2.5c0-1.5 1.2-2.5 2.5-2.5h6v-3.5c0-2-1.5-3.5-3.5-3.5h-2zm-1 2a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z" fill="#38bdf8" />
              <path d="M22 26c2 0 3.5-1.5 3.5-3.5v-2.5h-4v-1h5.5c2 0 3.5-1.5 3.5-3.5s-1.5-3.5-3.5-3.5h-2v2.5c0 1.5-1.2 2.5-2.5 2.5h-6v3.5c0 2 1.5 3.5 3.5 3.5h2zm1-2a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z" fill="#facc15" />
            </g>

            {/* database Node */}
            <g className="floating-node-resume" transform="translate(50, 205)">
              <rect x="0" y="0" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <ellipse cx="18" cy="14" rx="8" ry="2.5" stroke="#c084fc" strokeWidth="1.2" fill="none" />
              <path d="M10 14v6c0 1.5 3.5 2.5 8 2.5s8-1 8-2.5v-6" stroke="#c084fc" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M10 20v4c0 1.5 3.5 2.5 8 2.5s8-1 8-2.5v-4" stroke="#c084fc" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </g>

            {/* Sparkles Node */}
            <g className="floating-node-resume-delayed" transform="translate(290, 42)">
              <rect x="0" y="0" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <path d="M18 10l1.5 4.5l4.5 1.5l-4.5 1.5l-1.5 4.5l-1.5-4.5l-4.5-1.5l4.5-1.5z" fill="#facc15" />
              <path d="M25 22l1 2.5l2.5 1l-2.5 1l-1 2.5l-1-2.5l-2.5-1l2.5-1z" fill="#a78bfa" />
            </g>

            {/* Checkmark Node */}
            <g className="floating-node-resume" transform="translate(312, 112)">
              <rect x="0" y="0" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <circle cx="18" cy="18" r="8" fill="#10b981" opacity="0.2" />
              <circle cx="18" cy="18" r="8" stroke="#10b981" strokeWidth="1.2" fill="none" />
              <path d="M14 18l3 3l5 -5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>

            {/* React JS Node */}
            <g className="floating-node-resume-delayed" transform="translate(302, 182)">
              <rect x="0" y="0" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <ellipse cx="18" cy="18" rx="8" ry="3" stroke="#22d3ee" strokeWidth="1.2" fill="none" transform="rotate(30 18 18)" />
              <ellipse cx="18" cy="18" rx="8" ry="3" stroke="#22d3ee" strokeWidth="1.2" fill="none" transform="rotate(90 18 18)" />
              <ellipse cx="18" cy="18" rx="8" ry="3" stroke="#22d3ee" strokeWidth="1.2" fill="none" transform="rotate(150 18 18)" />
              <circle cx="18" cy="18" r="1.5" fill="#22d3ee" />
            </g>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/25 text-indigo-400 text-xs font-semibold">
            <Sparkles size={12} fill="currentColor" />
            <span>AI Resume Optimization</span>
          </div>
          <h1 className="text-lg md:text-lg font-extrabold text-white tracking-tight leading-tight">
            AI Resume Analyzer Pro
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-md">
            Audit your resume formatting, keywords density, and score metrics. Secure professional recruiter screening callbacks using active action-verbs and metric-driven suggestions.
          </p>
        </div>
      </div>
      
      {/* Upload/Pasted Text & Job Details Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left column: Resume & JD Inputs */}
        <div className="glass-panel p-4 rounded-lg border border-slate-200 lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Upload & Target Details</h3>
              <p className="text-xs text-slate-600">Provide your PDF resume or plain text along with target designation to compute ATS fit scores.</p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-500/20 rounded-lg text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAnalyze} className="space-y-4 text-xs">
              
              {/* Input Method Switcher */}
              <div className="flex border-b border-slate-200/40 pb-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setInputMethod('upload'); setError(''); }}
                  className={`pb-1 border-b-2 font-semibold transition-all ${
                    inputMethod === 'upload' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Upload PDF File
                </button>
                <button
                  type="button"
                  onClick={() => { setInputMethod('text'); setError(''); }}
                  className={`pb-1 border-b-2 font-semibold transition-all ${
                    inputMethod === 'text' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Paste Resume Text
                </button>
              </div>

              {/* Upload or Text paste content */}
              {inputMethod === 'upload' ? (
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-600/50 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer relative bg-slate-100/20 transition-all">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 mb-2">
                    <Upload size={20} />
                  </div>
                  {file ? (
                    <div className="text-center">
                      <p className="text-xs font-semibold text-slate-800">{file.name}</p>
                      <p className="text-[10px] text-slate-600">{(file.size / 1024).toFixed(1)} KB &bull; PDF format ready</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs font-semibold text-slate-700">Select PDF Resume File</p>
                      <p className="text-[10px] text-slate-500">Only text-readable PDF documents are supported (Max 10MB)</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Resume Plain Text</label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste the full text of your resume here..."
                    className="w-full h-44 p-3 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600 resize-none"
                  />
                </div>
              )}

              {/* Target Role input */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Target Role Designation</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Frontend Developer, Data Analyst, Software Engineer"
                  className="w-full px-3 py-2.5 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                />
              </div>

              {/* Job Description input */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Job Description (Pastes details here to verify suitability & score match)</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description or core criteria here..."
                  className="w-full h-36 p-3 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || (inputMethod === 'upload' ? !file : !resumeText.trim())}
                className="w-full py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all hover:shadow-brand disabled:opacity-50 text-xs flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Analyzing Resume Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Analyze Resume Profile</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Info checklist cards */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="glass-panel p-4 rounded-lg border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-indigo-600" />
              <span>Resume Quality Metrics</span>
            </h4>
            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brandPurple shrink-0 mt-1.5" />
                <p><strong className="text-slate-800">Overall score weights:</strong> Calculated by auditing your structure: ATS compatibility (20%), Project descriptions (20%), Work experience (25%), Skills keywords (15%), Achievements listing (10%), and Formatting margins (10%).</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brandPurple shrink-0 mt-1.5" />
                <p><strong className="text-slate-800">Weak bullet optimization:</strong> Scans passive phrases like *'worked on'* or *'helped'* and suggests action-oriented, metric-backed alternatives.</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brandPurple shrink-0 mt-1.5" />
                <p><strong className="text-slate-800">Skill Gap roadmapping:</strong> Highlights which required skills from the job description are missing, identifying gaps to help you target your study targets.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-lg border border-slate-200 space-y-4 bg-slate-100/10">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal size={14} className="text-indigo-600" />
              <span>Recruiter screening views</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our analyzer acts as the initial hiring manager filter. It audits font spacing, section titles, contact parameters, and metrics density to predict if your CV will secure a callback.
            </p>
          </div>
        </div>

      </div>

      {/* Loading overlay */}
      {loading && <LoadingSpinner message="Scanning sections, evaluating grammar rules, and computing match percentages..." />}

      {/* Upgraded Analysis Dashboard Display */}
      {analysis && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
          
          {/* Dashboard Header stats */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Analysis Report for {analysis.name || 'Candidate'}</h2>
              <p className="text-xs text-slate-600">Target Role: <span className="text-indigo-600 font-semibold">{targetRole}</span></p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200 hover:text-slate-900 hover:bg-white transition-all"
              >
                <Download size={14} />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          {/* Top Row: Dials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Overall Score Dial */}
            <div className="glass-panel p-4 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[9px] font-mono text-slate-500">WEIGHTED</div>
              <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Overall Quality</h4>
              
              {/* Circular SVG progress */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="stroke-slate-900"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`transition-all duration-1000 ${getScoreColor(analysis.overall_score)}`}
                    strokeWidth="3.5"
                    strokeDasharray={`${analysis.overall_score}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center font-mono">
                  <span className="text-lg font-bold text-slate-900">{analysis.overall_score}</span>
                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">Score</span>
                </div>
              </div>
              
              <div className="text-[10px] text-slate-600">Weighted scorecard of all audited metrics</div>
            </div>

            {/* 2. ATS Score Dial */}
            <div className="glass-panel p-4 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
              <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">ATS Compatibility</h4>
              
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="stroke-slate-900"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`transition-all duration-1000 ${getScoreColor(analysis.ats_score)}`}
                    strokeWidth="3.5"
                    strokeDasharray={`${analysis.ats_score}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center font-mono">
                  <span className="text-lg font-bold text-slate-900">{analysis.ats_score}</span>
                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">ATS</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-600">Score of layouts, headers & contact details</div>
            </div>

            {/* 3. Suitability Match Dial */}
            <div className="glass-panel p-4 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
              <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                {hasJD ? "Job Description Match" : "Role Suitability Match"}
              </h4>
              
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="stroke-slate-900"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`transition-all duration-1000 ${getScoreColor(analysis.match_score)}`}
                    strokeWidth="3.5"
                    strokeDasharray={`${analysis.match_score}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center font-mono">
                  <span className="text-lg font-bold text-slate-900">
                    {analysis.match_score}
                  </span>
                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">
                    {hasJD ? "Match" : "Suitability"}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-slate-600">
                {hasJD ? "Score of keywords density vs JD requirements" : "Score of resume alignment with target role expectations"}
              </div>
            </div>

          </div>

          {/* Subscores breakdown list */}
          <div className="glass-panel p-4 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1.5">
                <span>Projects Evaluation</span>
                <span className="font-mono">{analysis.project_score}/100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-200/40">
                <div className="h-full bg-brandPurple rounded-full" style={{ width: `${analysis.project_score}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1.5">
                <span>Experience History</span>
                <span className="font-mono">{analysis.experience_score}/100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-200/40">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${analysis.experience_score}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1.5">
                <span>Skills Coverage</span>
                <span className="font-mono">{analysis.skills_score}/100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-200/40">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analysis.skills_score}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1.5 font-mono text-[11px]">
                <span>Interview Readiness</span>
                <span className="text-amber-600 font-bold uppercase">{analysis.interview_readiness?.level} ({analysis.interview_readiness?.score}%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-200/40">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${analysis.interview_readiness?.score}%` }}></div>
              </div>
            </div>
          </div>

          {/* Dynamic Tabbed Navigation based on JD presence */}
          <div className="flex border-b border-slate-200/40 text-xs font-bold gap-4">
            <button
              onClick={() => setActiveReportTab('summary')}
              className={`pb-2.5 border-b-2 transition-all ${
                activeReportTab === 'summary' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Overview & Verdict
            </button>
            {hasMatchScore && (
              <button
                onClick={() => setActiveReportTab('keywords')}
                className={`pb-2.5 border-b-2 transition-all ${
                  activeReportTab === 'keywords' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-600 hover:text-slate-800'
                }`}
              >
                {hasJD ? "Keyword & Gaps (JD)" : "Role Keywords & Gaps"}
              </button>
            )}
            <button
              onClick={() => setActiveReportTab('bullets')}
              className={`pb-2.5 border-b-2 transition-all ${
                activeReportTab === 'bullets' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Optimizations & Audits
            </button>
          </div>

          {/* Tab 1 Content: Recruiter Verdict & Good/Bad Things */}
          {activeReportTab === 'summary' && (
            <div className="space-y-4">
              {/* 1. Good & Bad Things Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Good Things (Strengths) */}
                <div className="glass-panel p-4 rounded-lg border border-emerald-500/10 bg-emerald-500/5 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-500/10 pb-2">
                    <CheckCircle size={14} />
                    <span>Good Things (Strengths)</span>
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-2 list-none pl-0">
                    {analysis.strengths?.map((s, i) => (
                      <li key={i} className="flex gap-2 items-start leading-relaxed">
                        <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    )) || <li className="text-slate-500 italic">No strengths highlighted.</li>}
                  </ul>
                </div>

                {/* Bad Things (Weaknesses / Gaps) */}
                <div className="glass-panel p-4 rounded-lg border border-rose-500/10 bg-rose-500/5 space-y-3">
                  <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5 border-b border-rose-500/10 pb-2">
                    <AlertTriangle size={14} />
                    <span>Bad Things (Weaknesses & Gaps)</span>
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-2 list-none pl-0">
                    {analysis.weaknesses?.map((w, i) => (
                      <li key={i} className="flex gap-2 items-start leading-relaxed">
                        <Plus size={14} className="text-rose-600 rotate-45 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    )) || <li className="text-slate-500 italic">No specific weaknesses identified.</li>}
                  </ul>
                </div>
              </div>

              {/* 2. Recruiter Verdict Card */}
              <div className="glass-panel p-4 rounded-lg border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/30 pb-3 gap-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={14} className="text-indigo-600" />
                    <span>Recruiter Screening Verdict</span>
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border self-start sm:self-auto ${
                    analysis.recruiter_feedback?.decision?.toLowerCase() === 'yes' 
                      ? 'text-emerald-600 bg-emerald-50 border-emerald-500/20'
                      : analysis.recruiter_feedback?.decision?.toLowerCase() === 'maybe'
                      ? 'text-amber-600 bg-amber-50 border-amber-500/20'
                      : 'text-rose-600 bg-rose-50 border-rose-500/20'
                  }`}>
                    Decision: {analysis.recruiter_feedback?.decision || 'Maybe'}
                  </span>
                </div>

                <div className="bg-slate-100/40 p-4 rounded-lg border border-slate-200/30 text-xs text-slate-700 leading-relaxed italic">
                  "{analysis.recruiter_feedback?.reasoning}"
                </div>
              </div>

              {/* 3. Executive Summary & Recommendations */}
              <div className="glass-panel p-4 rounded-lg border border-slate-200 space-y-4">
                <div className="space-y-1 text-xs">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Executive Summary</p>
                  <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
                </div>

                {analysis.final_recommendations && analysis.final_recommendations.length > 0 && (
                  <div className="border-t border-slate-200/30 pt-4 space-y-2 text-xs">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Key Recommendations</p>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-600 leading-relaxed">
                      {analysis.final_recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* File Naming Audit */}
                {analysis.filename_audit && (
                  <div className="border-t border-slate-200/30 pt-4 space-y-3 text-xs">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <FileCode size={12} className="text-indigo-500" />
                      <span>ATS Filename Audit</span>
                    </p>
                    <div className={`p-4 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      analysis.filename_audit.is_professional 
                        ? 'bg-emerald-50/65 border-emerald-500/20 text-slate-800' 
                        : 'bg-amber-50/65 border-amber-500/20 text-slate-800'
                    }`}>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase font-mono ${
                            analysis.filename_audit.is_professional 
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                              : 'bg-amber-100 text-amber-700 border-amber-300'
                          }`}>
                            {analysis.filename_audit.is_professional ? 'Passed' : 'Action Required'}
                          </span>
                          <span className="font-bold text-[11px] text-slate-700 font-mono">"{analysis.filename_audit.filename}"</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{analysis.filename_audit.critique}</p>
                      </div>
                      {analysis.filename_audit.suggestions?.length > 0 && (
                        <div className="text-[10px] font-semibold text-indigo-700 bg-white border border-indigo-100 p-2.5 rounded-lg shrink-0 w-full md:w-auto">
                          <p className="font-bold uppercase text-[9px] text-slate-500 tracking-wider mb-1">Recruiter Tips:</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            {analysis.filename_audit.suggestions.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2 Content: Keywords (Only if hasMatchScore) */}
          {activeReportTab === 'keywords' && hasMatchScore && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="glass-panel p-4 rounded-lg border border-slate-200 lg:col-span-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200/30 pb-3">
                  {hasJD ? "Keyword density matching analysis" : "Target role keyword density & suitability"}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider flex items-center gap-1">
                      <Check size={12} strokeWidth={3} />
                      <span>Matched Keywords ({analysis.matched_keywords?.length || 0})</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {analysis.matched_keywords?.length > 0 ? (
                        analysis.matched_keywords.map(kw => (
                          <span key={kw} className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-500/20 text-[10px] font-semibold font-mono">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-[10px] italic">No keywords matched.</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-rose-600 tracking-wider flex items-center gap-1">
                      <X size={12} strokeWidth={3} />
                      <span>{hasJD ? "Missing JD Keywords" : "Missing Role Keywords"} ({analysis.missing_keywords?.length || 0})</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {analysis.missing_keywords?.length > 0 ? (
                        analysis.missing_keywords.map(kw => (
                          <span key={kw} className="px-2.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-500/20 text-[10px] font-semibold font-mono">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-[10px] italic">No missing keywords found.</span>
                      )}
                    </div>
                  </div>
                </div>

                {analysis.recommended_keywords && analysis.recommended_keywords.length > 0 && (
                  <div className="space-y-2 border-t border-slate-200/30 pt-4 text-xs">
                    <p className="text-[10px] font-bold uppercase text-amber-600 tracking-wider flex items-center gap-1">
                      <Plus size={12} strokeWidth={3} />
                      <span>Recommended Industry Terms ({analysis.recommended_keywords.length})</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {analysis.recommended_keywords.map(kw => (
                        <span key={kw} className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-500/20 text-[10px] font-semibold font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filler Words & Repetitive Action Verbs Audit */}
                <div className="border-t border-slate-200/30 pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Buzzwords and Filler Words */}
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/50 space-y-3">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle size={12} className="text-amber-500" />
                        <span>Vague Filler Words & Buzzwords ({analysis.filler_words_found?.length || 0})</span>
                      </p>
                      {analysis.filler_words_found?.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-[10px] text-slate-500 leading-relaxed">Avoid generic descriptions. Replace these words with hard data:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.filler_words_found.map(w => (
                              <span key={w} className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-300/40 text-[9px] font-bold font-mono">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-emerald-600 text-[10px] font-semibold flex items-center gap-1">
                          <Check size={12} strokeWidth={3} />
                          <span>No vague buzzwords or filler words found. Professional!</span>
                        </p>
                      )}
                    </div>

                    {/* Word Repetitions */}
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/50 space-y-3">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <RefreshCw size={12} className="text-indigo-500" />
                        <span>Repetitive Word Count</span>
                      </p>
                      {analysis.repetitive_words?.length > 0 ? (
                        <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
                          {analysis.repetitive_words.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] bg-white border border-slate-200 p-2 rounded-lg">
                              <div>
                                <span className="font-bold text-slate-700 font-mono">"{item.word}"</span>
                                <span className="text-[9px] text-slate-500 ml-1.5">(Used {item.count}x)</span>
                              </div>
                              <span className="text-[9px] text-indigo-600 font-semibold truncate max-w-[150px]" title={item.alternatives?.join(', ')}>
                                Try: {item.alternatives?.slice(0, 2).join(', ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-emerald-600 text-[10px] font-semibold flex items-center gap-1">
                          <Check size={12} strokeWidth={3} />
                          <span>Action verbs are well-diversified. Zero high repetition.</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Skill Gaps and Roadmap */}
              <div className="lg:col-span-6 space-y-4">
                {/* Bullet Metrics Density Card */}
                {analysis.metrics_density_score !== undefined && (
                  <div className="glass-panel p-4 rounded-lg border border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/30 pb-2">
                      <Award size={14} className="text-amber-500 animate-pulse" />
                      <span>Bullet point Metrics Density</span>
                    </h4>
                    <div className="flex items-center gap-4 text-xs">
                      {/* Circle progress bar */}
                      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="stroke-slate-100" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="stroke-indigo-500 transition-all duration-1000" strokeWidth="4" strokeDasharray={`${analysis.metrics_density_score}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span className="absolute font-mono font-bold text-slate-800 text-[11px]">{analysis.metrics_density_score}%</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-700 block">Metrics & Data Density Score</span>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          {analysis.metrics_density_score >= 60 
                            ? "Excellent! A significant portion of your bullet points contain quantifiable numbers, percentages, or budgets."
                            : "Your descriptions are too general. Recruiters and ATS scanners prefer results quantified with hard numbers (e.g. %, $, clients, users)."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Alert Box */}
                {analysis.skill_gaps?.summary && (
                  <div className="glass-panel p-4 rounded-lg border border-indigo-500/10 bg-indigo-500/5 space-y-2 text-xs">
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={12} />
                      <span>Skill Gap Executive Summary</span>
                    </p>
                    <p className="text-slate-700 leading-relaxed italic">
                      "{analysis.skill_gaps.summary}"
                    </p>
                  </div>
                )}

                {/* Step-by-Step Learning Path */}
                {analysis.skill_gaps?.learning_path?.length > 0 && (
                  <div className="glass-panel p-4 rounded-lg border border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/30 pb-2">
                      <BookOpen size={14} className="text-indigo-600" />
                      <span>Skill Acquisition Roadmap</span>
                    </h4>

                    <div className="space-y-3.5">
                      {analysis.skill_gaps.learning_path.map((pathItem, idx) => {
                        const diff = pathItem.difficulty?.toLowerCase();
                        const badgeColor = 
                          diff === 'high' ? 'bg-rose-50 text-rose-600 border-rose-500/20' :
                          diff === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-500/20' :
                          'bg-emerald-50 text-emerald-600 border-emerald-500/20';

                        return (
                          <div key={idx} className="p-3.5 rounded-lg bg-slate-100/50 border border-slate-200/30 space-y-1.5 relative">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-800 font-mono text-[11px]">{idx + 1}. {pathItem.skill}</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${badgeColor}`}>
                                {pathItem.difficulty || 'Medium'} Focus
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                              {pathItem.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Current vs Required Skills Tags */}
                <div className="glass-panel p-4 rounded-lg border border-slate-200 space-y-4 text-[11px]">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={14} className="text-indigo-600" />
                    <span>Skills Profile Inventory</span>
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Current Profile</p>
                      <div className="flex flex-wrap gap-1">
                        {analysis.skill_gaps?.current_skills?.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200/40 font-mono text-[9px]">
                            {s}
                          </span>
                        )) || <span className="text-slate-500 italic">None found</span>}
                      </div>
                    </div>

                    <div className="border-t border-slate-200/20 pt-2.5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {hasJD ? "Target Job Requirements" : "Target Role Requirements"}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {analysis.skill_gaps?.required_skills?.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded bg-indigo-500/5 text-indigo-600 border border-indigo-500/15 font-mono text-[9px]">
                            {s}
                          </span>
                        )) || <span className="text-slate-500 italic">None required</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3 Content: Optimizations, Grammar, Formatting, and Structure */}
          {activeReportTab === 'bullets' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Bullet Points Sandbox */}
              <div className="glass-panel p-4 rounded-lg border border-slate-200 lg:col-span-8 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/30 pb-3">
                  <Sparkles size={14} className="text-amber-600" />
                  <span>{hasJD ? "Resume Tailoring Bullet Point Sandbox" : "Target Role Bullet Point Optimization"}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Improve your resume bullets using strong action verbs, technical terms, and measurable achievements:
                </p>

                <div className="space-y-4">
                  {analysis.improved_bullet_points?.map((bp, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-slate-50/80 border border-slate-200/40 space-y-2.5">
                      <div className="flex justify-between items-center text-[9px] uppercase font-bold text-slate-500 font-mono">
                        <span>Case {idx + 1} &bull; {bp.section || 'Experience'}</span>
                        <span className="text-indigo-600 flex items-center gap-1"><ArrowRight size={10} /> Recruiter Suggested Rewrite</span>
                      </div>
                      <div className="text-xs text-slate-500 line-through pl-2.5 border-l-2 border-rose-500/40 italic">
                        "{bp.original}"
                      </div>
                      <div className="text-xs text-slate-850 font-semibold pl-2.5 border-l-2 border-emerald-500 bg-emerald-500/5 py-1.5 rounded-r-md leading-relaxed">
                        "{bp.suggested}"
                      </div>
                      {bp.explanation && (
                        <div className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg leading-relaxed flex items-start gap-1.5">
                          <Info size={13} className="shrink-0 mt-0.5" />
                          <span><strong>Optimization Rationale:</strong> {bp.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Audits and Metadata */}
              <div className="lg:col-span-4 space-y-4 text-xs">
                {/* 1. Grammar Audit */}
                <div className="glass-panel p-4 rounded-lg border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <AlignLeft size={14} className="text-indigo-600" />
                    <span>Grammar & Spelling Audit</span>
                  </h4>
                  {analysis.grammar_issues?.length > 0 ? (
                    <div className="space-y-3">
                      {analysis.grammar_issues.map((g, i) => (
                        <div key={i} className="p-2.5 rounded bg-white border border-slate-200/40 space-y-1">
                          <p className="text-rose-600 font-semibold font-mono text-[11px]">{g.issue}</p>
                          <p className="text-emerald-600">Suggestion: "{g.correction}"</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic flex items-center gap-1">
                      <Check size={14} className="text-emerald-600" />
                      <span>Zero syntax/grammar issues detected. Clean!</span>
                    </p>
                  )}
                </div>

                {/* 2. Formatting constraints */}
                <div className="glass-panel p-4 rounded-lg border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={14} className="text-indigo-600" />
                    <span>Page Formatting constraints</span>
                  </h4>
                  {analysis.formatting_issues?.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
                      {analysis.formatting_issues.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic flex items-center gap-1">
                      <Check size={14} className="text-emerald-600" />
                      <span>Margins, spacing, alignment, and fonts are consistent.</span>
                    </p>
                  )}
                </div>

                {/* 3. Structure Audit Checklist */}
                <div className="glass-panel p-4 rounded-lg border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-indigo-600" />
                    <span>Structure Audit Checklist</span>
                  </h4>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between items-center">
                      <span>Missing Sections:</span>
                      <span className="font-bold text-rose-600 uppercase font-mono">{analysis.missing_sections?.length || 0}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {analysis.missing_sections?.length > 0 ? (
                        analysis.missing_sections.map(sec => (
                          <span key={sec} className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-500/25 text-[9px] font-semibold">
                            {sec}
                          </span>
                        ))
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1 text-[10px] font-semibold font-mono">
                          <Check size={12} strokeWidth={3} />
                          <span>All core sections found!</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Extracted Metadata */}
                <div className="glass-panel p-4 rounded-lg border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={14} className="text-indigo-600" />
                    <span>Extracted Metadata</span>
                  </h4>
                  
                  <div className="space-y-3 font-medium">
                    <div className="flex gap-2 items-center">
                      <User size={14} className="text-slate-500 shrink-0" />
                      <span className="text-slate-700 truncate">{analysis.name || 'Not extracted'}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Mail size={14} className="text-slate-500 shrink-0" />
                      <span className="text-slate-700 truncate">{analysis.email || 'Not extracted'}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Phone size={14} className="text-slate-500 shrink-0" />
                      <span className="text-slate-700 truncate">{analysis.phone || 'Not extracted'}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <LinkedinIcon className="text-slate-500 shrink-0" />
                      {analysis.linkedin && analysis.linkedin !== 'Not found' ? (
                        <a href={analysis.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate">{analysis.linkedin}</a>
                      ) : (
                        <span className="text-slate-500 italic">LinkedIn not found</span>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      <GithubIcon className="text-slate-500 shrink-0" />
                      {analysis.github && analysis.github !== 'Not found' ? (
                        <a href={analysis.github} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate">{analysis.github}</a>
                      ) : (
                        <span className="text-slate-500 italic">GitHub not found</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AIResumeAnalyzer;
