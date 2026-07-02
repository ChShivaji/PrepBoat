import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Bell, User, Target, GraduationCap } from 'lucide-react';
import api from '../services/api';

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [streak, setStreak] = useState(0);

  // Retrieve streak count dynamically from backend summary
  useEffect(() => {
    const fetchStreak = async () => {
      if (user) {
        try {
          const res = await api.get('/api/analytics/summary');
          setStreak(res.data.current_streak || 0);
        } catch (err) {
          console.error("Failed to load streak count: ", err);
        }
      }
    };
    fetchStreak();
  }, [user, location.pathname]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Overview Dashboard';
    if (path === '/practice') return 'Practice Challenges';
    if (path.startsWith('/practice/')) return 'Coding Workspace';
    if (path === '/tests') return 'Mock Test Engine';
    if (path.startsWith('/tests/run/')) return 'Exam Console';
    if (path === '/references') return 'Video Reference Library';
    if (path === '/company-prep') return 'Company-wise Preparation';
    if (path === '/ai-resume') return 'AI Resume Scanner (ATS)';
    if (path === '/ai-interview') return 'AI Mock Question Generator';
    if (path === '/ai-roadmap') return 'AI Placement Prep Roadmaps';
    if (path === '/ai-mentor') return 'AI Mentor';
    if (path === '/admin') return 'Admin Dashboard';
    return 'PrepBoat AI';
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-slate-100/60 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 tracking-wide">{getPageTitle()}</h2>
      </div>

      {/* Meta indicators */}
      <div className="flex items-center gap-6">
        {/* Branch / College badge */}
        {user?.college && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-500/20 text-emerald-600 text-xs font-medium">
            <GraduationCap size={14} />
            <span className="max-w-[140px] truncate">{user.college}</span>
          </div>
        )}

        {/* Profile and Notification anchors */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <Link
            to="/"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            title="User Profile Dashboard"
          >
            <User size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
