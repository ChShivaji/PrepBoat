import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, MessageSquare, ThumbsUp, Plus, Calendar, 
  MapPin, HelpCircle, AlertCircle, X, Award
} from 'lucide-react';

const InterviewExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [experienceText, setExperienceText] = useState('');
  const [questionsAsked, setQuestionsAsked] = useState('');
  const [tips, setTips] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const params = searchQuery ? { search: searchQuery } : {};
      const res = await api.get('/api/experiences', { params });
      setExperiences(res.data);
    } catch (err) {
      console.error("Failed to load interview experiences: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [searchQuery]);

  const handleLike = async (e, id) => {
    e.preventDefault();
    try {
      const res = await api.post(`/api/experiences/${id}/like`);
      // Update local state upvote count
      setExperiences(prev => prev.map(exp => {
        if (exp.id === id) {
          return { ...exp, likes_count: res.data.likes_count };
        }
        return exp;
      }));
    } catch (err) {
      console.error("Failed to upvote experience card: ", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!company || !role || !experienceText) {
      setFormError("Company name, job role, and round descriptions are mandatory fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/api/experiences', {
        company,
        role,
        difficulty,
        experience_text: experienceText,
        questions_asked: questionsAsked,
        tips
      });
      
      // Prepend to top of list
      setExperiences(prev => [res.data, ...prev]);
      
      // Reset form
      setCompany('');
      setRole('');
      setDifficulty('Medium');
      setExperienceText('');
      setQuestionsAsked('');
      setTips('');
      setIsModalOpen(false);
      
      alert("Interview experience logged successfully!");
    } catch (err) {
      console.error("Failed to submit experience form: ", err);
      setFormError("Failed to save entry. Please verify inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (diff) => {
    const d = diff.toLowerCase();
    if (d === 'easy') return 'text-emerald-600 border-emerald-500/20 bg-emerald-50';
    if (d === 'medium') return 'text-amber-600 border-amber-500/20 bg-amber-50';
    return 'text-rose-600 border-rose-500/20 bg-rose-50';
  };

  return (
    <div className="space-y-4">
      
      {/* Search and Write Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100/40 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
          />
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={14} />
          </span>
        </div>

        {/* Trigger Write Experience */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-slate-900 brand-gradient-bg hover:shadow-brand transition-all w-full sm:w-auto justify-center"
        >
          <Plus size={15} />
          <span>Write Experience</span>
        </button>
      </div>

      {/* Main List */}
      {loading ? (
        <LoadingSpinner message="Retrieving placement diaries..." />
      ) : experiences.length > 0 ? (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div 
              key={exp.id} 
              className="glass-panel p-4 rounded-lg border border-slate-200 space-y-4 hover:border-slate-200 transition-all shadow-md"
            >
              {/* Card Header metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded bg-indigo-600 text-slate-900 font-bold text-xs uppercase tracking-wide">
                      {exp.company}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {exp.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span>Logged by {exp.user_name || 'Anonymous'}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(exp.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-sm font-bold uppercase tracking-wider border ${getDifficultyColor(exp.difficulty)}`}>
                  {exp.difficulty} Difficulty
                </span>
              </div>

              {/* Rounds narrative */}
              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-700">Interview Rounds & Process</p>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line bg-slate-100/20 p-4 rounded-lg border border-slate-200/40">
                  {exp.experience_text}
                </p>
              </div>

              {/* Collapsed custom details */}
              {exp.questions_asked && (
                <div className="space-y-2 text-xs pt-1">
                  <p className="font-bold text-slate-700">Questions Asked</p>
                  <pre className="p-3 bg-slate-100/40 border border-slate-200 rounded-lg font-mono text-xs text-indigo-600 overflow-x-auto whitespace-pre-line leading-relaxed">
                    {exp.questions_asked}
                  </pre>
                </div>
              )}

              {exp.tips && (
                <div className="space-y-1.5 text-xs pt-1.5">
                  <p className="font-bold text-slate-700">Tips & Preparation Goals</p>
                  <p className="text-slate-600 leading-relaxed bg-amber-500/5 p-3.5 rounded-lg border border-amber-500/10 text-amber-300/95 italic">
                    💡 {exp.tips}
                  </p>
                </div>
              )}

              {/* Card Footer upvote */}
              <div className="flex items-center pt-2">
                <button
                  onClick={(e) => handleLike(e, exp.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100/30 text-slate-600 hover:text-indigo-600 hover:bg-slate-100/50 transition-all text-sm font-semibold"
                >
                  <ThumbsUp size={12} />
                  <span>Helpful ({exp.likes_count})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-lg text-center space-y-3">
          <MessageSquare size={48} className="text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-700">No Logs Logged</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Be the first to share your recent placement or internship interviews.
          </p>
        </div>
      )}

      {/* Creation Modal Form overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-darkCard border border-slate-200 rounded-lg p-4 shadow-glass space-y-4 animate-scaleUp my-8">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Write Placement Experience</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X size={16} />
              </button>
            </div>

            {/* Error box */}
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-500/20 rounded-lg text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form sheet */}
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Company Name</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Amazon, TCS, Google"
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Job Role / Designation</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Software Engineer Intern"
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Difficulty Scale</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-white focus:outline-none focus:border-indigo-600 appearance-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Round Details & Process (Describe interview stages)</label>
                <textarea
                  required
                  rows={5}
                  value={experienceText}
                  onChange={(e) => setExperienceText(e.target.value)}
                  placeholder="Round 1 was an online test with 2 coding questions. Round 2 was technical face-to-face..."
                  className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Questions Asked (One question per line)</label>
                <textarea
                  rows={3}
                  value={questionsAsked}
                  onChange={(e) => setQuestionsAsked(e.target.value)}
                  placeholder="- Reverse LinkedList in chunks&#10;- Find second highest salary SQL&#10;- Explain ACID properties"
                  className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 font-mono resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tips & Recommendations for aspirants</label>
                <input
                  type="text"
                  value={tips}
                  onChange={(e) => setTips(e.target.value)}
                  placeholder="Be thorough with DBMS normal forms. Practice Neetcode 150."
                  className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-slate-900 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Saving Diary...' : 'Publish Experience'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default InterviewExperiences;
