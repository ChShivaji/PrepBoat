import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Building2, ArrowRight, BookOpen, MessageSquare, Sparkles,
  Search, Filter, CheckCircle2, ChevronDown, ChevronUp, 
  ExternalLink, Clock, PlayCircle, Award, ListFilter, HelpCircle
} from 'lucide-react';
import walmartQuestions from '../services/walmart_questions.json';
import googleQuestions from '../services/google_questions.json';
import microsoftQuestions from '../services/microsoft_questions.json';
import tcsQuestions from '../services/tcs_questions.json';
import wiproQuestions from '../services/wipro_questions.json';
import accentureQuestions from '../services/accenture_questions.json';
import deloitteQuestions from '../services/deloitte_questions.json';
import ciscoQuestions from '../services/cisco_questions.json';
import cognizantQuestions from '../services/cognizant_questions.json';
import oracleQuestions from '../services/oracle_questions.json';
import tcscodevitaQuestions from '../services/tcscodevita_questions.json';
import infosysQuestions from '../services/infosys_questions.json';
import jpmorganQuestions from '../services/jpmorgan_questions.json';

import googleHiring from '../services/google_hiring.json';
import microsoftHiring from '../services/microsoft_hiring.json';
import tcsHiring from '../services/tcs_hiring.json';
import wiproHiring from '../services/wipro_hiring.json';
import accentureHiring from '../services/accenture_hiring.json';
import deloitteHiring from '../services/deloitte_hiring.json';
import ciscoHiring from '../services/cisco_hiring.json';
import cognizantHiring from '../services/cognizant_hiring.json';
import oracleHiring from '../services/oracle_hiring.json';
import tcscodevitaHiring from '../services/tcscodevita_hiring.json';
import infosysHiring from '../services/infosys_hiring.json';
import jpmorganHiring from '../services/jpmorgan_hiring.json';

const renderCompanyLogo = (name, size = 18) => {
  const style = { width: size, height: size };
  switch (name) {
    case 'Walmart':
      return (
        <svg viewBox="0 0 24 24" style={style} fill="none" className="shrink-0">
          <circle cx="12" cy="12" r="11" fill="#0071dc" />
          <g transform="translate(12, 12) scale(0.65)" stroke="#ffc220" strokeWidth="2.5" strokeLinecap="round">
            <line x1="0" y1="-8" x2="0" y2="8" />
            <line x1="-8" y1="0" x2="8" y2="0" />
            <line x1="-5.6" y1="-5.6" x2="5.6" y2="5.6" />
            <line x1="-5.6" y1="5.6" x2="5.6" y2="-5.6" />
            <circle cx="0" cy="0" r="2.5" fill="#ffc220" />
          </g>
        </svg>
      );
    case 'Google':
      return (
        <svg viewBox="0 0 24 24" style={style} className="shrink-0">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      );
    case 'Microsoft':
      return (
        <svg viewBox="0 0 23 23" style={style} className="shrink-0">
          <rect x="0" y="0" width="10" height="10" fill="#f25022"/>
          <rect x="11" y="0" width="10" height="10" fill="#7fba00"/>
          <rect x="0" y="11" width="10" height="10" fill="#00a4ef"/>
          <rect x="11" y="11" width="10" height="10" fill="#ffb900"/>
        </svg>
      );
    case 'JPMorgan':
      return (
        <svg viewBox="0 0 24 24" style={style} fill="#117aca" className="shrink-0">
          <path d="M12 0L2.4 9.6v4.8L12 24l9.6-9.6v-4.8L12 0zm0 3.2L18.8 10h-6.8V3.2zm-6.8 6.8L12 16.8V10H5.2zm6.8 6.8L18.8 20.8h-6.8v-6.8zm6.8-6.8L20.8 10h-6.8v6.8zm-6.8 0h6.8v6.8H12v-6.8z" />
        </svg>
      );
    case 'TCS':
      return (
        <svg viewBox="0 0 24 24" style={style} fill="#005691" className="shrink-0">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5l-4-4 1.5-1.5 2.5 2.5 5-5 1.5 1.5-6.5 6.5z" />
        </svg>
      );
    case 'TCS CodeVita':
      return (
        <svg viewBox="0 0 24 24" style={style} className="shrink-0">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#064e3b" />
          <path d="M7 8l4 4-4 4M12 16h5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'Infosys':
      return (
        <svg viewBox="0 0 24 24" style={style} className="shrink-0">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#007cc3" />
          <text x="4" y="14" fill="#ffffff" fontSize="9" fontWeight="black" fontFamily="sans-serif">INFY</text>
        </svg>
      );
    case 'Wipro':
      return (
        <svg viewBox="0 0 24 24" style={style} className="shrink-0">
          <circle cx="12" cy="12" r="8" fill="none" stroke="#60a5fa" strokeWidth="2" />
          <circle cx="12" cy="4" r="2" fill="#ef4444" />
          <circle cx="12" cy="20" r="2" fill="#3b82f6" />
          <circle cx="4" cy="12" r="2" fill="#10b981" />
          <circle cx="20" cy="12" r="2" fill="#f59e0b" />
        </svg>
      );
    case 'Accenture':
      return (
        <svg viewBox="0 0 24 24" style={style} fill="#a100ff" className="shrink-0">
          <path d="M2.5 1.5l14 10.5-14 10.5H9l14-10.5L9 1.5H2.5z" />
        </svg>
      );
    case 'Deloitte':
      return (
        <svg viewBox="0 0 24 24" style={style} className="shrink-0">
          <text x="2" y="16" fill="#111827" fontSize="15" fontWeight="bold" fontFamily="sans-serif">D</text>
          <circle cx="16" cy="14" r="2.5" fill="#86bc25" />
        </svg>
      );
    case 'Cisco':
      return (
        <svg viewBox="0 0 24 24" style={style} fill="#00b4e5" className="shrink-0">
          <rect x="3" y="13" width="1.8" height="6" rx="0.5" />
          <rect x="6" y="10" width="1.8" height="9" rx="0.5" />
          <rect x="9" y="7" width="1.8" height="12" rx="0.5" />
          <rect x="12" y="4" width="1.8" height="15" rx="0.5" />
          <rect x="15" y="7" width="1.8" height="12" rx="0.5" />
          <rect x="18" y="10" width="1.8" height="9" rx="0.5" />
          <rect x="21" y="13" width="1.8" height="6" rx="0.5" />
        </svg>
      );
    case 'Cognizant':
      return (
        <svg viewBox="0 0 24 24" style={style} fill="#0033a0" className="shrink-0">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5c1.35 0 2.58.54 3.49 1.41l-1.42 1.42C13.51 9.32 12.82 9 12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.82 0 1.51-.32 2.07-.84l1.42 1.42C14.58 16.46 13.35 17 12 17z" />
        </svg>
      );
    case 'Oracle':
      return (
        <svg viewBox="0 0 24 24" style={style} fill="#ff0000" className="shrink-0">
          <path d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 12.5c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z" />
        </svg>
      );
    default:
      return <Building2 size={size} className="text-slate-600 shrink-0" />;
  }
};

const CompanyPrep = () => {
  const companies = [
    { name: 'Walmart', color: 'from-blue-600 via-sky-500 to-amber-500', abbreviation: 'WM', topics: ['Arrays', 'Dynamic Programming', 'Graphs', 'System Design'] },
    { name: 'Google', color: 'from-blue-500 via-red-500 to-yellow-500', abbreviation: 'GO', topics: ['Graphs', 'Recursion', 'Trees', 'Advanced Algorithms'] },
    { name: 'Microsoft', color: 'from-blue-600 to-cyan-500', abbreviation: 'MS', topics: ['Linked Lists', 'Arrays', 'System Design', 'Stacks/Queues'] },
    { name: 'JPMorgan', color: 'from-blue-900 to-cyan-600', abbreviation: 'JP', topics: ['Arrays', 'Sliding Window', 'Linked Lists', 'Heaps'] },
    { name: 'TCS', color: 'from-purple-600 to-indigo-500', abbreviation: 'TC', topics: ['Basic Programming', 'Strings', 'Arrays', 'SQL Queries'] },
    { name: 'TCS CodeVita', color: 'from-teal-600 to-emerald-500', abbreviation: 'CV', topics: ['Competitive Coding', 'Greedy', 'Recursion', 'Math'] },
    { name: 'Infosys', color: 'from-indigo-600 to-blue-500', abbreviation: 'IN', topics: ['Arrays', 'Recursion', 'OOP', 'DBMS'] },
    { name: 'Wipro', color: 'from-emerald-600 to-teal-500', abbreviation: 'WP', topics: ['Basic Programming', 'Math', 'Strings', 'Arrays'] },
    { name: 'Accenture', color: 'from-violet-600 to-fuchsia-500', abbreviation: 'AC', topics: ['Pseudocode', 'Arrays', 'Strings', 'DBMS'] },
    { name: 'Deloitte', color: 'from-lime-600 to-emerald-600', abbreviation: 'DL', topics: ['Aptitude', 'Arrays', 'Strings', 'SQL Queries'] },
    { name: 'Cisco', color: 'from-cyan-600 to-blue-700', abbreviation: 'CS', topics: ['Networking', 'Arrays', 'Graphs', 'Trees'] },
    { name: 'Cognizant', color: 'from-indigo-900 to-purple-600', abbreviation: 'CZ', topics: ['Aptitude', 'OOP', 'Arrays', 'Strings'] },
    { name: 'Oracle', color: 'from-red-600 to-orange-500', abbreviation: 'OR', topics: ['DBMS', 'SQL Joins', 'Arrays', 'System Design'] }
  ];

  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [questions, setQuestions] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions'); // 'questions', 'timeline', 'experiences'

  // Questions filtering and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [roundFilter, setRoundFilter] = useState('All');
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  // Map to link questions to database IDs for workspace solving
  const [dbQuestionMap, setDbQuestionMap] = useState({});

  const fetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const [qRes, expRes] = await Promise.all([
        api.get('/api/questions', { params: { company: selectedCompany.name } }),
        api.get('/api/experiences', { params: { company: selectedCompany.name } })
      ]);
      setQuestions(qRes.data);
      setExperiences(expRes.data);

      // Create mapping of question title to DB ID
      const mapping = {};
      qRes.data.forEach(q => {
        const cleanT = q.title.replace(/\s+(Easy|Medium|Hard)$/i, '').trim().toLowerCase();
        mapping[cleanT] = q.id;
      });
      setDbQuestionMap(mapping);
    } catch (err) {
      console.error("Failed to load company prep metrics: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
    setSearchQuery('');
    setDifficultyFilter('All');
    setRoundFilter('All');
    setExpandedQuestionId(null);
  }, [selectedCompany]);

  // Retrieve questions list (Walmart uses local enriched json data, others use database)
  const getDisplayQuestions = () => {
    const dataMap = {
      'Walmart': walmartQuestions,
      'Google': googleQuestions,
      'Microsoft': microsoftQuestions,
      'TCS': tcsQuestions,
      'Wipro': wiproQuestions,
      'Accenture': accentureQuestions,
      'Deloitte': deloitteQuestions,
      'Cisco': ciscoQuestions,
      'Cognizant': cognizantQuestions,
      'Oracle': oracleQuestions,
      'TCS CodeVita': tcscodevitaQuestions,
      'Infosys': infosysQuestions,
      'JPMorgan': jpmorganQuestions
    };

    const companyData = dataMap[selectedCompany.name] || [];
    if (companyData.length > 0) {
      return companyData.map(q => {
        const cleanTitle = q.title.replace(/\s+(Easy|Medium|Hard)$/i, '').trim().toLowerCase();
        const dbId = dbQuestionMap[cleanTitle];
        const dbQ = questions.find(x => {
          const tClean = x.title.replace(/\s+(Easy|Medium|Hard)$/i, '').trim().toLowerCase();
          return tClean === cleanTitle;
        });

        return {
          ...q,
          db_id: dbId || (dbQ ? dbQ.id : null),
          is_solved: dbQ ? dbQ.is_solved : false
        };
      });
    }

    // Fallback to database questions
    return questions.map(q => ({
      id: q.id,
      title: q.title,
      difficulty: q.difficulty,
      round: q.tags?.includes('OA') ? 'OA' : q.tags?.includes('Phone') ? 'Phone Screen' : 'Onsite',
      topics: q.tags ? q.tags.split(',') : [q.topic],
      description: q.description,
      examples: '',
      approach: q.explanation || 'Optimal approach explanation details.',
      complexity: `${q.time_complexity || 'O(N)'} time · ${q.space_complexity || 'O(1)'} space`,
      follow_up: 'Optimize the solution for space constraints.',
      leetcode_link: '',
      db_id: q.id,
      is_solved: q.is_solved
    }));
  };

  const displayQuestions = getDisplayQuestions();

  // Filter display questions based on search query, difficulty and round
  const filteredQuestions = displayQuestions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
    
    // Normalize round strings for round filter
    let qRoundNormalized = 'onsite';
    if (q.round.toLowerCase().includes('oa') || q.round.toLowerCase().includes('online')) qRoundNormalized = 'oa';
    else if (q.round.toLowerCase().includes('phone') || q.round.toLowerCase().includes('karat')) qRoundNormalized = 'phone';

    const matchesRound = roundFilter === 'All' || 
                         (roundFilter === 'OA' && qRoundNormalized === 'oa') ||
                         (roundFilter === 'Phone Screen' && qRoundNormalized === 'phone') ||
                         (roundFilter === 'Onsite' && qRoundNormalized === 'onsite');

    return matchesSearch && matchesDifficulty && matchesRound;
  });

  const solvedCount = displayQuestions.filter(q => q.is_solved).length;
  const totalCount = displayQuestions.length;
  const solvedPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Company-specific hiring timelines
  const getCompanyTimeline = () => {
    const timelineMap = {
      'Google': googleHiring,
      'Microsoft': microsoftHiring,
      'TCS': tcsHiring,
      'Wipro': wiproHiring,
      'Accenture': accentureHiring,
      'Deloitte': deloitteHiring,
      'Cisco': ciscoHiring,
      'Cognizant': cognizantHiring,
      'Oracle': oracleHiring,
      'TCS CodeVita': tcscodevitaHiring,
      'Infosys': infosysHiring,
      'JPMorgan': jpmorganHiring
    };

    if (selectedCompany.name === 'Walmart') {
      return [
        { title: "Stage 1: Resume Shortlisting", desc: "Walmart Tech screens profiles for strong CS fundamentals, competitive programming background (LeetCode/Codeforces), and tier-1/tier-2 academic records.", tip: "Highlight standard DSA projects, open source, and relevant internships." },
        { title: "Stage 2: Online Assessment (HackerRank)", desc: "A timed 90-minute assessment with 2 to 3 coding problems ranging from medium to hard. Topics frequently include arrays, sliding window, and dynamic programming.", tip: "Ensure correct time complexity; edge cases are strictly checked." },
        { title: "Stage 3: Karat Technical Phone Screen", desc: "A 60-minute live coding session via Karat. Contains 10-15 minutes of CS/domain knowledge questions, followed by one easy-to-medium coding problem (20 mins), and one medium-to-hard coding problem (25 mins).", tip: "Communication is key. Always think out loud before writing code." },
        { title: "Stage 4: DSA Technical Round 1", desc: "A 60-minute onsite technical loop focusing on advanced DSA. Expect two medium-difficulty LeetCode problems on graphs, trees, or DP.", tip: "Optimize code on paper or whiteboards, stating space/time complexities." },
        { title: "Stage 5: DSA Round 2 / LLD Design", desc: "Focuses on Low Level Design (LLD) for SDE-2+ or coding for SDE-1. Frequent LLD prompts: Design Parking Lot, Design Inventory System. Expect discussion on OOP principles and design patterns.", tip: "Master the Factory and Observer design patterns." },
        { title: "Stage 6: High Level Design (HLD)", desc: "For senior hires (SDE-3+). Focuses on system architecture, microservices, databases (SQL vs NoSQL), order systems, and scaling distributed systems.", tip: "Be prepared to talk about API schemas, database indexing, and scaling bottlenecks." },
        { title: "Stage 7: Behavioural and Culture Fit", desc: "Interviews covering conflict resolution, past project contributions, ownership, and adherence to Walmart values.", tip: "Use the STAR method (Situation, Task, Action, Result) for behavioral answers." }
      ];
    }

    return timelineMap[selectedCompany.name] || [
      { title: "Stage 1: Online Written Test", desc: "Aptitude, logical reasoning, core subjects (OS, DBMS), and 1-2 basic coding questions.", tip: "Focus on speed and quantitative calculations." },
      { title: "Stage 2: Technical Interview", desc: "Deep dive into your resume projects, database queries, OOPs, and basic DSA concepts.", tip: "Be ready to explain your projects' architecture." },
      { title: "Stage 3: Managerial & HR Round", desc: "Cultural fit, situational questions, shift flexibility, and compensation discussions.", tip: "Show enthusiasm and research the company profile." }
    ];
  };

  const timelineSteps = getCompanyTimeline();

  const toggleAccordion = (id) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  return (
    <div className="space-y-4 animate-fadeIn w-full">
      
      {/* Companies selector grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <Building2 size={14} className="text-indigo-400" />
            <span>Select Target Company</span>
          </h3>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">
            Real Interview PYQs
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {companies.map((company) => {
            const isSelected = selectedCompany.name === company.name;
            return (
              <button
                key={company.name}
                onClick={() => setSelectedCompany(company)}
                className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 border text-center transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 text-white shadow-brand ring-1 ring-indigo-500/30 scale-102'
                    : 'bg-darkCard border-darkBorder text-slate-600 hover:border-slate-800 hover:text-slate-800 hover:scale-102'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200/60 ${
                  isSelected ? 'border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.2)]' : 'border-slate-800/80'
                } transition-all`}>
                  {renderCompanyLogo(company.name, 20)}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider block max-w-full truncate">{company.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Prep Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Left Sidebar: Profile & Progress Card */}
        <div className="space-y-4">
          
          {/* Company Details */}
          <div className="glass-panel p-4 rounded-lg border border-darkBorder space-y-4 bg-white border border-slate-200">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shadow-inner">
                {renderCompanyLogo(selectedCompany.name, 24)}
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">{selectedCompany.name} Profile</h4>
                <p className="text-[10px] text-slate-600 mt-0.5">Global Placement Preparation</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Targeted preparation for {selectedCompany.name} Global Tech careers. Prepare with real online assessments, Karat coding reviews, and onsite loop simulations.
            </p>

            <div className="space-y-2.5 pt-4 border-t border-darkBorder">
              <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">High Frequency Topics</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedCompany.topics.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-bold border border-indigo-500/15">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Card (LeetCode style) */}
          <div className="glass-panel p-4 rounded-lg border border-darkBorder space-y-4 bg-white border border-slate-200">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest">Prep Progress</h4>
            
            <div className="flex items-center gap-4">
              {/* Circular Progress Indicator */}
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-600 transition-all duration-500"
                    strokeWidth="3.5"
                    strokeDasharray={`${solvedPercent}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800">
                  {solvedPercent}%
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800">
                  {solvedCount} / {totalCount} Solved
                </p>
                <p className="text-[10px] text-slate-700 leading-snug">
                  Practice remaining questions to level up interview readiness.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Section: Core Tabbed Console */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Tabs Selector Bar */}
          <div className="flex border-b border-darkBorder gap-4 text-xs font-bold bg-slate-100 p-2 rounded-lg border border-darkBorder">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'questions'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200 hover:text-slate-800'
              }`}
            >
              Coding Questions ({displayQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'timeline'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200 hover:text-slate-800'
              }`}
            >
              Hiring Process ({timelineSteps.length} Steps)
            </button>
          </div>

          {/* ==============================================
             TAB CONTENT: QUESTIONS
             ============================================== */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              
              {/* Search & Filters Controls */}
              <div className="flex flex-col md:flex-row gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3.5 top-3.5 text-slate-700" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search PYQs by title or topic..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 border border-darkBorder rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brandPurple focus:ring-1 focus:ring-brandPurple"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Round Filter */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-lg text-[10px]">
                    <span className="text-slate-700 font-semibold px-2">Round:</span>
                    {['All', 'OA', 'Phone Screen', 'Onsite'].map(round => (
                      <button
                        key={round}
                        onClick={() => setRoundFilter(round)}
                        className={`px-2 py-1.5 rounded-lg font-bold transition-all ${
                          roundFilter === round
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                      >
                        {round}
                      </button>
                    ))}
                  </div>

                  {/* Difficulty Filter */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-lg text-[10px]">
                    <span className="text-slate-700 font-semibold px-2">Difficulty:</span>
                    {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                      <button
                        key={diff}
                        onClick={() => setDifficultyFilter(diff)}
                        className={`px-2 py-1.5 rounded-lg font-bold transition-all ${
                          difficultyFilter === diff
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>

                </div>

              </div>

              {/* Questions Accordion List */}
              {loading ? (
                <LoadingSpinner message="Filtering company prep questions..." />
              ) : filteredQuestions.length > 0 ? (
                <div className="space-y-3">
                  {filteredQuestions.map((q) => {
                    const isExpanded = expandedQuestionId === q.id;
                    return (
                      <div 
                        key={q.id} 
                        className={`glass-panel border rounded-lg transition-all duration-200 ${
                          isExpanded 
                            ? 'border-indigo-500/40 bg-slate-900/20 shadow-md shadow-indigo-500/5' 
                            : 'border-darkBorder hover:border-slate-800 bg-white border border-slate-200'
                        }`}
                      >
                        
                        {/* Header Summary (Click to expand) */}
                        <div 
                          onClick={() => toggleAccordion(q.id)}
                          className="p-4 flex items-center justify-between cursor-pointer select-none text-xs gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {q.is_solved ? (
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                            ) : (
                              <HelpCircle size={16} className="text-slate-700 shrink-0" />
                            )}
                            <span className="font-extrabold text-slate-800 text-xs truncate">{q.id}. {q.title}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Clean Round Tag */}
                            <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-100 text-slate-600 font-bold text-[9px] uppercase tracking-wide">
                              {q.round}
                            </span>

                            {/* Clean Difficulty Tag */}
                            <span className="px-2 py-0.5 rounded-full border border-slate-200 bg-slate-100 text-slate-600 font-bold text-[9px] uppercase tracking-wider">
                              {q.difficulty}
                            </span>

                            {isExpanded ? <ChevronUp size={14} className="text-slate-600" /> : <ChevronDown size={14} className="text-slate-600" />}
                          </div>
                        </div>

                        {/* Collapsible content (LeetCode description style) */}
                        {isExpanded && (
                          <div className="px-4 pb-5 pt-2 border-t border-darkBorder/60 space-y-4 text-xs text-slate-700 animate-slideDown">
                            
                            {/* Problem description */}
                            <div className="space-y-2">
                              <h5 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Problem Description</h5>
                              <p className="leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-slate-700 text-xs">
                                {q.description}
                              </p>
                            </div>

                            {/* Code Examples */}
                            {q.examples && (
                              <div className="space-y-2">
                                <h5 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Input / Output Examples</h5>
                                <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto text-[10px] text-indigo-300 font-mono leading-relaxed whitespace-pre">
                                  {q.examples}
                                </pre>
                              </div>
                            )}

                            {/* Detailed Approach */}
                            <div className="space-y-2">
                              <h5 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Optimal Seeding Approach</h5>
                              <p className="leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-slate-700 text-xs">
                                {q.approach}
                              </p>
                            </div>

                            {/* Time & Space Complexity */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h5 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Complexity Estimate</h5>
                                <div className="p-3 bg-indigo-50 border border-indigo-500/20 rounded-lg text-indigo-700 font-bold text-xs font-mono">
                                  {q.complexity}
                                </div>
                              </div>

                              {/* Follow up question */}
                              {q.follow_up && (
                                <div className="space-y-2">
                                  <h5 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Follow-Up Doubts</h5>
                                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 italic text-xs">
                                    "{q.follow_up}"
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Bar */}
                            <div className="flex items-center gap-3 pt-3 border-t border-darkBorder/60">
                              {/* Solve on PrepBoat (routes to practice workspace) */}
                              {q.db_id ? (
                                <Link
                                  to={`/practice/${q.db_id}`}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-600/10 hover:scale-103"
                                >
                                  <PlayCircle size={14} />
                                  <span>Practice Workspace</span>
                                </Link>
                              ) : (
                                <span className="text-[10px] text-slate-700 italic">Local Study Concept Only</span>
                              )}

                              {/* Practice on Leetcode (external link) */}
                              {q.leetcode_link && (
                                <a
                                  href={q.leetcode_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-darkBorder bg-slate-100 hover:bg-slate-800 text-slate-800 hover:text-white transition-all text-[11px]"
                                >
                                  <span>LeetCode Link</span>
                                  <ExternalLink size={11} />
                                </a>
                              )}
                            </div>

                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-slate-900/10 rounded-lg text-center text-xs text-slate-700 border border-darkBorder border-dashed">
                  No previous year questions match the search filter for {selectedCompany.name}.
                </div>
              )}

            </div>
          )}

          {/* ==============================================
             TAB CONTENT: TIMELINE
             ============================================== */}
          {activeTab === 'timeline' && (
            <div className="glass-panel p-4 rounded-lg border border-darkBorder space-y-4 bg-white border border-slate-200 relative overflow-hidden">
              
              {/* Timeline Grid layout */}
              <div className="relative border-l border-darkBorder/85 pl-6 ml-4 space-y-4">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                    </div>

                    <div className="space-y-2 text-xs">
                      <h4 className="font-extrabold text-slate-800 tracking-wide flex items-center gap-2">
                        <span>{step.title}</span>
                      </h4>
                      <p className="text-slate-600 leading-relaxed max-w-2xl">
                        {step.desc}
                      </p>
                      <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg max-w-2xl text-indigo-700 italic">
                        <span className="font-bold uppercase tracking-wider text-xs block mb-0.5 text-indigo-600">Mentorship Tips:</span>
                        {step.tip}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}



        </div>

      </div>

    </div>
  );
};

export default CompanyPrep;
