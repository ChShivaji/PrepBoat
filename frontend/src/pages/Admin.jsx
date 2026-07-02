import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import { 
  Users, BookOpen, Trophy, ShieldCheck, Plus, 
  Trash2, Edit, AlertCircle, CheckCircle, HelpCircle, X 
} from 'lucide-react';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions'); // 'questions', 'tests'

  // Modal forms states
  const [isQModalOpen, setIsQModalOpen] = useState(false);
  const [editingQ, setEditingQ] = useState(null);
  const [qTitle, setQTitle] = useState('');
  const [qDescription, setQDescription] = useState('');
  const [qDifficulty, setQDifficulty] = useState('Easy');
  const [qTopic, setQTopic] = useState('');
  const [qCategory, setQCategory] = useState('DSA');
  const [qTags, setQTags] = useState('');
  const [qCompanyTags, setQCompanyTags] = useState('');
  const [qSolution, setQSolution] = useState('');
  const [qExplanation, setQExplanation] = useState('');
  const [qTimeComp, setQTimeComp] = useState('');
  const [qSpaceComp, setQSpaceComp] = useState('');

  const [isTModalOpen, setIsTModalOpen] = useState(false);
  const [tTitle, setTTitle] = useState('');
  const [tCategory, setTCategory] = useState('DSA');
  const [tDuration, setTDuration] = useState(30);
  const [tTotalMarks, setTTotalMarks] = useState(50);
  const [selectedQIds, setSelectedQIds] = useState([]); // Array of question IDs in test

  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, qRes, testsRes] = await Promise.all([
        api.get('/api/analytics/admin/stats'),
        api.get('/api/questions'),
        api.get('/api/tests')
      ]);
      setStats(statsRes.data);
      setQuestions(qRes.data);
      setTests(testsRes.data);
    } catch (err) {
      console.error("Failed to load administrative details: ", err);
      setError("Administrative authorization failed. Only administrators are allowed to access this center.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleQDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await api.delete(`/api/questions/${id}`);
        setQuestions(prev => prev.filter(q => q.id !== id));
        alert("Question deleted successfully!");
      } catch (err) {
        console.error("Delete question failed: ", err);
      }
    }
  };

  const handleQSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: qTitle,
      description: qDescription,
      difficulty: qDifficulty,
      topic: qTopic,
      category: qCategory,
      tags: qTags,
      company_tags: qCompanyTags,
      solution: qSolution,
      explanation: qExplanation,
      time_complexity: qTimeComp,
      space_complexity: qSpaceComp
    };

    try {
      if (editingQ) {
        // Update Question
        const res = await api.put(`/api/questions/${editingQ.id}`, payload);
        setQuestions(prev => prev.map(q => q.id === editingQ.id ? res.data : q));
        alert("Question updated successfully!");
      } else {
        // Create Question
        const res = await api.post('/api/questions', payload);
        setQuestions(prev => [res.data, ...prev]);
        alert("Question created successfully!");
      }
      resetQForm();
    } catch (err) {
      console.error("Save question failed: ", err);
      alert("Error occurred while saving question.");
    }
  };

  const loadQEditForm = (q) => {
    setEditingQ(q);
    setQTitle(q.title);
    setQDescription(q.description);
    setQDifficulty(q.difficulty);
    setQTopic(q.topic);
    setQCategory(q.category);
    setQTags(q.tags || '');
    setQCompanyTags(q.company_tags || '');
    setQSolution(q.solution || '');
    setQExplanation(q.explanation || '');
    setQTimeComp(q.time_complexity || '');
    setQSpaceComp(q.space_complexity || '');
    setIsQModalOpen(true);
  };

  const resetQForm = () => {
    setEditingQ(null);
    setQTitle('');
    setQDescription('');
    setQDifficulty('Easy');
    setQTopic('');
    setQCategory('DSA');
    setQTags('');
    setQCompanyTags('');
    setQSolution('');
    setQExplanation('');
    setQTimeComp('');
    setQSpaceComp('');
    setIsQModalOpen(false);
  };

  const handleTSubmit = async (e) => {
    e.preventDefault();
    if (selectedQIds.length === 0) {
      alert("Please select at least one question to link to this test quiz.");
      return;
    }

    const testQuestions = selectedQIds.map(qId => ({
      question_id: qId,
      weight: 10 // Equal weights of 10 points default
    }));

    const payload = {
      title: tTitle,
      category: tCategory,
      duration_minutes: parseInt(tDuration),
      total_marks: parseInt(tTotalMarks),
      questions: testQuestions
    };

    try {
      const res = await api.post('/api/tests', payload);
      setTests(prev => [res.data, ...prev]);
      alert("Mock quiz created successfully!");
      resetTForm();
    } catch (err) {
      console.error("Save test failed: ", err);
      alert("Error occurred while creating test assessment.");
    }
  };

  const toggleQSelect = (qId) => {
    setSelectedQIds(prev => 
      prev.includes(qId) 
        ? prev.filter(id => id !== qId) 
        : [...prev, qId]
    );
  };

  const resetTForm = () => {
    setTTitle('');
    setTCategory('DSA');
    setTDuration(30);
    setTTotalMarks(50);
    setSelectedQIds([]);
    setIsTModalOpen(false);
  };

  if (loading) {
    return <LoadingSpinner message="Entering administrative center..." />;
  }

  if (error) {
    return (
      <div className="glass-panel p-16 rounded-lg text-center space-y-4 max-w-md mx-auto my-12">
        <AlertCircle size={48} className="text-rose-500 mx-auto" />
        <h3 className="text-xs font-bold text-slate-700">Unauthorized Access</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Admin Stat summary card list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.total_users || 0}
          icon={Users}
          description={`${stats?.students || 0} Students & ${stats?.admins || 0} Admins`}
          color="indigo"
        />
        <StatCard
          title="Questions Added"
          value={stats?.total_questions || 0}
          icon={BookOpen}
          description="Active practice bank questions"
          color="emerald"
        />
        <StatCard
          title="Tests Created"
          value={stats?.total_tests || 0}
          icon={Trophy}
          description="Mock exams generated"
          color="amber"
        />
        <StatCard
          title="Active Students (7d)"
          value={stats?.active_users_7d || 0}
          icon={ShieldCheck}
          description="Active learning sessions"
          color="rose"
        />
      </div>

      {/* Tabs controllers */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-2 text-[11px] font-semibold">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === 'questions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Manage Questions
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === 'tests' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Manage Mock Tests
          </button>
        </div>

        {activeTab === 'questions' ? (
          <button
            onClick={() => setIsQModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs transition-all font-semibold"
          >
            <Plus size={14} />
            <span>Add Question</span>
          </button>
        ) : (
          <button
            onClick={() => setIsTModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs transition-all font-semibold"
          >
            <Plus size={14} />
            <span>Create Mock Test</span>
          </button>
        )}
      </div>

      {/* List panels */}
      {activeTab === 'questions' && (
        <div className="glass-panel rounded-lg overflow-hidden border border-slate-200 shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/30 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Problem Title</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Topic</th>
                <th className="py-4 px-4 w-28 text-center">Difficulty</th>
                <th className="py-4 px-6 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkBorder text-slate-700 text-xs">
              {questions.map((q) => (
                <tr key={q.id} className="hover:bg-slate-100/20 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-800">{q.title}</td>
                  <td className="py-4 px-4">{q.category}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300/60 text-slate-700 text-xs">
                      {q.topic}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                      q.difficulty.toLowerCase() === 'easy' 
                        ? 'text-emerald-600 border-emerald-500/20 bg-emerald-50' 
                        : q.difficulty.toLowerCase() === 'medium' 
                        ? 'text-amber-600 border-amber-500/20 bg-amber-50' 
                        : 'text-rose-600 border-rose-500/20 bg-rose-50'
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center flex items-center justify-center gap-3 pt-4.5">
                    <button
                      onClick={() => loadQEditForm(q)}
                      className="text-slate-600 hover:text-indigo-600"
                      title="Edit question details"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleQDelete(q.id)}
                      className="text-slate-600 hover:text-rose-600"
                      title="Delete question"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'tests' && (
        <div className="glass-panel rounded-lg overflow-hidden border border-slate-200 shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/30 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Mock Exam Name</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4 text-center w-36">Duration</th>
                <th className="py-4 px-4 text-center w-36">Total Marks</th>
                <th className="py-4 px-6 text-center w-36">Questions Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkBorder text-slate-700 text-xs">
              {tests.map((t) => (
                <tr key={t.id} className="hover:bg-slate-100/20 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-800">{t.title}</td>
                  <td className="py-4 px-4">{t.category}</td>
                  <td className="py-4 px-4 text-center text-slate-600">{t.duration_minutes} Mins</td>
                  <td className="py-4 px-4 text-center font-semibold text-slate-800">{t.total_marks} Pts</td>
                  <td className="py-4 px-6 text-center text-indigo-600 font-bold">{t.questions?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal 1: Add/Edit Question */}
      {isQModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-darkCard border border-slate-200 rounded-lg p-4 shadow-glass space-y-4 animate-scaleUp my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {editingQ ? 'Edit Challenge Question' : 'Add Challenge Question'}
              </h3>
              <button onClick={resetQForm} className="text-slate-500 hover:text-slate-900">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleQSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Question Title</label>
                  <input
                    type="text"
                    required
                    value={qTitle}
                    onChange={(e) => setQTitle(e.target.value)}
                    placeholder="e.g. Reverse Linked List"
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Difficulty</label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-white focus:outline-none focus:border-indigo-600 appearance-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Category</label>
                  <select
                    value={qCategory}
                    onChange={(e) => setQCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-white focus:outline-none focus:border-indigo-600 appearance-none"
                  >
                    <option value="DSA">DSA</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="SQL">SQL</option>
                    <option value="Core Subjects">Core Subjects</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Topic Area</label>
                  <input
                    type="text"
                    required
                    value={qTopic}
                    onChange={(e) => setQTopic(e.target.value)}
                    placeholder="e.g. Arrays, Joins, OOP"
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={qTags}
                    onChange={(e) => setQTags(e.target.value)}
                    placeholder="e.g. Linked List, Recursion"
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Company Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={qCompanyTags}
                    onChange={(e) => setQCompanyTags(e.target.value)}
                    placeholder="e.g. Amazon, Google, TCS"
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Problem Description (Text/Markdown)</label>
                <textarea
                  required
                  rows={4}
                  value={qDescription}
                  onChange={(e) => setQDescription(e.target.value)}
                  placeholder="Describe the question guidelines here..."
                  className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Time Complexity (optional)</label>
                  <input
                    type="text"
                    value={qTimeComp}
                    onChange={(e) => setQTimeComp(e.target.value)}
                    placeholder="O(N)"
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Space Complexity (optional)</label>
                  <input
                    type="text"
                    value={qSpaceComp}
                    onChange={(e) => setQSpaceComp(e.target.value)}
                    placeholder="O(1)"
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Reference Solution Code / Text</label>
                <textarea
                  rows={3}
                  value={qSolution}
                  onChange={(e) => setQSolution(e.target.value)}
                  placeholder="def solve(head): ..."
                  className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 font-mono resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Logical Explanation</label>
                <textarea
                  rows={2}
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="Explain the step-by-step logic here..."
                  className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-slate-900 transition-all shadow-brand"
              >
                {editingQ ? 'Save Changes' : 'Publish Question'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Create Mock Test */}
      {isTModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-darkCard border border-slate-200 rounded-lg p-4 shadow-glass space-y-4 animate-scaleUp my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Create Timed Mock Quiz</h3>
              <button onClick={resetTForm} className="text-slate-500 hover:text-slate-900">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleTSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Assessment Name</label>
                  <input
                    type="text"
                    required
                    value={tTitle}
                    onChange={(e) => setTTitle(e.target.value)}
                    placeholder="e.g. TCS CodeVita Mixed Mock"
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Category</label>
                  <select
                    value={tCategory}
                    onChange={(e) => setTCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-white focus:outline-none focus:border-indigo-600 appearance-none"
                  >
                    <option value="DSA">DSA</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="SQL">SQL</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={tDuration}
                    onChange={(e) => setTDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Total Marks</label>
                  <input
                    type="number"
                    required
                    value={tTotalMarks}
                    onChange={(e) => setTTotalMarks(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Select questions block */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-700">Link Questions to Test ({selectedQIds.length} Selected)</label>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-darkBorder bg-slate-50/35">
                  {questions.map(q => {
                    const isChecked = selectedQIds.includes(q.id);
                    return (
                      <div 
                        key={q.id}
                        onClick={() => toggleQSelect(q.id)}
                        className={`p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition-colors ${
                          isChecked ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-700'
                        }`}
                      >
                        <span className="font-semibold">{q.title} ({q.category} - {q.topic})</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-600'
                        }`}>
                          {isChecked && <span className="text-sm font-bold">✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-slate-900 transition-all shadow-brand"
              >
                Assemble & Publish Mock Test
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
