import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { guidesData } from '../data/guidesData';
import AdSenseScript from '../components/AdSenseScript';
import { Ship, Clock, ArrowLeft, Calendar, Tag, BookOpen, Share2 } from 'lucide-react';

const GuideDetail = () => {
  const { slug } = useParams();
  const guide = guidesData.find(g => g.slug === slug);

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  // Quick parser to render Markdown headers, code blocks, lists and bold text safely
  const renderContent = (contentStr) => {
    const lines = contentStr.trim().split('\n');
    let elements = [];
    let inCodeBlock = false;
    let codeContent = [];
    let listItems = [];

    lines.forEach((line, idx) => {
      // Code block toggle
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${idx}`} className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-xs text-indigo-300 overflow-x-auto my-4">
              <code>{codeContent.join('\n')}</code>
            </pre>
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(<h1 key={idx} className="text-2xl sm:text-3xl font-extrabold text-white mt-8 mb-4 tracking-tight">{line.replace('# ', '')}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={idx} className="text-xl sm:text-2xl font-bold text-white mt-8 mb-3 tracking-tight border-b border-slate-850 pb-2">{line.replace('## ', '')}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={idx} className="text-lg font-bold text-indigo-400 mt-6 mb-2">{line.replace('### ', '')}</h3>);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={idx} className="text-slate-300 text-sm leading-relaxed ml-4 list-disc my-1">
            {parseInlineFormatting(line.substring(2))}
          </li>
        );
      } else if (line.trim() === '---') {
        elements.push(<hr key={idx} className="border-slate-850 my-8" />);
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={idx} className="text-slate-300 text-sm leading-relaxed my-3">
            {parseInlineFormatting(line)}
          </p>
        );
      }
    });

    return elements;
  };

  const parseInlineFormatting = (text) => {
    // Basic bold and code inline parser
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|>.*?<)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-mono text-xs text-indigo-300">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

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

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Back Link */}
        <Link 
          to="/guides" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Prep Guides</span>
        </Link>

        {/* Metadata Banner */}
        <header className="space-y-4 mb-10 pb-8 border-b border-slate-900">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 font-semibold rounded-md">
              {guide.category}
            </span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar size={13} />
              <span>{guide.date}</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock size={13} />
              <span>{guide.readTime}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {guide.title}
          </h1>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400 font-mono">
              Published by <strong className="text-slate-200">{guide.author}</strong>
            </p>
            <div className="flex gap-2">
              {guide.tags.map(t => (
                <span key={t} className="text-[11px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article className="prose prose-invert max-w-none">
          {renderContent(guide.content)}
        </article>

        {/* Ad Container Placeholder (AdSense) */}
        <div className="my-12 p-6 bg-slate-900/30 border border-slate-850 rounded-2xl text-center">
          <p className="text-xs text-slate-500 font-mono mb-2">SPONSORED ADVERTISEMENT</p>
          <div className="min-h-[100px] flex items-center justify-center text-slate-600 text-xs">
            {/* Auto-ads script injects ads here */}
            <span>PrepBoat AI Educational Network</span>
          </div>
        </div>

        {/* Call to Action Box */}
        <div className="mt-12 p-8 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/20 rounded-2xl text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Ready to put this guide into practice?</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
            Practice over 560+ DSA problems in our interactive compiler and optimize your resume for recruiter ATS filters.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link to="/register" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition-all">
              Create Free Account
            </Link>
            <Link to="/guides" className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:text-white transition-all">
              Explore More Guides
            </Link>
          </div>
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

export default GuideDetail;
