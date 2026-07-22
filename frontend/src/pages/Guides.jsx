import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { guidesData } from '../data/guidesData';
import AdSenseScript from '../components/AdSenseScript';
import { BookOpen, Clock, Tag, ArrowRight, Search, Ship } from 'lucide-react';

const Guides = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const allTags = ['All', ...new Set(guidesData.flatMap(g => g.tags))];

  const filteredGuides = guidesData.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          g.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || g.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      <AdSenseScript />

      {/* Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/20 text-indigo-400">
                <Ship size={24} />
              </div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                PrepBoat <span className="text-xs bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30">AI</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="py-16 bg-slate-950/60 border-b border-slate-900 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/60 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-400">
            <BookOpen size={13} />
            <span>Placement & Technical Interview Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Software Engineering <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Prep Guides</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            In-depth technical guides, algorithm pattern breakdowns, resume strategy tips, and company interview roadmaps.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto pt-4">
            <div className="relative">
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles & topics..."
                className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
              <Search size={18} className="absolute left-4 top-3.5 text-slate-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Category Tags */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center gap-2 justify-center">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedTag === tag 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredGuides.map(guide => (
            <article 
              key={guide.slug}
              className="bg-slate-900/40 border border-slate-850 hover:border-indigo-500/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group hover:shadow-2xl hover:shadow-indigo-500/5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="px-2.5 py-1 bg-indigo-950/60 border border-indigo-500/20 text-indigo-400 font-semibold rounded-md">
                    {guide.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>{guide.readTime}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                  <Link to={`/guides/${guide.slug}`}>
                    {guide.title}
                  </Link>
                </h2>

                <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                  {guide.summary}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag size={13} className="text-slate-500" />
                  <div className="flex gap-1.5">
                    {guide.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80 text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <Link 
                  to={`/guides/${guide.slug}`} 
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-1 transition-all"
                >
                  <span>Read Article</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-600 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>PrepBoat AI © {new Date().getFullYear()}. Educational Resource Hub.</p>
          <div className="flex gap-4">
            <Link to="/guides" className="text-slate-400 hover:text-white transition-colors">Guides</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Guides;
