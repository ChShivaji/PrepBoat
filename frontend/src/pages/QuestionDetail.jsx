import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  ArrowLeft, CheckCircle, Clock, Info, Code, Play, 
  HelpCircle, CheckCircle2, Bookmark, BookmarkCheck,
  ChevronUp, ChevronDown, Terminal, Check, X, AlertTriangle, RefreshCw, Sparkles
} from 'lucide-react';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [solved, setSolved] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'solution'
  
  // New Workspace state variables
  const [selectedLang, setSelectedLang] = useState('python');
  const [solutionLang, setSolutionLang] = useState('python');
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState('testcase'); // 'testcase', 'result'
  const [executing, setExecuting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [generatingSolution, setGeneratingSolution] = useState(false);

  // Timer hook
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGenerateSolutionBackground = async (qid) => {
    setGeneratingSolution(true);
    try {
      const res = await api.post(`/api/questions/${qid}/solution/generate`);
      setQuestion(res.data);
      let parsed = {};
      if (res.data.solutions_json) {
        try {
          parsed = JSON.parse(res.data.solutions_json);
        } catch (e) {}
      }
      const langs = Object.keys(parsed);
      if (langs.length > 0) {
        setSolutionLang(langs[0]);
      }
    } catch (err) {
      console.error("Backend background generation failed:", err);
    } finally {
      setGeneratingSolution(false);
    }
  };

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/questions/${id}`);
      setQuestion(res.data);
      setSolved(res.data.is_solved);
      
      // Seed default language & code
      const category = res.data.category;
      let defaultLang = 'python';
      
      if (category === 'SQL') {
        defaultLang = 'sql';
      }
      
      setSelectedLang(defaultLang);
      setSolutionLang(defaultLang);

      // Parse starters
      let starters = {};
      if (res.data.starters_json) {
        try {
          starters = JSON.parse(res.data.starters_json);
        } catch (e) {
          console.error("Error parsing starters_json:", e);
        }
      }

      if (starters[defaultLang]) {
        setCode(starters[defaultLang]);
      } else {
        if (category === 'SQL') {
          setCode('-- Write your SQL query here\nSELECT * FROM ...');
        } else {
          setCode('# Write your Python code here\n');
        }
      }

      // Check if solutions_json is missing, and if so trigger auto-generation in background
      let parsed = {};
      if (res.data.solutions_json) {
        try {
          parsed = JSON.parse(res.data.solutions_json);
        } catch (e) {}
      }
      const langs_needed = ['python', 'cpp', 'java', 'javascript'];
      if (category === 'SQL') langs_needed.push('sql');
      const has_all = langs_needed.every(l => parsed[l] && parsed[l].trim());
      if (!has_all || !res.data.solution) {
        handleGenerateSolutionBackground(res.data.id);
      }
    } catch (err) {
      console.error("Failed to load question details: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSolution = async () => {
    if (!question) return;
    setGeneratingSolution(true);
    try {
      const res = await api.post(`/api/questions/${id}/solution/generate`);
      setQuestion(res.data);
      let parsed = {};
      if (res.data.solutions_json) {
        try {
          parsed = JSON.parse(res.data.solutions_json);
        } catch (e) {}
      }
      const langs = Object.keys(parsed);
      if (langs.length > 0) {
        setSolutionLang(langs[0]);
      }
    } catch (err) {
      console.error("Backend generation failed:", err);
      alert("Unable to generate solutions via AI right now. Please make sure the backend server is running and connected.");
    } finally {
      setGeneratingSolution(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    if (question && question.starters_json) {
      try {
        const starters = JSON.parse(question.starters_json);
        if (starters[lang]) {
          setCode(starters[lang]);
          return;
        }
      } catch (e) {
        console.error("Error loading starter code:", e);
      }
    }
    // Fallbacks
    if (lang === 'sql') {
      setCode('-- Write your SQL query here\nSELECT * FROM ...');
    } else if (lang === 'python') {
      setCode('# Write your Python code here\n');
    } else if (lang === 'javascript') {
      setCode('// Write your JavaScript code here\n');
    } else if (lang === 'java') {
      setCode('// Write your Java code here\n');
    } else if (lang === 'cpp') {
      setCode('// Write your C++ code here\n');
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      const newState = !question.is_bookmarked;
      await api.post(`/api/questions/${id}/bookmark`, { bookmarked: newState });
      setQuestion(prev => ({ ...prev, is_bookmarked: newState }));
    } catch (err) {
      console.error("Failed to update bookmark status: ", err);
    }
  };

  const handleRunCode = async () => {
    if (!question) return;
    setExecuting(true);
    setConsoleOpen(true);
    setActiveConsoleTab('result');
    setRunResults(null);
    setSelectedCaseIdx(0);
    try {
      const res = await api.post(`/api/questions/${id}/run`, {
        language: selectedLang,
        code: code
      });
      setRunResults(res.data);
    } catch (err) {
      console.error("Run code failed:", err);
      setRunResults({
        success: false,
        total_tests: 0,
        passed_tests: 0,
        results: [],
        compile_error: err.response?.data?.detail || "Connection error. Failed to run code."
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmit = async () => {
    if (!question) return;
    setExecuting(true);
    setConsoleOpen(true);
    setActiveConsoleTab('result');
    setRunResults(null);
    setSelectedCaseIdx(0);
    try {
      const res = await api.post(`/api/questions/${id}/solve`, {
        status: 'solved',
        time_spent: seconds,
        code: code,
        language: selectedLang
      });
      
      if (res.data.success) {
        setSolved(true);
        setQuestion(prev => ({ ...prev, is_solved: true }));
        setRunResults({
          success: true,
          total_tests: question.test_cases ? (JSON.parse(question.test_cases).length || 1) : 1,
          passed_tests: question.test_cases ? (JSON.parse(question.test_cases).length || 1) : 1,
          results: [],
          compile_error: null,
          is_submit: true,
          message: "All test cases passed! Solution marked as resolved."
        });
      } else {
        // Failed test cases returned in res.data.results
        setRunResults({
          ...res.data.results,
          is_submit: true
        });
      }
    } catch (err) {
      console.error("Submit failed:", err);
      setRunResults({
        success: false,
        total_tests: 0,
        passed_tests: 0,
        results: [],
        compile_error: err.response?.data?.detail || "Connection error. Failed to submit."
      });
    } finally {
      setExecuting(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Safe JSON Parsing of solutions and starters
  let parsedSolutions = {};
  if (question && question.solutions_json) {
    try {
      parsedSolutions = JSON.parse(question.solutions_json);
    } catch (e) {
      console.error("Failed to parse solutions_json", e);
    }
  }

  let parsedTestCases = [];
  if (question && question.test_cases) {
    try {
      parsedTestCases = JSON.parse(question.test_cases);
    } catch (e) {
      console.error("Failed to parse test_cases", e);
    }
  }

  const hasCodeExecution = question && (question.category === 'DSA' || question.category === 'SQL');

  if (loading) {
    return <LoadingSpinner message="Opening coding terminal..." />;
  }

  if (!question) {
    return (
      <div className="glass-panel p-16 rounded-lg text-center space-y-4">
        <HelpCircle size={48} className="text-slate-500 mx-auto" />
        <h3 className="text-sm font-semibold text-slate-700">Question Not Found</h3>
        <Link to="/practice" className="text-indigo-600 font-semibold hover:underline">
          Return to Practice Bank
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden space-y-4">
      {/* Top Header bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <Link 
            to={`/practice?category=${question.category}`} 
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            <ArrowLeft size={14} />
          </Link>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{question.title}</h3>
            <p className="text-[10px] text-indigo-600 font-medium">{question.category} &bull; {question.topic}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Active Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono text-xs select-none">
            <Clock size={14} className="text-indigo-600" />
            <span>{formatTime(seconds)}</span>
          </div>

          {/* Bookmark */}
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-lg border transition-all ${
              question.is_bookmarked 
                ? 'bg-amber-50 border-amber-500/20 text-amber-600' 
                : 'border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {question.is_bookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          </button>
        </div>
      </div>

      {/* Main Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        
        {/* Left Side: Description Panel */}
        <div className="glass-panel rounded-lg flex flex-col min-h-0 overflow-hidden border border-slate-200">
          
          {/* Tab selectors */}
          <div className="flex border-b border-slate-200 bg-slate-100/30 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-all ${
                activeTab === 'description' 
                  ? 'border-indigo-500 text-indigo-600 bg-slate-100/10' 
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              <Info size={13} />
              <span>Description</span>
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-all ${
                activeTab === 'solution' 
                  ? 'border-indigo-500 text-indigo-600 bg-slate-100/10' 
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              <Code size={13} />
              <span>Reference Solution</span>
            </button>
          </div>

          {/* Tab Contents Viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'description' && (
              <div className="space-y-4">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    question.difficulty.toLowerCase() === 'easy' 
                      ? 'text-emerald-600 bg-emerald-50 border-emerald-500/20' 
                      : question.difficulty.toLowerCase() === 'medium' 
                      ? 'text-amber-600 bg-amber-50 border-amber-500/20' 
                      : 'text-rose-600 bg-rose-50 border-rose-500/20'
                  }`}>
                    {question.difficulty}
                  </span>

                  {question.time_complexity && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                      Time: {question.time_complexity}
                    </span>
                  )}
                  {question.space_complexity && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                      Space: {question.space_complexity}
                    </span>
                  )}

                  {solved && (
                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] flex items-center gap-1 font-bold border border-emerald-500/20">
                      <CheckCircle size={10} fill="currentColor" className="text-emerald-950" />
                      <span>Solved</span>
                    </span>
                  )}
                </div>

                {/* Problem description text */}
                <div className="prose prose-invert max-w-none text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                  {question.description}
                </div>

                {/* Companies block */}
                {question.company_tags && (
                  <div className="space-y-2 border-t border-slate-200 pt-4">
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Frequently Asked At</p>
                    <div className="flex flex-wrap gap-2">
                      {question.company_tags.split(',').map(c => (
                        <span key={c} className="px-2.5 py-1 rounded bg-indigo-500/5 text-indigo-600 border border-indigo-500/15 text-[10px] font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'solution' && (
              <div className="space-y-4">
                {generatingSolution ? (
                  <div className="flex flex-col items-center justify-center p-4 space-y-4 border border-slate-200 rounded-lg bg-slate-100/10">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-500/20 text-indigo-600 flex items-center justify-center">
                      <RefreshCw size={22} className="animate-spin" />
                    </div>
                    <div className="text-center space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 font-sans">AI Mentor Writing Solutions...</h4>
                      <p className="text-[10px] text-slate-600 max-w-xs leading-normal">
                        Rudra is collecting and compiling optimized solutions in Python, C++, Java, JavaScript, and SQL.
                      </p>
                    </div>
                  </div>
                ) : (Object.keys(parsedSolutions).length > 0 || question.solution) ? (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Solution code</p>
                      
                      {/* Language Selector Dropdown inside solution view */}
                      {Object.keys(parsedSolutions).length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">Language:</span>
                          <select
                            value={solutionLang}
                            onChange={(e) => setSolutionLang(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-700 focus:outline-none focus:border-indigo-500"
                          >
                            {Object.keys(parsedSolutions).map(lang => (
                              <option key={lang} value={lang}>
                                {lang === 'cpp' ? 'C++' : lang === 'java' ? 'Java' : lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python 3' : lang.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <pre className="p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-emerald-600 overflow-x-auto select-all max-h-[350px]">
                        {parsedSolutions[solutionLang] || question.solution}
                      </pre>
                    </div>

                    {question.explanation && (
                      <div className="space-y-2 border-t border-slate-200 pt-4">
                        <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Concept Explanation</p>
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{question.explanation}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 space-y-4 border border-slate-200 rounded-lg bg-slate-100/10">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-500/20 text-indigo-600 flex items-center justify-center">
                      <Sparkles size={22} className="animate-pulse" />
                    </div>
                    <div className="text-center space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">No Solution Cached</h4>
                      <p className="text-[10px] text-slate-600 max-w-xs leading-normal">
                        This question does not have a reference solution cached. Click below to generate standard solutions in Python, C++, Java, and JavaScript.
                      </p>
                    </div>
                    <button
                      onClick={handleGenerateSolution}
                      disabled={generatingSolution}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-slate-900 font-bold text-xs shadow-md disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                    >
                      {generatingSolution ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          <span>Generating Solutions...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} fill="currentColor" />
                          <span>Generate Reference Solutions (AI)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Code Editor Workspace */}
        <div className="glass-panel rounded-lg flex flex-col min-h-0 overflow-hidden border border-slate-200 relative">
          
          {/* Editor Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-slate-100/30 text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Terminal size={14} className="text-indigo-600" />
              <span>Workspace Console</span>
            </span>

            {/* Language Selector for Code Executor */}
            {hasCodeExecution ? (
              <select
                value={selectedLang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-700 font-semibold focus:outline-none focus:border-indigo-500"
              >
                {question.category === 'SQL' ? (
                  <option value="sql">SQL (SQLite)</option>
                ) : (
                  <>
                    <option value="python">Python 3</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java (Simulated)</option>
                    <option value="cpp">C++ (Simulated)</option>
                  </>
                )}
              </select>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">Scratchpad / Notes</span>
            )}
          </div>

          {/* Code Textarea Input */}
          <div className="flex-1 relative min-h-0">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 bg-slate-50/80 text-slate-800 font-mono text-[12px] leading-relaxed resize-none focus:outline-none focus:ring-0 select-text border-0"
              spellCheck="false"
              placeholder={hasCodeExecution ? "// Write your code here..." : "Use this workspace as a notepad to scratch your thoughts..."}
            />
          </div>

          {/* Test Case / Results Console Panel */}
          {hasCodeExecution && consoleOpen && (
            <div className="border-t border-slate-200 bg-slate-50 flex flex-col h-72 min-h-[18rem] z-10 animate-in slide-in-from-bottom duration-200">
              
              {/* Console Navigation */}
              <div className="flex items-center justify-between px-4 border-b border-slate-200 bg-slate-100/50">
                <div className="flex gap-4 text-xs font-semibold">
                  <button 
                    onClick={() => setActiveConsoleTab('testcase')}
                    className={`py-2.5 border-b-2 transition-all ${
                      activeConsoleTab === 'testcase' ? 'border-indigo-400 text-indigo-600' : 'border-transparent text-slate-600'
                    }`}
                  >
                    Testcase
                  </button>
                  <button 
                    onClick={() => setActiveConsoleTab('result')}
                    className={`py-2.5 border-b-2 transition-all ${
                      activeConsoleTab === 'result' ? 'border-indigo-400 text-indigo-600' : 'border-transparent text-slate-600'
                    }`}
                  >
                    Test Results
                  </button>
                </div>
                <button 
                  onClick={() => setConsoleOpen(false)} 
                  className="p-1 rounded text-slate-500 hover:text-slate-900"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Console Content */}
              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-700">
                {activeConsoleTab === 'testcase' ? (
                  <div className="space-y-4">
                    {parsedTestCases.length > 0 ? (
                      parsedTestCases.map((tc, idx) => (
                        <div key={idx} className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200/40">
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Case {idx + 1}</p>
                          <p className="text-slate-700"><span className="text-slate-500">Input:</span> {JSON.stringify(tc.input)}</p>
                          <p className="text-slate-700"><span className="text-slate-500">Expected:</span> {JSON.stringify(tc.output)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 italic">No structured test cases configured for this question.</p>
                    )}
                  </div>
                ) : (
                  // Test Results Tab
                  <div className="h-full">
                    {executing ? (
                      <div className="flex flex-col items-center justify-center h-full space-y-2 text-indigo-600">
                        <RefreshCw size={24} className="animate-spin" />
                        <span className="text-slate-600 text-[11px]">Compiling & running test cases on backend...</span>
                      </div>
                    ) : runResults ? (
                      runResults.compile_error ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                            <AlertTriangle size={14} />
                            <span>Compilation / Syntax Error</span>
                          </div>
                          <pre className="p-3 bg-rose-500/5 text-rose-300 border border-rose-500/20 rounded-lg overflow-x-auto text-[11px] whitespace-pre-wrap leading-relaxed">
                            {runResults.compile_error}
                          </pre>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Run Status Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200/50">
                            <div className="flex items-center gap-2">
                              {runResults.success ? (
                                <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                                  <Check size={16} strokeWidth={3} />
                                  <span>{runResults.is_submit ? "Success / Accepted" : "Accepted"}</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-rose-600 font-bold text-sm">
                                  <X size={16} strokeWidth={3} />
                                  <span>Wrong Answer</span>
                                </span>
                              )}
                              <span className="text-slate-500 text-[10px]">
                                ({runResults.passed_tests}/{runResults.total_tests} test cases passed)
                              </span>
                            </div>
                            
                            {runResults.message && (
                              <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                                {runResults.message}
                              </span>
                            )}
                          </div>

                          {/* Testcase Cases Selector */}
                          {runResults.results && runResults.results.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex gap-2 overflow-x-auto pb-1">
                                {runResults.results.map((res, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedCaseIdx(idx)}
                                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                                      selectedCaseIdx === idx
                                        ? 'bg-slate-100 border-indigo-500 text-white'
                                        : res.status === 'passed'
                                        ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 hover:bg-emerald-50'
                                        : 'bg-rose-500/5 border-rose-500/10 text-rose-600 hover:bg-rose-50'
                                    }`}
                                  >
                                    <span>Case {idx + 1}</span>
                                    {res.status === 'passed' ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
                                  </button>
                                ))}
                              </div>

                              {/* Selected Case Detail */}
                              {runResults.results[selectedCaseIdx] && (
                                <div className="space-y-3 bg-slate-100/30 p-3 rounded-lg border border-slate-200/40">
                                  {/* Input */}
                                  <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Input</p>
                                    <pre className="mt-0.5 text-slate-700 font-mono text-[11px]">{runResults.results[selectedCaseIdx].input}</pre>
                                  </div>
                                  
                                  {/* Output & Expected */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-[10px] text-slate-500 font-bold uppercase">Actual Output</p>
                                      <pre className={`mt-0.5 font-mono text-[11px] ${
                                        runResults.results[selectedCaseIdx].status === 'passed' ? 'text-emerald-600' : 'text-rose-600 font-bold'
                                      }`}>
                                        {runResults.results[selectedCaseIdx].actual || 'None/Error'}
                                      </pre>
                                    </div>
                                    <div>
                                      <p className="text-[10px] text-slate-500 font-bold uppercase">Expected Output</p>
                                      <pre className="mt-0.5 text-emerald-600 font-mono text-[11px]">{runResults.results[selectedCaseIdx].expected}</pre>
                                    </div>
                                  </div>

                                  {/* Stdout / Stderr logs */}
                                  {runResults.results[selectedCaseIdx].stdout && (
                                    <div className="border-t border-slate-200/30 pt-2">
                                      <p className="text-[10px] text-slate-500 font-bold uppercase">Console Stdout</p>
                                      <pre className="mt-0.5 text-slate-600 text-[10px] whitespace-pre-wrap">{runResults.results[selectedCaseIdx].stdout}</pre>
                                    </div>
                                  )}

                                  {runResults.results[selectedCaseIdx].stderr && (
                                    <div className="border-t border-slate-200/30 pt-2">
                                      <p className="text-[10px] text-rose-500 font-bold uppercase">Error Logs</p>
                                      <pre className="mt-0.5 text-rose-300 text-[10px] whitespace-pre-wrap bg-rose-500/5 p-2 rounded border border-rose-500/10">{runResults.results[selectedCaseIdx].stderr}</pre>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    ) : (
                      <p className="text-slate-500 italic flex items-center gap-1">
                        <Info size={13} />
                        <span>Write your code and run tests to see results.</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Workspace Footer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-100/50 flex items-center justify-between gap-4">
            
            {/* Left console toggle button */}
            {hasCodeExecution ? (
              <button
                onClick={() => setConsoleOpen(!consoleOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white transition-all"
              >
                <span>Console</span>
                {consoleOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            ) : (
              <span className="text-[10px] text-slate-500 italic">Self-evaluate conceptual questions</span>
            )}

            {/* Right Execution & Submit Buttons */}
            <div className="flex items-center gap-2">
              {hasCodeExecution && (
                <button
                  onClick={handleRunCode}
                  disabled={executing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200 hover:text-slate-900 hover:bg-white disabled:opacity-50 transition-all"
                >
                  <Play size={12} fill="currentColor" />
                  <span>Run Code</span>
                </button>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={executing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-900 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all hover:shadow-brand"
              >
                <CheckCircle2 size={14} />
                <span>Submit Solution</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuestionDetail;
