import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { 
  Flame, CheckCircle, ArrowRight,
  BookOpen, Sparkles, FileText, Bot, 
  Building2, MessageSquare, Brain,
  ChevronLeft, ChevronRight, Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

import dsaPracticeBanner from '../assets/dsa_practice_banner.png';
import aiMentorBanner from '../assets/ai_mentor_banner.png';
import aptitudeBanner from '../assets/aptitude_banner.png';
import Rudra3DAvatar from '../components/Rudra3DAvatar';

const Youtube = ({ size = 24, className = '', ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Time tracker states
  const now = new Date();
  const [displayedMonth, setDisplayedMonth] = useState(now.getMonth() + 1);
  const [displayedYear, setDisplayedYear] = useState(now.getFullYear());
  const [monthlyHours, setMonthlyHours] = useState(null);
  const [loadingHours, setLoadingHours] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/analytics/summary');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard summary stats: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      setLoadingHours(true);
      try {
        const res = await api.get(`/api/analytics/monthly-time-spent?year=${displayedYear}&month=${displayedMonth}`);
        setMonthlyHours(res.data);
      } catch (err) {
        console.error("Failed to load monthly hours spent: ", err);
      } finally {
        setLoadingHours(false);
      }
    };
    fetchMonthlyData();
  }, [displayedMonth, displayedYear]);

  if (loading) {
    return <LoadingSpinner message="Assembling your workspace dashboard..." />;
  }

  const solvedPercentage = stats 
    ? Math.round((stats.total_solved / (stats.total_questions_db || 1)) * 100) 
    : 0;

  // Month navigation boundary logic
  const creationDate = stats?.user_created_at ? new Date(stats.user_created_at) : new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const creationMonth = creationDate.getMonth() + 1;
  const creationYear = creationDate.getFullYear();

  const isAtStart = displayedYear === creationYear && displayedMonth === creationMonth;
  const isAtEnd = displayedYear === now.getFullYear() && displayedMonth === (now.getMonth() + 1);

  const handlePrevMonth = () => {
    if (isAtStart) return;
    if (displayedMonth === 1) {
      setDisplayedMonth(12);
      setDisplayedYear(prev => prev - 1);
    } else {
      setDisplayedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (isAtEnd) return;
    if (displayedMonth === 12) {
      setDisplayedMonth(1);
      setDisplayedYear(prev => prev + 1);
    } else {
      setDisplayedMonth(prev => prev + 1);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const displayedMonthName = monthNames[displayedMonth - 1];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden border border-slate-800 shadow-2xl">
        {/* Subtle decorative background gradient */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>
        
        <div className="space-y-3 relative z-10">
          <span className="px-2.5 py-1 bg-indigo-950/60 border border-indigo-500/30 rounded-full text-[10px] font-bold text-indigo-400 inline-flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles size={11} className="animate-pulse" />
            Candidate Workspace
          </span>
          <h2 className="text-lg font-extrabold text-white tracking-tight">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">{user?.name}</span>! 👋
          </h2>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            PrepBoat is your centralized space for placement readiness. Review our resources below or resume practicing code and aptitude modules to prepare for top-tier companies.
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10 shrink-0">
          {/* Animated Developer PC Icon */}
          <div className="hidden lg:flex w-24 h-24 text-indigo-500/20 items-center justify-center relative bg-slate-900/50 border border-slate-800 rounded-lg p-2 shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 rounded-lg blur-md animate-pulse"></div>
            <svg className="w-14 h-14 text-indigo-400/85 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
               <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
               <line x1="8" y1="21" x2="16" y2="21" />
               <line x1="12" y1="17" x2="12" y2="21" />
               <path d="M6 8l3 3-3 3" />
               <line x1="11" y1="14" x2="15" y2="14" />
            </svg>
          </div>

          <Link
            to="/practice?category=DSA"
            className="flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold text-white brand-gradient-bg hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 transform hover:-translate-y-0.5 animate-fadeIn"
          >
            <span>Resume Practice</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid (Cleaned and reduced from 4 to 2 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Solved"
          value={stats?.total_solved || 0}
          icon={CheckCircle}
          description={`Progress: ${solvedPercentage}% of question bank`}
          color="emerald"
        />
        <StatCard
          title="Active Streak"
          value={`${stats?.current_streak || 0} Days`}
          icon={Flame}
          description="Consecutive learning days logged"
          color="indigo"
        />
      </div>

      {/* Resources & Guides Directory */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Our Preparation Resources</h3>
          <p className="text-xs text-slate-600 mt-1">Discover available tools, modules, and AI helpers to boost your interview readiness.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Practice Bank Card */}
          <div className="glass-panel card-3d-hover preserve-3d p-4 rounded-lg flex flex-col justify-between border border-slate-200 hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 translate-z-10">
                <BookOpen size={20} />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Practice Bank</h4>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md uppercase tracking-wider font-mono">Code</span>
              </div>
              <div className="w-full h-24 overflow-hidden rounded-lg bg-slate-900 border border-slate-100 mt-1.5 mb-2 relative translate-z-20">
                <img src={dsaPracticeBanner} alt="DSA Practice" className="w-full h-full object-cover opacity-80 group-hover:scale-105 duration-500 transition-transform" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                A massive bank of structured questions to practice core topics. Filter and practice across three key domains:
              </p>
              <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-1 pl-1">
                <li><strong className="text-slate-800">DSA</strong>: Array, Linked List, Recursion, DP, Graphs.</li>
                <li><strong className="text-slate-800">SQL</strong>: Joins, Aggregation, Subqueries, Indexes.</li>
                <li><strong className="text-slate-800">Aptitude</strong>: Work, Profit/Loss, Percentages, SI/CI.</li>
              </ul>
            </div>
            <Link 
              to="/practice" 
              className="mt-6 flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors pt-3 border-t border-slate-100 group-hover:border-indigo-100"
            >
              <span>Explore Practice Bank</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Aptitude Prep Hub */}
          <div className="glass-panel card-3d-hover preserve-3d p-4 rounded-lg flex flex-col justify-between border border-slate-200 hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 translate-z-10">
                <Brain size={20} />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Aptitude Prep Hub</h4>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded-md uppercase tracking-wider font-mono">Math</span>
              </div>
              <div className="w-full h-24 overflow-hidden rounded-lg bg-slate-900 border border-slate-100 mt-1.5 mb-2 relative translate-z-20">
                <img src={aptitudeBanner} alt="Aptitude Hub" className="w-full h-full object-cover opacity-80 group-hover:scale-105 duration-500 transition-transform" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Master quantitative aptitude and logical reasoning with structured, self-paced modules and practice sheets.
              </p>
              <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-1 pl-1">
                <li><strong className="text-slate-800">32 Key Subjects</strong>: Quantitative and logical modules.</li>
                <li><strong className="text-slate-800">1,280 Solved MCQs</strong>: 40 questions per topic with explanations.</li>
                <li><strong className="text-slate-800">Immediate Feedback</strong>: Instantly verify correct answers.</li>
              </ul>
            </div>
            <Link 
              to="/aptitude" 
              className="mt-6 flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors pt-3 border-t border-slate-100 group-hover:border-violet-100"
            >
              <span>Open Aptitude Hub</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Company-wise Preparation */}
          <div className="glass-panel card-3d-hover preserve-3d p-4 rounded-lg flex flex-col justify-between border border-slate-200 hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 translate-z-10">
                <Building2 size={20} />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Company Prep Tracks</h4>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-md uppercase tracking-wider font-mono">Hiring</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recruiter-specific prep pipelines compiled from historical interview metrics. Find coding challenges and hiring rounds for:
              </p>
              <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-1 pl-1">
                <li><strong className="text-slate-800">MAANG</strong>: High-difficulty Google & Amazon tracks.</li>
                <li><strong className="text-slate-800">FinTech & Networks</strong>: JP Morgan, Cisco, Oracle.</li>
                <li><strong className="text-slate-800">Consultancies</strong>: TCS, Infosys, Accenture.</li>
              </ul>
            </div>
            <Link 
              to="/company-prep" 
              className="mt-6 flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors pt-3 border-t border-slate-100 group-hover:border-amber-100"
            >
              <span>Open Company Prep</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Video Reference Library */}
          <div className="glass-panel card-3d-hover preserve-3d p-4 rounded-lg flex flex-col justify-between border border-slate-200 hover:shadow-xl transition-all duration-300 group animate-fadeIn">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 translate-z-10">
                <Youtube size={20} />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Reference Hub</h4>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-50 text-red-600 rounded-md uppercase tracking-wider font-mono">Video</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore curated YouTube video playlists and lecture series recommended by experts. Learn about:
              </p>
              <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-1 pl-1 font-sans">
                <li><strong className="text-slate-800">DSA Playlists</strong>: Comprehensive step-by-step programming guides.</li>
                <li><strong className="text-slate-800">SQL Tutorials</strong>: Direct queries and relational operations.</li>
                <li><strong className="text-slate-800">Core Concepts</strong>: Fast summaries for OS, DBMS, and CN.</li>
              </ul>
            </div>
            <Link 
              to="/references" 
              className="mt-6 flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors pt-3 border-t border-slate-100 group-hover:border-red-100"
            >
              <span>Open Reference Hub</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* AI Resume ATS Analyzer */}
          <div className="glass-panel card-3d-hover preserve-3d p-4 rounded-lg flex flex-col justify-between border border-slate-200 hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 translate-z-10">
                <FileText size={20} />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">AI Resume Analyzer</h4>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded-md uppercase tracking-wider font-mono">ATS</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scan your PDF resume using AI to match against core applicant tracking systems (ATS). Find missing details:
              </p>
              <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-1 pl-1">
                <li><strong className="text-slate-800">ATS Score Card</strong>: Instantly calculates percentage match.</li>
                <li><strong className="text-slate-800">Keyword Check</strong>: Pinpoints missing software skills.</li>
                <li><strong className="text-slate-800">Section Analysis</strong>: Audits education and projects blocks.</li>
              </ul>
            </div>
            <Link 
              to="/ai-resume" 
              className="mt-6 flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors pt-3 border-t border-slate-100 group-hover:border-teal-100"
            >
              <span>Scan Your Resume</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* AI Mock Interview & Mentor */}
          <div className="glass-panel card-3d-hover preserve-3d p-4 rounded-lg flex flex-col justify-between border border-slate-200 hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 translate-z-10">
                <Rudra3DAvatar size={22} className="bot-avatar-3d" active={true} />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">AI Mock Interview & Mentor</h4>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-md uppercase tracking-wider font-mono">AI</span>
              </div>
              <div className="w-full h-24 overflow-hidden rounded-lg bg-slate-900 border border-slate-100 mt-1.5 mb-2 relative translate-z-20">
                <img src={aiMentorBanner} alt="AI Mentor Hub" className="w-full h-full object-cover opacity-80 group-hover:scale-105 duration-500 transition-transform" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Leverage advanced AI mentors powered by Gemini. Prepare for interviews dynamically:
              </p>
              <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-1 pl-1">
                <li><strong className="text-slate-800">Interview Gen</strong>: Customizable technical mock sessions.</li>
                <li><strong className="text-slate-800">AI Mentor (Rudra)</strong>: Chat with voice capabilities.</li>
                <li><strong className="text-slate-800">Roadmap Generator</strong>: Structured timeline planner.</li>
              </ul>
            </div>
            <div className="flex gap-4 mt-6 pt-3 border-t border-slate-100 group-hover:border-emerald-100 text-xs font-semibold text-indigo-600">
              <Link to="/ai-interview" className="hover:text-indigo-700 flex items-center gap-1">
                <span>Mock interview</span>
                <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-slate-200">|</span>
              <Link to="/ai-mentor" className="hover:text-indigo-700 flex items-center gap-1">
                <span>Talk with Rudra</span>
                <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Monthly Time Spent Tracker (Replaces Difficulty Breakdown, takes 2 cols) + Subject Progress (takes 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Monthly Time Spent Analytics Graph */}
        <div className="glass-panel p-4 rounded-lg flex flex-col justify-between border border-slate-200 lg:col-span-2 min-w-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Study Time Tracker</h3>
              <p className="text-[10px] text-slate-600">Tracking daily study time logged in practice modules</p>
            </div>
            
            {/* Month Navigator controls */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs select-none">
              <button 
                onClick={handlePrevMonth}
                disabled={isAtStart}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-bold text-slate-800 min-w-[100px] text-center">
                {displayedMonthName} {displayedYear}
              </span>
              <button 
                onClick={handleNextMonth}
                disabled={isAtEnd}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Month Summary Stats banner */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-lg text-indigo-700">
              <Clock size={20} />
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-500 block">Total Spent</span>
                <span className="text-sm font-extrabold font-mono">{monthlyHours?.total_hours || 0} Hours</span>
              </div>
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Daily Average</span>
              <span className="text-sm font-bold text-slate-800">
                {monthlyHours ? (monthlyHours.total_hours / (monthlyHours.total_days || 30)).toFixed(2) : 0} hrs/day
              </span>
            </div>
          </div>

          {/* Time spent Area Chart */}
          <div className="h-64 w-full min-w-0">
            {loadingHours ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                <span>Loading calendar analytics...</span>
              </div>
            ) : monthlyHours?.daily_hours && monthlyHours.daily_hours.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={monthlyHours.daily_hours} 
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="timeColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#94A3B8" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={8}
                    tickFormatter={(val) => `Day ${val}`}
                  />
                  <YAxis 
                    stroke="#94A3B8" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false} 
                    dx={-8}
                    tickFormatter={(val) => `${val}h`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '12px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                    labelFormatter={(label) => `Day ${label} of ${displayedMonthName}`}
                    formatter={(value) => [`${value} Hours`, 'Time Logged']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#6366F1" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#timeColor)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                No study logs found for this period.
              </div>
            )}
          </div>
        </div>

        {/* Detailed Subject Progress bars */}
        <div className="glass-panel p-4 rounded-lg space-y-4 border border-slate-200 lg:col-span-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detailed Subject Progress</h3>
            <p className="text-[10px] text-slate-600">Real-time status tracking completed questions compared to totals</p>
          </div>
          
          <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
            {stats?.category_progress && stats.category_progress.length > 0 ? (
              stats.category_progress.map((c) => (
                <div key={c.subject} className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">{c.subject}</span>
                    <span className="font-mono text-slate-600">{c.solved} / {c.total} Solved ({c.percentage}%)</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                      style={{ width: `${c.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-600 text-xs text-center py-6">No subject progress logged.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
