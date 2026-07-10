import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Ship, AlertCircle, User as UserIcon, Lock, Mail, ChevronRight, Monitor, Cpu, Database, Award } from 'lucide-react';
import techLoginArt from '../assets/tech_login_art.png';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password;
    const trimmedConfirm = confirmPassword;

    if (!trimmedName) {
      setError('Name is required');
      return;
    }

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

    if (!trimmedPassword) {
      setError('Password is required');
      return;
    }

    if (trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!trimmedConfirm) {
      setError('Please confirm your password');
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const checkRes = await api.get(`/api/auth/check-email?email=${encodeURIComponent(trimmedEmail)}`);
      if (checkRes.data.exists) {
        setError('already registered');
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

    const res = await register(
      trimmedName,
      trimmedEmail,
      trimmedPassword,
      '', // empty college
      '', // empty branch
      '', // empty cgpa
      'Software Engineer' // default fallback target role
    );
    if (res.success) {
      navigate('/');
    } else {
      if (res.error && (res.error.toLowerCase().includes('exist') || res.error.toLowerCase().includes('register'))) {
        setError('already registered');
      } else {
        setError(res.error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 grid grid-cols-1 md:grid-cols-12 font-sans antialiased overflow-hidden page-mount-transition">
      
      {/* LEFT PANEL - Animated Tech Art (Desktop Only) */}
      <div className="hidden md:flex md:col-span-7 gradient-animate-bg flex-col justify-between p-4 border-r border-slate-900 relative overflow-hidden">
        
        {/* Grids and Glowing Blobs */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-30"></div>
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header Branding */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center justify-center bg-indigo-600/10 w-11 h-11 rounded-lg border border-indigo-500/20 text-indigo-400">
            <Ship size={24} />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            PrepBoat<span className="text-indigo-500">AI</span>
          </span>
        </div>

        {/* Middle Visual Section */}
        <div className="space-y-4 my-auto relative z-10 max-w-xl">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-purple-950/60 border border-purple-500/30 rounded-full text-xs font-semibold text-purple-400 inline-flex items-center gap-1.5">
              <Award size={13} />
              Step Into the Tech Industry
            </span>
            <h2 className="text-lg font-extrabold text-white leading-tight tracking-tight">
              Start Your Journey <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-indigo-300">
                To Placement Success
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Create an account to gain access to our custom interview compilers, custom target-company tracks, and real-time AI roadmap planners.
            </p>
          </div>

          {/* Professional CSE Illustration */}
          <div className="relative group overflow-hidden rounded-lg border border-slate-850 shadow-2xl transition-all duration-300 hover:border-indigo-500/25 bg-slate-950/60 p-1 card-3d-hover preserve-3d">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90 z-10 pointer-events-none"></div>
            <img 
              src={techLoginArt} 
              alt="Tech Illustration" 
              className="w-full h-[220px] object-cover rounded-lg opacity-60 group-hover:opacity-75 transition-all duration-500 group-hover:scale-102"
            />
          </div>

          {/* Features Badges */}
          <div className="grid grid-cols-3 gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-lg">
              <Monitor size={15} className="text-indigo-400" />
              <span>DSA Sandbox</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-lg">
              <Cpu size={15} className="text-purple-400" />
              <span>AI Rudra</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-lg">
              <Database size={15} className="text-emerald-400" />
              <span>SQL Tracks</span>
            </div>
          </div>
        </div>

        {/* Footer branding */}
        <div className="text-xs text-slate-600 font-mono z-10">
          PrepBoat AI Placement Platform © {new Date().getFullYear()}
        </div>
      </div>

      {/* RIGHT PANEL - Registration Form */}
      <div className="md:col-span-5 bg-slate-900/50 flex flex-col justify-center p-4 sm:p-4 relative overflow-y-auto min-h-screen py-12">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.02]"></div>
        <div className="w-full max-w-[380px] mx-auto space-y-4 relative z-10">
          
          {/* Logo showing only on mobile */}
          <div className="flex md:hidden items-center justify-center gap-3">
            <div className="flex items-center justify-center bg-indigo-600/10 w-10 h-10 rounded-lg border border-indigo-500/20 text-indigo-400">
              <Ship size={28} />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              PrepBoat<span className="text-indigo-500">AI</span>
            </h1>
          </div>
          {/* Heading */}
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-lg font-bold text-white tracking-tight">Create Account</h2>
            <p className="text-xs text-slate-400">Fill in the fields below to start your placement preparation.</p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-800/50 rounded-lg text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0f0f0f] border border-[#333] text-gray-200 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
                <UserIcon size={16} className="absolute left-3.5 top-3 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Google Mail (Gmail)</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. candidate@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0f0f0f] border border-[#333] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm"
                />
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Password (Min 6 characters)</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0f0f0f] border border-[#333] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0f0f0f] border border-[#333] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold rounded-lg text-sm transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <span>{loading ? 'Creating Workspace...' : 'Sign Up'}</span>
              <ChevronRight size={16} />
            </button>
          </form>

          {/* Login Redirect */}
          <div className="text-center pt-2 text-sm text-slate-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors font-sans">
              Sign In
            </Link>
          </div>
        </div>
        
        {/* Public Legal Footer */}
        <div className="absolute bottom-4 text-center text-xs text-slate-600 w-full flex justify-center gap-4 left-0">
          <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
        </div>
      </div>

    </div>
  );
};

export default Register;
