import React, { useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Sparkles, HelpCircle, MessageSquare, ChevronDown, 
  ChevronUp, AlertCircle, Bookmark, Code, User, FileText 
} from 'lucide-react';

const AIInterviewGen = () => {
  const [role, setRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Technical', 'Behavioral', 'Project-Based'

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!role.trim()) {
      setError('Please input a target placement role.');
      return;
    }

    setLoading(true);
    setQuestions([]);
    setExpandedId(null);
    setError('');

    try {
      const res = await api.post('/api/ai/interview-questions', {
        target_role: role
      });
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to generate interview questions: ", err);
      setError("Failed to compile questions pack. Verify backend server connections.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (cat) => {
    const c = cat.toLowerCase();
    if (c === 'technical') return <Code size={14} className="text-indigo-600" />;
    if (c === 'behavioral') return <User size={14} className="text-amber-600" />;
    return <FileText size={14} className="text-emerald-600" />;
  };

  // Filter list by selected tab
  const filteredQuestions = questions.filter(q => {
    if (activeTab === 'All') return true;
    return q.category.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Search/Query controls form */}
      <div className="glass-panel p-4 rounded-lg border border-slate-200 max-w-xl mx-auto space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Generate Interview Questions</h3>
          <p className="text-xs text-slate-600 font-medium">Input your placement role (e.g. Python Developer) to compile a pack of 50 custom interview questions</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-500/20 rounded-lg text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleGenerate} className="flex gap-3 text-xs">
          <input
            type="text"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. React Developer"
            className="flex-1 px-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-brandPurple"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg font-semibold text-slate-900 bg-indigo-600 hover:bg-indigo-500 transition-all hover:shadow-brand shrink-0"
          >
            {loading ? 'Compiling...' : 'Generate Questions'}
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner message="Generating questions using PrepBoat AI engine..." />}

      {/* Generated list grid */}
      {questions.length > 0 && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Tab filters */}
          <div className="flex bg-slate-100/60 p-1 rounded-lg border border-slate-200 w-fit text-xs font-semibold">
            {['All', 'Technical', 'Behavioral', 'Project-Based'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setExpandedId(null);
                }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-brand'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List display */}
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const isOpen = expandedId === idx;
              return (
                <div 
                  key={idx} 
                  className="glass-panel rounded-lg border border-slate-200 overflow-hidden hover:border-slate-200 transition-all shadow-md"
                >
                  {/* Collapsible header */}
                  <div
                    onClick={() => setExpandedId(isOpen ? null : idx)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/20 transition-all select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded bg-slate-100/60 border border-slate-200 shrink-0">
                        {getCategoryIcon(q.category)}
                      </div>
                      <span className="text-xs font-bold text-slate-800 truncate pr-4">{q.question}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold hidden md:inline">{q.category}</span>
                      {isOpen ? <ChevronUp size={16} className="text-slate-600" /> : <ChevronDown size={16} className="text-slate-600" />}
                    </div>
                  </div>

                  {/* Expanded body */}
                  {isOpen && (
                    <div className="p-4 bg-slate-50/30 border-t border-slate-200 text-xs space-y-3 animate-slideDown">
                      <div className="flex items-center gap-1 text-slate-700 font-bold">
                        <Sparkles size={13} className="text-amber-600" />
                        <span>Detailed Explanation & Answer Guidelines:</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-4.5 whitespace-pre-line">
                        {q.hint}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default AIInterviewGen;
