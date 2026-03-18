import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, CheckCircle } from 'lucide-react';
import SocialLoginButtons from './components/SocialLoginButtons';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await register(formData.username, formData.email, formData.password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err?.message || 'Registration failed. Username may already be taken.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <CheckCircle size={48} style={{ color: '#4ade80', marginBottom: '16px' }} />
                <h3 style={{ marginBottom: '8px' }}>Account Created!</h3>
                <p style={{ color: 'var(--text-muted)' }}>Redirecting to your dashboard...</p>
            </div>
        );
    }

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ color: 'var(--text-muted)' }}>Join the next generation of DevOps intelligence</p>
            </div>

            {error && (
                <div style={{ background: 'rgba(0,210,255, 0.1)', border: '1px solid var(--primary)', padding: '12px', borderRadius: '8px', color: 'var(--primary)', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>Username</label>
                    <div style={{ position: 'relative' }}>
                        <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                        <input type="text" name="username" required value={formData.username} onChange={handleChange} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px 10px 10px 35px', color: 'white', outline: 'none', fontSize: '14px' }} />
                    </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px 10px 10px 35px', color: 'white', outline: 'none', fontSize: '14px' }} />
                    </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                        <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px 10px 10px 35px', color: 'white', outline: 'none', fontSize: '14px' }} />
                    </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                        <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px 10px 10px 35px', color: 'white', outline: 'none', fontSize: '14px' }} />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    {loading ? 'Creating Account...' : 'Register'} <UserPlus size={18} style={{ marginLeft: '8px' }} />
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
            <SocialLoginButtons type="register" />
        </div>
    );
};

export default RegisterPage;
