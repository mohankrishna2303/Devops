import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { handleOAuthCallback, handleOAuthError } from '../services/socialAuthService';
import LoadingSpinner from '../components/LoadingSpinner';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const provider = window.location.pathname.split('/').pop(); // Get provider from URL
    
    if (error) {
      handleOAuthError(provider, error);
      return;
    }
    
    if (code) {
      handleOAuthCallback(provider, code);
      return;
    }
    
    // If no code or error, redirect to login
    navigate('/login');
  }, [searchParams, navigate]);
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <LoadingSpinner />
    </div>
  );
};

export default OAuthCallback;
