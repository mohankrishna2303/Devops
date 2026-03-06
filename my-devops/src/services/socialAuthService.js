import { apiCall } from '../api/client';

// Get OAuth URL for social login
export const getSocialAuthUrl = async (provider) => {
  try {
    const response = await apiCall(`/auth/social/${provider}/`);
    return response;
  } catch (error) {
    console.error(`Error getting ${provider} auth URL:`, error);
    throw error;
  }
};

// Handle OAuth callback
export const handleSocialCallback = async (provider, code) => {
  try {
    const response = await apiCall(`/auth/social/${provider}/callback/`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    
    // Store tokens in localStorage
    if (response.access) {
      localStorage.setItem('devops_access_token', response.access);
    }
    if (response.refresh) {
      localStorage.setItem('devops_refresh_token', response.refresh);
    }
    
    return response;
  } catch (error) {
    console.error(`Error handling ${provider} callback:`, error);
    throw error;
  }
};

// Get available social providers
export const getSocialProviders = async () => {
  try {
    const response = await apiCall('/auth/social/providers/');
    return response.providers;
  } catch (error) {
    console.error('Error getting social providers:', error);
    throw error;
  }
};

// Initiate social login flow
export const initiateSocialLogin = async (provider) => {
  try {
    const { auth_url } = await getSocialAuthUrl(provider);
    
    // Open OAuth provider in popup
    const popup = window.open(
      auth_url,
      'social-login',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );
    
    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          reject(new Error('Login window was closed'));
        }
      }, 1000);
      
      const messageHandler = async (event) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'SOCIAL_LOGIN_SUCCESS') {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', messageHandler);
          
          try {
            const response = await handleSocialCallback(provider, event.data.code);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        } else if (event.data.type === 'SOCIAL_LOGIN_ERROR') {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', messageHandler);
          reject(new Error(event.data.error));
        }
      };
      
      window.addEventListener('message', messageHandler);
    });
  } catch (error) {
    console.error(`Error initiating ${provider} login:`, error);
    throw error;
  }
};

// Handle OAuth callback from popup
export const handleOAuthCallback = (provider, code) => {
  // Send message to parent window
  if (window.opener) {
    window.opener.postMessage({
      type: 'SOCIAL_LOGIN_SUCCESS',
      provider,
      code
    }, window.location.origin);
    window.close();
  }
};

// Handle OAuth error from popup
export const handleOAuthError = (provider, error) => {
  // Send error message to parent window
  if (window.opener) {
    window.opener.postMessage({
      type: 'SOCIAL_LOGIN_ERROR',
      provider,
      error
    }, window.location.origin);
    window.close();
  }
};

export default {
  getSocialAuthUrl,
  handleSocialCallback,
  getSocialProviders,
  initiateSocialLogin,
  handleOAuthCallback,
  handleOAuthError
};
