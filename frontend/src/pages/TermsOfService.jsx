import React from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const { user } = useAuth();

  const content = (
    <div className="max-w-4xl mx-auto p-8 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-300 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: July 2026</p>
        </div>
        {!user && (
          <Link to="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all">
            Back to Login
          </Link>
        )}
      </div>

      <p className="text-sm leading-relaxed">
        Welcome to PrepBoat AI! These terms and conditions outline the rules and regulations for the use of PrepBoat AI's Website, located at <span className="text-indigo-400">prepboat-ai.vercel.app</span>.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">1. Terms</h2>
        <p className="text-sm leading-relaxed text-slate-400">
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use PrepBoat AI if you do not agree to take all of the terms and conditions stated on this page.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">2. License</h2>
        <p className="text-sm leading-relaxed text-slate-400">
          Unless otherwise stated, PrepBoat AI and/or its licensors own the intellectual property rights for all material on PrepBoat AI. All intellectual property rights are reserved. You may access this from PrepBoat AI for your own personal use subjected to restrictions set in these terms and conditions.
        </p>
        <p className="text-sm leading-relaxed text-slate-405 font-medium">You must not:</p>
        <ul className="list-disc pl-5 text-sm space-y-1 text-slate-400">
          <li>Republish material or practice questions from PrepBoat AI</li>
          <li>Sell, rent or sub-license material from PrepBoat AI</li>
          <li>Reproduce, duplicate or copy material from PrepBoat AI</li>
          <li>Redistribute content or solutions from PrepBoat AI</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">3. Hyperlinking to our Content</h2>
        <p className="text-sm leading-relaxed text-slate-400">
          The following organizations may link to our Website without prior written approval: Government agencies, Search engines, News organizations, and Online directory distributors.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">4. Disclaimer</h2>
        <p className="text-sm leading-relaxed text-slate-400">
          To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
        </p>
        <ul className="list-disc pl-5 text-sm space-y-1 text-slate-400">
          <li>limit or exclude our or your liability for death or personal injury;</li>
          <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
          <li>limit any of our or your liabilities in any way that is not permitted under applicable law.</li>
        </ul>
      </section>
    </div>
  );

  if (user) {
    return <Layout>{content}</Layout>;
  }

  return (
    <div className="min-h-screen bg-[#020617] p-8 flex flex-col justify-between items-center">
      <div className="w-full flex-grow flex items-center justify-center py-8">
        {content}
      </div>
      <div className="text-xs text-slate-600 mt-4 pb-4">
        &copy; {new Date().getFullYear()} PrepBoat AI. All rights reserved.
      </div>
    </div>
  );
};

export default TermsOfService;
