import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, BookOpen, Trophy, BarChart3, 
  Building2, FileText, Sparkles, LogOut, Ship, Brain,
  Bot, ShieldAlert, FilePlus
} from 'lucide-react';

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

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Practice Bank', path: '/practice', icon: BookOpen },
    { name: 'Reference Hub', path: '/references', icon: Youtube },
    { name: 'Company Prep', path: '/company-prep', icon: Building2 },
  ];

  const aiItems = [
    { name: 'AI Resume Analyzer', path: '/ai-resume', icon: FileText },
    { name: 'AI Resume Creator', path: '/ai-resume-creator', icon: FilePlus },
    { name: 'AI Interview Gen', path: '/ai-interview', icon: Sparkles },
    { name: 'AI Mentor', path: '/ai-mentor', icon: Bot },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-darkCard border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0 p-2">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 flex items-center gap-4">
        <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-200 text-brandPurple">
          <Ship size={24} className="animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
            PrepBoat <span className="text-xs bg-indigo-500/20 text-brandPurple px-1.5 py-0.5 rounded border border-indigo-100">AI</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Career Readiness Platform</p>
        </div>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-5">
        {/* Aptitude Hub */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">Aptitude</p>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/aptitude"
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600 border-l-2 border-indigo-600 pl-2.5' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Brain size={16} className="text-amber-600" />
                <span>Aptitude Hub</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Core Modules */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">Core Modules</p>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-600 border-l-2 border-indigo-600 pl-2.5' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <item.icon size={16} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Features */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">AI Assistants</p>
          <ul className="space-y-1">
            {aiItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-600 border-l-2 border-indigo-600 pl-2.5' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <item.icon size={16} className="text-purple-600" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin Dashboard */}
        {user?.role === 'admin' && (
          <div>
            <p className="text-xs font-bold text-rose-500 uppercase tracking-widest px-3 mb-3">Administrator</p>
            <NavLink
              to="/admin"
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-rose-50 text-rose-600 border-l-2 border-rose-500 pl-2.5' 
                    : 'text-rose-600/80 hover:bg-rose-50 hover:text-rose-700'
                }`
              }
            >
              <ShieldAlert size={16} />
              <span>Admin Center</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Footer Profile */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-slate-900 font-bold border border-indigo-200">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 truncate uppercase">{user?.role || 'student'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-semibold border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-500/20 transition-all duration-200 text-slate-600"
        >
          <LogOut size={16} />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
