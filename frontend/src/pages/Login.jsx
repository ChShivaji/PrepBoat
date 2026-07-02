import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Ship, AlertCircle, Key, Lock, Mail, ChevronRight } from 'lucide-react';
import techLoginArt from '../assets/tech_login_art.png';
import dsaPracticeBanner from '../assets/dsa_practice_banner.png';
import aptitudeBanner from '../assets/aptitude_banner.png';
import aiMentorBanner from '../assets/ai_mentor_banner.png';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg] = useState(searchParams.get('expired') ? 'Session expired. Please log in again.' : '');

  const validateGoogleMailFormat = (emailStr) => {
    const clean = emailStr.trim().toLowerCase();
    return clean.endsWith('@gmail.com') || clean.endsWith('@googlemail.com');
  };

  const validateEmailFormat = (emailStr) => {
    return emailStr.includes('@') && emailStr.includes('.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validateEmailFormat(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validateGoogleMailFormat(trimmedEmail)) {
      setError('Please use a valid @gmail.com address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      const checkRes = await api.get(`/api/auth/check-email?email=${encodeURIComponent(trimmedEmail)}`);
      if (!checkRes.data.exists) {
        setError('Email does not exist. Please sign up.');
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail === 'invalid mail') {
        setError('Please use a valid @gmail.com address');
        setLoading(false);
        return;
      }
    }

    const res = await login(trimmedEmail, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center relative font-sans antialiased overflow-hidden page-mount-transition p-4 sm:p-4">
      
      {/* Background 4-Square Image Grid (Medium Highlight) */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4 p-4 opacity-25 pointer-events-none select-none">
        <div className="relative overflow-hidden rounded-lg border border-slate-900 bg-slate-950">
          <img src={techLoginArt} className="w-full h-full object-cover mix-blend-screen brightness-90 saturate-[0.8]" alt="Tech Workspace" />
          <div className="absolute inset-0 bg-slate-950/25"></div>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-slate-900 bg-slate-950">
          <img src={dsaPracticeBanner} className="w-full h-full object-cover mix-blend-screen brightness-90 saturate-[0.8]" alt="DSA Practice" />
          <div className="absolute inset-0 bg-slate-950/25"></div>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-slate-900 bg-slate-950">
          <img src={aptitudeBanner} className="w-full h-full object-cover mix-blend-screen brightness-90 saturate-[0.8]" alt="Aptitude Prep" />
          <div className="absolute inset-0 bg-slate-950/25"></div>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-slate-900 bg-slate-950">
          <img src={aiMentorBanner} className="w-full h-full object-cover mix-blend-screen brightness-90 saturate-[0.8]" alt="AI Mentor" />
          <div className="absolute inset-0 bg-slate-950/25"></div>
        </div>
      </div>

      {/* Radial Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none"></div>

      {/* Centered Login Card */}
      <div className="w-full max-w-md bg-[#1a1a1a] border border-[#333333] rounded-xl p-8 shadow-2xl relative z-10 space-y-4">
        
        {/* Logo & Branding */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center justify-center bg-indigo-600/10 w-10 h-10 rounded-lg border border-indigo-500/20 text-indigo-400">
            <Ship size={28} />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white font-sans">
            PrepBoat<span className="text-indigo-500">AI</span>
          </h1>
        </div>

        {/* Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-slate-200">Welcome Back</h2>
          <p className="text-sm text-slate-400 font-medium">Sign in to your account to continue</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3 bg-rose-950/30 border border-rose-900/40 rounded-lg text-rose-400 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span className="font-medium leading-normal">{error}</span>
          </div>
        )}

        {/* Info Message */}
        {msg && (
          <div className="p-3 bg-indigo-950/30 border border-indigo-900/40 rounded-lg text-indigo-400 text-xs flex items-start gap-2.5">
            <Key size={14} className="shrink-0 mt-0.5" />
            <span className="font-medium leading-normal">{msg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            </div>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full pl-10 pr-3 py-2.5 bg-[#0f0f0f] border border-[#333] text-sm text-gray-200 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
              <Mail size={16} className="absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-3 py-2.5 bg-[#0f0f0f] border border-[#333] text-sm text-gray-200 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
              <Lock size={16} className="absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold rounded-lg text-sm transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-indigo-600/15"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ChevronRight size={15} />
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center pt-2 text-sm text-slate-400 font-medium">
          New to PrepBoat?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
            Create an account
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Login;
