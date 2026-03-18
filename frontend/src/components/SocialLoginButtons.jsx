import React, { useState } from 'react';
import { initiateSocialLogin } from '../services/socialAuthService';
import { 
  Chrome, 
  Github, 
  GitBranch as Gitlab 
} from 'lucide-react';

const SocialLoginButtons = ({ type = 'login' }) => {
  const [loading, setLoading] = useState({});

  const providers = [
    {
      name: 'Google',
      provider: 'google',
      icon: Chrome,
      color: '#4285f4',
      bgColor: '#ffffff',
      textColor: '#000000'
    },
    {
      name: 'GitHub',
      provider: 'github',
      icon: Github,
      color: '#ffffff',
      bgColor: '#333333',
      textColor: '#ffffff'
    },
    {
      name: 'GitLab',
      provider: 'gitlab',
      icon: Gitlab,
      color: '#ffffff',
      bgColor: '#fc6d26',
      textColor: '#ffffff'
    },
    {
      name: 'Bitbucket',
      provider: 'bitbucket',
      icon: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.007 0C5.925.02 1.254 4.746 1.28 10.83c.015 3.335 1.525 6.31 3.904 8.27.1.08.24.08.34 0l1.42-1.42c.08-.08.08-.2 0-.28a8.27 8.27 0 01-2.46-5.9 8.27 8.27 0 018.27-8.27 8.27 8.27 0 018.27 8.27 8.27 8.27 0 01-2.46 5.9c-.08.08-.08.2 0 .28l1.42 1.42c.1.08.24.08.34 0 2.38-1.96 3.89-4.935 3.904-8.27C22.76 4.746 18.09.02 12.007 0zm0 3.5a7.33 7.33 0 00-7.33 7.33 7.33 7.33 0 002.18 5.21c.08.08.2.08.28 0l1.42-1.42c.08-.08.08-.2 0-.28a5.33 5.33 0 01-1.58-3.8 5.33 5.33 0 015.33-5.33 5.33 5.33 0 015.33 5.33 5.33 5.33 0 01-1.58 3.8c-.08.08-.08.2 0 .28l1.42 1.42c.08.08.2.08.28 0a7.33 7.33 0 002.18-5.21 7.33 7.33 0 00-7.33-7.33z"/>
        </svg>
      ),
      color: '#ffffff',
      bgColor: '#0052cc',
      textColor: '#ffffff'
    }
  ];

  const handleSocialLogin = async (provider) => {
    setLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      await initiateSocialLogin(provider);
      // The redirect will be handled by the OAuth flow
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      // You might want to show an error message here
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const buttonText = type === 'register' ? 'Sign up with' : 'Sign in with';

  return (
    <div className="social-login-container">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        margin: '20px 0'
      }}>
        {providers.map((provider) => {
          const Icon = provider.icon;
          const isLoading = loading[provider.provider];
          
          return (
            <button
              key={provider.provider}
              onClick={() => handleSocialLogin(provider.provider)}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                backgroundColor: provider.bgColor,
                color: provider.textColor,
                fontSize: '14px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {typeof provider.icon === 'function' ? (
                provider.icon()
              ) : (
                <Icon size={20} />
              )}
              <span>{buttonText} {provider.name}</span>
              {isLoading && (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: `2px solid ${provider.textColor}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              )}
            </button>
          );
        })}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SocialLoginButtons;
