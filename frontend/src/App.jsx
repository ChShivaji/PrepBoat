import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Pages import
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import QuestionDetail from './pages/QuestionDetail';
import ReferenceHub from './pages/ReferenceHub';
import CompanyPrep from './pages/CompanyPrep';
import AIResumeAnalyzer from './pages/AIResumeAnalyzer';
import AIResumeCreator from './pages/AIResumeCreator';
import AIInterviewGen from './pages/AIInterviewGen';
import AIMentor from './pages/AIMentor';
import Admin from './pages/Admin';
import AptitudePrep from './pages/AptitudePrep';

// Route guards
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner fullPage={true} message="Verifying security session..." />;
  if (!user) return <Navigate to="/login" replace />;
  
  return <Layout>{children}</Layout>;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner fullPage={true} message="Verifying security credentials..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes (Student & general workspace) */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
      <Route path="/practice/:id" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
      <Route path="/references" element={<ProtectedRoute><ReferenceHub /></ProtectedRoute>} />
      <Route path="/company-prep" element={<ProtectedRoute><CompanyPrep /></ProtectedRoute>} />
      
      <Route path="/ai-resume" element={<ProtectedRoute><AIResumeAnalyzer /></ProtectedRoute>} />
      <Route path="/ai-resume-creator" element={<ProtectedRoute><AIResumeCreator /></ProtectedRoute>} />
      <Route path="/ai-interview" element={<ProtectedRoute><AIInterviewGen /></ProtectedRoute>} />
      <Route path="/ai-mentor" element={<ProtectedRoute><AIMentor /></ProtectedRoute>} />
      <Route path="/aptitude" element={<ProtectedRoute><AptitudePrep /></ProtectedRoute>} />

      {/* Admin Route */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

      {/* Catch All redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
