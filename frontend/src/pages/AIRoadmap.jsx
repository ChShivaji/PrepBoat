import React, { useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Sparkles, Map, Target, Calendar, CheckSquare, 
  HelpCircle, AlertCircle, ArrowRight, BookOpen 
} from 'lucide-react';

const AIRoadmap = () => {
  const [role, setRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('plan_30'); // 'plan_30', 'plan_60', 'plan_90'

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!role.trim()) {
      setError('Please input your target placement role.');
      return;
    }

    setLoading(true);
    setRoadmap(null);
    setError('');

    try {
      const res = await api.post('/api/ai/roadmap', {
        target_role: role
      });
      setRoadmap(res.data);
    } catch (err) {
      console.error("Failed to generate placement roadmap: ", err);
      setError("Roadmap compiler failed. Please verify API configuration.");
    } finally {
      setLoading(false);
    }
  };

  const getTimelineName = (key) => {
    if (key === 'plan_30') return 'Day 1-30';
    if (key === 'plan_60') return 'Day 31-60';
    return 'Day 61-90';
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Search/Query controls form */}
      <div className="glass-panel p-4 rounded-lg border border-slate-200 max-w-4xl mx-auto space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">AI Prep Roadmap Planner</h3>
          <p className="text-xs text-slate-600">Generate a comprehensive 30, 60, and 90-day learning roadmap tailored to your career goals</p>
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
            placeholder="e.g. Backend Developer"
            className="flex-1 px-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-brandPurple"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg font-semibold text-slate-900 bg-indigo-600 hover:bg-indigo-500 transition-all hover:shadow-brand shrink-0"
          >
            {loading ? 'Synthesizing...' : 'Generate Roadmap'}
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner message="Assembling custom learning roadmaps using PrepBoat compiler..." />}

      {/* Generated Roadmap timeline details */}
      {roadmap && (
        <div className="space-y-4 w-full">
          
          {/* Main Visual timeline bar switcher */}
          <div className="grid grid-cols-3 bg-slate-100/60 p-1 rounded-lg border border-slate-200 text-sm font-semibold select-none">
            {['plan_30', 'plan_60', 'plan_90'].map((planKey) => {
              const isActive = activeTab === planKey;
              const titleText = roadmap[planKey]?.title || getTimelineName(planKey);
              return (
                <button
                  key={planKey}
                  onClick={() => setActiveTab(planKey)}
                  className={`py-3 px-2 rounded-lg text-center flex flex-col items-center justify-center gap-1 transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-brand'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/20'
                  }`}
                >
                  <Calendar size={14} />
                  <span className="font-bold tracking-wide text-xs uppercase truncate max-w-full">
                    {getTimelineName(planKey)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active timeline detailed details */}
          {['plan_30', 'plan_60', 'plan_90'].map((planKey) => {
            if (activeTab !== planKey) return null;
            const currentPlan = roadmap[planKey];
            return (
              <div 
                key={planKey} 
                className="glass-panel p-4 rounded-lg border border-indigo-500/10 shadow-lg space-y-4 animate-fadeIn"
              >
                {/* Title */}
                <div className="flex items-center gap-2.5 border-b border-slate-200 pb-4">
                  <div className="p-2 rounded bg-indigo-50 border border-indigo-500/20 text-indigo-600">
                    <Target size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{currentPlan.title}</h4>
                    <p className="text-xs text-slate-600 uppercase tracking-widest">Active Focus Area</p>
                  </div>
                </div>

                {/* Grid info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                  {/* Skills lists */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-600" />
                      <span>Primary Core Skills to Build</span>
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {currentPlan.skills?.map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-500/5 text-indigo-600 border border-indigo-500/10 text-sm font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Resource checklists */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-slate-700 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-indigo-600" />
                      <span>Recommended Materials</span>
                    </h5>
                    <ul className="space-y-1.5 text-slate-600">
                      {currentPlan.resources?.map((res, idx) => (
                        <li key={idx} className="flex items-center gap-2 leading-none">
                          <ArrowRight size={11} className="text-indigo-600" />
                          <span>{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Practice checklists */}
                <div className="border-t border-slate-200 pt-5 space-y-2 text-xs">
                  <h5 className="font-bold text-slate-700 flex items-center gap-1.5">
                    <CheckSquare size={14} className="text-brandEmerald" />
                    <span>Practice Goals & Target Deliverables</span>
                  </h5>
                  <p className="text-slate-600 leading-relaxed bg-slate-100/20 p-4 rounded-lg border border-slate-200/40">
                    {currentPlan.practice_goals}
                  </p>
                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default AIRoadmap;
