import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Ship, BookOpen, FileText, Bot, Sparkles, Code, 
  ChevronDown, ArrowRight, CheckCircle2, ShieldCheck 
} from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  // If user is already logged in, redirect them to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What is PrepBoat AI?",
      a: "PrepBoat AI is an all-in-one career readiness and technical interview preparation platform. It helps engineering students and developers master Data Structures & Algorithms (DSA), optimize their resumes using AI, practice live coding in an interactive sandbox, and prepare for top product company interviews."
    },
    {
      q: "How does the DSA Practice Bank work?",
      a: "Our Practice Bank features over 560+ highly curated coding challenges ranging from Easy to Hard difficulties. You can write your solutions in multiple programming languages, run test cases directly in the browser sandbox, and receive instant evaluation and optimized code explanations."
    },
    {
      q: "How does the AI Resume optimization work?",
      a: "The AI Resume Analyzer scans your resume format, structural metrics, and bullet points. It translates your project and work descriptions using the Google-recommended XYZ formula ('Accomplished [X] as measured by [Y], by doing [Z]') to ensure 100% compatibility with Applicant Tracking Systems (ATS)."
    },
    {
      q: "Is PrepBoat AI free to use?",
      a: "Yes! PrepBoat AI is designed to support students in their placement journeys. The practice platform, interactive coding compiler, and core prep roadmaps are completely free to access."
    },
    {
      q: "Are the mock interviews tailored to specific companies?",
      a: "Absolutely. PrepBoat AI generates realistic mock interviews based on real hiring patterns from top tech companies like Cisco, Accenture, TCS, and Walmart. The AI adapts behavioral and technical prompts based on your targeted job role."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/20 text-indigo-400">
                <Ship size={24} />
              </div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                PrepBoat <span className="text-xs bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30">AI</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-20 lg:py-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20"></div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/60 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-400">
            <Sparkles size={13} />
            <span>AI-Driven Placement Readiness Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Sail Through Your Tech <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">
              Interviews With Confidence
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Master Data Structures & Algorithms, optimize your resume to beat the ATS filters, and practice realistic company mock interviews using our intelligent preparation workspace.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <Link 
              to="/register" 
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Start Preparing Free</span>
              <ArrowRight size={16} />
            </Link>
            <Link 
              to="/login" 
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold rounded-lg transition-colors"
            >
              Go to Workspace
            </Link>
          </div>
        </div>
      </header>

      {/* Core Features Grid */}
      <section className="py-20 bg-slate-950/50 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Structured Coding & Placement Modules</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Explore our core preparation features built to take you from a coding beginner to land your target software engineering role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-6 hover:border-indigo-500/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <BookOpen size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">560+ DSA Problems</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Practice highly curated, company-specific coding questions organized by topic difficulty, arrays, trees, dynamic programming, and graphs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-6 hover:border-purple-500/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-600/10 border border-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-5 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <FileText size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Resume Review</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Analyze and rewrite your resume bullet points into Google's metrics-driven XYZ formatting to pass automated recruitment filters.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-6 hover:border-emerald-500/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Bot size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Interactive Coding</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Compile and run your code solutions live inside a browser-based container compiler supporting multiple languages.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-6 hover:border-rose-500/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-rose-600/10 border border-rose-500/20 rounded-lg flex items-center justify-center text-rose-400 mb-5 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <Sparkles size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Mock Interview Gen</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Take simulated AI mock interviews tailored for major companies (Accenture, Cisco, TCS, Walmart) to improve communication skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Statistics */}
      <section className="py-16 border-t border-slate-900 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-indigo-400">560+</p>
              <p className="text-slate-400 text-xs mt-1 uppercase font-semibold tracking-wider">Curated DSA Questions</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-purple-400">Under 3s</p>
              <p className="text-slate-400 text-xs mt-1 uppercase font-semibold tracking-wider">AI Solution Compilation</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-emerald-400">100%</p>
              <p className="text-slate-400 text-xs mt-1 uppercase font-semibold tracking-wider">ATS Compatible Resumes</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-amber-400">Free</p>
              <p className="text-slate-400 text-xs mt-1 uppercase font-semibold tracking-wider">Lifetime Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-xs mt-2">Get answers to the most common queries about the PrepBoat AI prep platform.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-slate-900/40 border border-slate-900 rounded-lg overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-sm text-slate-100 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-slate-400 transition-transform ${openFaq === index ? 'rotate-180 text-indigo-400' : ''}`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 pt-1 border-t border-slate-900/50 text-xs text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-16 bg-slate-950 border-t border-slate-900 text-center relative overflow-hidden mt-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Ready to Level Up Your Placement Prep?</h2>
          <p className="text-slate-400 text-xs max-w-lg mx-auto leading-relaxed">
            Create a free account, start solving DSA problems immediately, and create your optimized resume.
          </p>
          <div className="pt-2">
            <Link 
              to="/register" 
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all inline-flex items-center gap-2 text-sm"
            >
              <span>Get Started Free</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Legal Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>PrepBoat AI © {new Date().getFullYear()}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
