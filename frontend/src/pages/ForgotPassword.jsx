import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Ship, AlertCircle, CheckCircle, MailCheck, LogIn, ChevronRight, Key, Lock, ArrowRight, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1 = Request Code, 2 = Verify Code & Reset, 3 = Success
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devTip, setDevTip] = useState(false);

  const validateGoogleMailFormat = (emailStr) => {
    const clean = emailStr.trim().toLowerCase();
    return clean.endsWith('@gmail.com') || clean.endsWith('@googlemail.com');
  };

  const validateEmailFormat = (emailStr) => {
    return emailStr.includes('@') && emailStr.includes('.');
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDevTip(false);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !validateEmailFormat(trimmedEmail)) {
      setError('Enter valid email address');
      return;
    }

    if (!validateGoogleMailFormat(trimmedEmail)) {
      setError('invalid mail');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/forgot-password', { email: trimmedEmail });
      setSuccess(res.data.message);
      
      // If email_sent is false, it means SMTP is not configured
      if (res.data.email_sent === false) {
        setDevTip(true);
      }
      
      // Move to code verification step
      setStep(2);
    } catch (err) {
      console.error("Forgot password request failed: ", err);
      if (err.response?.data?.detail === 'invalid mail') {
        setError('invalid mail');
      } else {
        setError("Enter valid email address");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (code.trim().length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/reset-password', {
        email: email.trim(),
        code: code.trim(),
        password: password
      });
      setSuccess(res.data.message);
      setStep(3);
    } catch (err) {
      console.error("Password reset execution failed: ", err);
      setError(err.response?.data?.detail || "The verification code is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 font-sans antialiased relative page-mount-transition">
      {/* Background Grids and Blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-30"></div>
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[400px] space-y-4 relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center justify-center bg-indigo-600/10 w-12 h-12 rounded-lg border border-indigo-500/20 text-indigo-400">
            <Ship size={36} />
          </div>
          <div className="mt-2">
            <h1 className="text-lg font-bold text-white tracking-tight">
              PrepBoat<span className="text-indigo-500 font-normal">AI</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Reset Account Password</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg shadow-2xl backdrop-blur-md space-y-4">
          
          {/* Custom error alert */}
          {error && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-800/50 rounded-lg text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {success && step !== 3 && (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle size={15} className="shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{success}</span>
            </div>
          )}

          {/* Dev Tip Banner if SMTP is not set up */}
          {devTip && step === 2 && (
            <div className="p-4 bg-indigo-950/40 border border-indigo-800/40 rounded-lg space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs text-indigo-300 font-bold">
                <MailCheck size={15} className="text-indigo-400" />
                <span>📬 Developer Terminal Log Info</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                SMTP credentials not set in `.env`. Find the generated 6-digit verification code printed in your **backend uvicorn terminal console logs**!
              </p>
            </div>
          )}

          {/* STEP 1: Enter email address */}
          {step === 1 && (
            <form onSubmit={handleRequestCode} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Registered Google Mail</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  />
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold rounded-lg text-sm transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <span>{loading ? 'Verifying Account...' : 'Send Verification Code'}</span>
                <ChevronRight size={16} />
              </button>
            </form>
          )}

          {/* STEP 2: Verify Code and Reset Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">6-Digit Verification Code</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-center font-mono tracking-[0.3em] text-lg font-bold"
                  />
                  <Key size={16} className="absolute left-3.5 top-3 text-slate-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">New Password (Min 6 characters)</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Confirm New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !code || !password || !confirmPassword}
                className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold rounded-lg text-sm transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <span>{loading ? 'Updating Password...' : 'Reset Password'}</span>
                <ChevronRight size={16} />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Change Email / Resend Code
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success Screen */}
          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 animate-bounce">
                  <CheckCircle size={30} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Password Reset Successfully</h3>
                  <p className="text-xs text-slate-400 mt-1">Your credentials are updated. You can now sign in with your new password.</p>
                </div>
              </div>
              
              <Link
                to="/login"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <span>Back to Sign In</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          )}

          {/* Back to Login anchor */}
          {step !== 3 && (
            <div className="border-t border-slate-800 pt-4 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-slate-950 hover:bg-slate-900/60 active:scale-[0.98] border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all"
              >
                <LogIn size={13} />
                <span>Back to Sign In</span>
              </Link>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
