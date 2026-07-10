import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, BookOpen, Bookmark, BookmarkCheck, CheckCircle2, 
  HelpCircle, ChevronRight, SlidersHorizontal, Award
} from 'lucide-react';

const Practice = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'DSA';

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(''); // 'solved', 'unsolved', 'bookmarked'
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');

  const categories = ['DSA'];

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;
      if (selectedTopic) params.topic = selectedTopic;
      if (searchTerm) params.search = searchTerm;

      const res = await api.get('/api/questions', { params });
      setQuestions(res.data);

      // Extract unique topics from these questions to feed sub-filter
      const uniqTopics = [...new Set(res.data.map(q => q.topic))];
      setTopics(uniqTopics);
    } catch (err) {
      console.error("Failed to load questions list: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // Sync category parameter in URL
    setSearchParams({ category: selectedCategory });
  }, [selectedCategory, selectedDifficulty, selectedTopic, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleBookmarkToggle = async (e, questionId, currentBookmarkState) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.post(`/api/questions/${questionId}/bookmark`, {
        bookmarked: !currentBookmarkState
      });
      // Locally toggle bookmark state
      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          return { ...q, is_bookmarked: !currentBookmarkState };
        }
        return q;
      }));
    } catch (err) {
      console.error("Failed to save bookmark status: ", err);
    }
  };

  // Filter list locally for solve status (saves API latency)
  const filteredQuestions = questions.filter(q => {
    if (selectedStatus === 'solved') return q.is_solved;
    if (selectedStatus === 'unsolved') return !q.is_solved;
    if (selectedStatus === 'bookmarked') return q.is_bookmarked;
    return true;
  });

  const getDifficultyColor = (diff) => {
    const d = diff.toLowerCase();
    if (d === 'easy') return 'text-emerald-600 bg-emerald-50 border-emerald-500/20';
    if (d === 'medium') return 'text-amber-600 bg-amber-50 border-amber-500/20';
    return 'text-rose-600 bg-rose-50 border-rose-500/20';
  };

  return (
    <div className="space-y-4">
      {/* Search and Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex bg-slate-100/60 p-1 rounded-lg border border-slate-200 w-fit overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedTopic('');
              }}
              className={`px-5 py-3 rounded-lg text-sm font-bold tracking-wide transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-brand'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Text Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search problems..."
            className="w-full pl-11 pr-8 py-3 bg-slate-100/40 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
          />
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
            <Search size={18} />
          </span>
          <button type="submit" className="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-600 hover:text-indigo-300">
            <ChevronRight size={18} />
          </button>
        </form>
      </div>

      {/* Advanced Filter Sub-headers */}
      <div className="glass-panel p-4 rounded-lg flex flex-wrap items-center gap-5 text-sm">
        <div className="flex items-center gap-1.5 text-slate-600">
          <SlidersHorizontal size={18} />
          <span>Filters:</span>
        </div>

        {/* Difficulty */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="bg-slate-100/50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:border-indigo-600 text-sm"
        >
          <option value="">Difficulty (All)</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Topic sub-filter */}
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="bg-slate-100/50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:border-indigo-600 text-sm max-w-[180px]"
        >
          <option value="">Topic (All)</option>
          {topics.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Status */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-100/50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:border-indigo-600 text-sm"
        >
          <option value="">Status (All)</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
          <option value="bookmarked">Bookmarked</option>
        </select>
      </div>

      {/* Questions list Table */}
      {loading ? (
        <LoadingSpinner message="Scanning coding challenges..." />
      ) : filteredQuestions.length > 0 ? (
        <div className="glass-panel rounded-lg overflow-hidden shadow-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/30 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6 w-16 text-center">Status</th>
                <th className="py-4 px-4">Problem Name</th>
                <th className="py-4 px-4 w-36">Topic</th>
                <th className="py-4 px-4 w-28 text-center">Difficulty</th>
                <th className="py-4 px-4 hidden md:table-cell">Companies</th>
                <th className="py-4 px-6 w-16 text-center">Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkBorder text-slate-700 text-sm">
              {filteredQuestions.map((q) => (
                <tr 
                  key={q.id} 
                  className="hover:bg-white/35 transition-colors duration-150 group"
                >
                  <td className="py-4 px-6 text-center">
                    {q.is_solved ? (
                      <CheckCircle2 size={16} className="text-emerald-600 mx-auto fill-emerald-500/10" />
                    ) : (
                      <HelpCircle size={16} className="text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800 hover:text-indigo-600">
                    <Link to={`/practice/${q.id}`} className="block">
                      {q.title}
                    </Link>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300/60 text-slate-700 text-xs font-semibold">
                      {q.topic}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell text-slate-600 text-xs max-w-xs truncate">
                    {q.company_tags ? (
                      <div className="flex flex-wrap gap-1">
                        {q.company_tags.split(',').slice(0, 3).map(c => (
                          <span key={c} className="px-1.5 py-0.5 rounded bg-indigo-500/5 text-indigo-600 border border-indigo-500/10">
                            {c}
                          </span>
                        ))}
                        {q.company_tags.split(',').length > 3 && <span>+ more</span>}
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={(e) => handleBookmarkToggle(e, q.id, q.is_bookmarked)}
                      className="text-slate-500 hover:text-amber-600 transition-colors"
                      title={q.is_bookmarked ? 'Remove bookmark' : 'Bookmark question'}
                    >
                      {q.is_bookmarked ? (
                        <BookmarkCheck size={16} className="text-amber-600" />
                      ) : (
                        <Bookmark size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-lg text-center space-y-3">
          <BookOpen size={48} className="text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-700">No Questions Found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Try adjusting your search criteria, switching category tabs, or clearing your selected filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default Practice;
