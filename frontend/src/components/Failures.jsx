import React, { useState, useEffect } from 'react';
import { AlertCircle, Zap, MessageSquare, History, ShieldAlert, CheckCircle, Terminal, RefreshCw, Box } from 'lucide-react';
import { failuresAPI } from '../services/apiService';

const Failures = () => {
    const [failures, setFailures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFailures();
    }, []);

    const fetchFailures = () => {
        failuresAPI.getAll()
            .then(res => { setFailures(res.data || res); setLoading(false); })
            .catch(() => setLoading(false));
    };

    const handleResolve = async (id) => {
        try {
            await failuresAPI.resolve(id);
            setFailures(f => f.map(item => item.id === id ? { ...item, is_resolved: true } : item));
        } catch { alert("Failed to resolve failure. Please try again."); }
    };

    const activeFailures = failures.filter(f => !f.is_resolved);

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.02em' }}>
                        <Terminal color="var(--primary)" size={32} /> Intelligence Hub
                        <span className="badge badge-error" style={{ fontSize: '11px', verticalAlign: 'middle', marginLeft: '12px' }}>{activeFailures.length} ACTIVE</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>AI-clustered failures with root cause analysis and automated fixes.</p>
                </div>
                <button className="btn-secondary" onClick={fetchFailures} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}>
                    <RefreshCw size={18} /> Refresh
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: '300px', width: '100%', borderRadius: '20px' }} />)}
                </div>
            ) : activeFailures.length === 0 ? (
                <div className="glass-card fade-in slide-up" style={{ padding: '80px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(74,222,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 0 40px rgba(74,222,128,0.2)' }}>
                        <CheckCircle size={32} color="#4ade80" />
                    </div>
                    <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>All Systems Nominal</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '400px' }}>No unresolved failures detected. Your pipelines are healthy and deploying perfectly! 🎉</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {activeFailures.map(cluster => {
                        const sev = (cluster.severity || 'low').toLowerCase();
                        const isHigh = sev === 'high' || sev === 'critical';
                        const badgeColor = isHigh ? 'badge-error' : sev === 'medium' ? 'badge-warning' : 'badge-info';

                        return (
                            <div key={cluster.id} className="glass-card fade-in slide-up" style={{ padding: '0', border: isHigh ? '1px solid rgba(248,113,113,0.3)' : '1px solid var(--border)' }}>
                                <div style={{ padding: '24px 32px', background: isHigh ? 'linear-gradient(135deg, rgba(248,113,113,0.08) 0%, transparent 100%)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

                                    {/* Left Info */}
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isHigh ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.05)', color: isHigh ? '#f87171' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: isHigh ? '1px solid rgba(248,113,113,0.2)' : '1px solid rgba(255,255,255,0.1)' }}>
                                            <ShieldAlert size={26} />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                                                <h4 style={{ margin: 0, fontSize: '18px', letterSpacing: '0.01em', color: 'white' }}>{cluster.error_type}</h4>
                                                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '6px', color: 'var(--text-muted)' }}>
                                                    {cluster.build_info?.repo || 'backend-api'} #{cluster.build_info?.build || '1A4B'}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><History size={13} /> {new Date(cluster.created_at).toLocaleString()}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Box size={13} /> 3 occurrences</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Badge */}
                                    <span className={`badge ${badgeColor}`} style={{ fontSize: '12px', padding: '6px 14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <span className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', marginRight: '6px' }} />
                                        {sev} Severity
                                    </span>
                                </div>

                                {/* Body */}
                                <div style={{ padding: '24px 32px' }}>
                                    <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: 'linear-gradient(180deg, #8338EC 0%, #3A86FF 100%)' }} />
                                        <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#8338EC', letterSpacing: '0.02em' }}>
                                            <Zap size={16} fill="currentColor" /> AI Root Cause Analysis
                                        </h5>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#272b31ff', lineHeight: 1.6, paddingLeft: '4px' }}>
                                            {cluster.ai_explanation}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button className="btn-primary" onClick={() => handleResolve(cluster.id)} style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', boxShadow: 'none' }}>
                                            <CheckCircle size={16} /> Mark Resolved
                                        </button>
                                        <button className="btn-secondary" onClick={() => alert(`Fetching complete stack trace for ${cluster.error_type}...`)} style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Terminal size={16} /> View Exception Context
                                        </button>
                                        <button className="btn-secondary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', color: 'var(--primary)', borderColor: 'rgba(0,210,255,0.2)', background: 'rgba(0,210,255,0.05)' }}>
                                            <MessageSquare size={16} /> Query Assistant
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default Failures;
