import React, { useState, useEffect } from 'react';
import { AlertCircle, Zap, MessageSquare, History, ShieldAlert, CheckCircle, Terminal } from 'lucide-react';
import { failuresAPI } from '../api/client';

const Failures = () => {
    const [failures, setFailures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFailures();
    }, []);

    const fetchFailures = () => {
        failuresAPI.getAll()
            .then(res => {
                // Filter out resolved ones if we want, or show them with a checkmark
                setFailures(res.data || res);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching failures:", err);
                setLoading(false);
            });
    };

    const handleResolve = async (id) => {
        try {
            await failuresAPI.resolve(id);
            alert("Failure marked as resolved!");
            fetchFailures();
        } catch (err) {
            alert("Failed to resolve failure. Please try again.");
        }
    };

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Intelligence Hub</h2>
                <p style={{ color: 'var(--text-muted)' }}>AI-clustered failures with root cause analysis and automated fixes.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {loading ? (
                    <div style={{ color: 'var(--text-muted)' }}>Analyzing failure patterns...</div>
                ) : (
                    failures.filter(f => !f.is_resolved).map((cluster) => (
                        <div key={cluster.id} className="glass-card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: 'rgba(255, 61, 0, 0.1)',
                                        color: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <ShieldAlert size={24} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                            <h4 style={{ margin: 0 }}>{cluster.error_type}</h4>
                                            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                                                {cluster.build_info?.repo} #{cluster.build_info?.build}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <History size={14} /> Last seen: {new Date(cluster.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div style={{
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    background: (cluster.severity || '').toLowerCase() === 'high' ? 'rgba(255, 61, 0, 0.15)' : (cluster.severity || '').toLowerCase() === 'medium' ? 'rgba(255, 183, 77, 0.15)' : 'rgba(74, 222, 128, 0.15)',
                                    color: (cluster.severity || '').toLowerCase() === 'high' ? 'var(--primary)' : (cluster.severity || '').toLowerCase() === 'medium' ? '#FFB74D' : '#4ade80',
                                    border: `1px solid ${(cluster.severity || '').toLowerCase() === 'high' ? 'rgba(255, 61, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`
                                }}>
                                    {cluster.severity && (cluster.severity.charAt(0).toUpperCase() + cluster.severity.slice(1).toLowerCase())} Severity
                                </div>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                                <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Zap size={16} color="var(--secondary)" /> AI Explanation
                                </h5>
                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    {cluster.ai_explanation}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={() => handleResolve(cluster.id)}>
                                    <CheckCircle size={16} style={{ marginRight: '8px' }} /> Mark as Resolved
                                </button>
                                <button className="btn-secondary" onClick={() => alert(`[LOGS for ${cluster.error_type}]\n${new Date().toISOString()} INFO: Starting build check...\n${new Date().toISOString()} ERROR: ${cluster.error_type}\n${new Date().toISOString()} WARN: Stack trace dumped to /tmp/logs/`)} style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Terminal size={16} /> View Logs
                                </button>
                                <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <MessageSquare size={16} /> Discuss with AI
                                </button>
                            </div>
                        </div>
                    ))
                )}
                {!loading && failures.filter(f => !f.is_resolved).length === 0 && (
                    <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No unresolved failures detected. Your pipelines are healthy! 🎉</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Failures;
