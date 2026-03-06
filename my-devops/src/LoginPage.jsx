import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, User, Lock } from 'lucide-react';
import SocialLoginButtons from './components/SocialLoginButtons';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(username, password);
            navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
        } catch (err) {
            setError(err?.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back to BrainDevOps</p>
            </div>

            {error && (
                <div style={{
                    background: 'rgba(255, 61, 0, 0.1)',
                    border: '1px solid var(--primary)',
                    padding: '12px',
                    borderRadius: '8px',
                    color: 'var(--primary)',
                    marginBottom: '20px',
                    fontSize: '14px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Username</label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                padding: '12px 12px 12px 40px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                padding: '12px 12px 12px 40px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    {loading ? 'Logging in...' : 'Login'} <LogIn size={18} style={{ marginLeft: '8px' }} />
                </button>
            </form>

            {/* Divider */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '24px 0',
                gap: '12px'
            }}>
                <div style={{
                    flex: 1,
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.1)'
                }} />
                <span style={{
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    fontWeight: '500'
                }}>OR</span>
                <div style={{
                    flex: 1,
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.1)'
                }} />
            </div>

            {/* Social Login */}
            <SocialLoginButtons type="login" />
        </div>
    );
};

export default LoginPage;
