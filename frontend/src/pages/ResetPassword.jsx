import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const ResetPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new unified forgot-password screen which supports code reset
    navigate('/forgot-password', { replace: true });
  }, [navigate]);

  return <LoadingSpinner fullPage={true} message="Redirecting to secure reset workspace..." />;
};

export default ResetPassword;
