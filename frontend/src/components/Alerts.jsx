import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, AlertTriangle, Info, Shield, CheckCircle, RefreshCw, X, Filter } from 'lucide-react';
import { alertsAPI } from '../api/client';

const severityConfig = {
    error: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', icon: <AlertCircle size={18} /> },
    warning: { color: '#FFBE0B', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', icon: <AlertTriangle size={18} /> },
    info: { color: '#3A86FF', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)', icon: <Info size={18} /> },
    security: { color: '#8338EC', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', icon: <Shield size={18} /> },
};

const staticAlerts = [
    { id: 1, type: 'error', title: 'Deployment Failed', message: 'Production deployment for aether-api failed due to timeout.', time: '2m ago', service: 'Jenkins' },
    { id: 2, type: 'warning', title: 'High CPU Usage', message: 'EKS Node Group "dev-nodes" is at 88% CPU capacity.', time: '15m ago', service: 'EKS' },
    { id: 3, type: 'info', title: 'Terraform Applied', message: 'Infrastructure changes applied successfully to us-east-1.', time: '1h ago', service: 'Terraform' },
    { id: 4, type: 'security', title: 'Vulnerability Detected', message: 'Critical CVE found in package "requests" in project core-app.', time: '3h ago', service: 'Snyk' },
    { id: 5, type: 'warning', title: 'Memory Pressure', message: 'auth-service pod is nearing memory limit of 512Mi.', time: '6h ago', service: 'Kubernetes' },
    { id: 6, type: 'info', title: 'Pipeline Completed', message: 'main branch pipeline completed in 4m 32s with 100% coverage.', time: '8h ago', service: 'GitHub Actions' },
];

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [dismissed, setDismissed] = useState(new Set());
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAlerts = async () => {
        setIsRefreshing(true);
        try {
            const res = await alertsAPI.getAll();
            setAlerts(res.alerts || staticAlerts);
        } catch {
            setAlerts(staticAlerts);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => { fetchAlerts(); }, []);

    const visible = alerts.filter(a =>
        !dismissed.has(a.id) && (filter === 'all' || a.type === filter)
    );

    const counts = alerts.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="fade-in" style={{ color: 'white' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.02em' }}>
                        <Bell color="var(--primary)" size={32} /> Alerts Center
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>Real-time notifications from your entire DevOps ecosystem.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button onClick={fetchAlerts} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}>
                        <RefreshCw size={18} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                        Refresh
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '10px', fontSize: '14px' }}>
                        <CheckCircle size={18} />
                        Mark All Read
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid-4" style={{ gap: '20px', marginBottom: '32px' }}>
                {[
                    { type: 'error', label: 'Critical', icon: <AlertCircle size={24} /> },
                    { type: 'warning', label: 'Warnings', icon: <AlertTriangle size={24} /> },
                    { type: 'security', label: 'Security', icon: <Shield size={24} /> },
                    { type: 'info', label: 'Info', icon: <Info size={24} /> },
                ].map(s => {
                    const cfg = severityConfig[s.type];
                    return (
                        <div key={s.type} style={{
                            background: 'rgba(255,255,255,0.03)', border: filter === s.type ? `1px solid ${cfg.color}` : '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s',
                            transform: filter === s.type ? 'translateY(-4px)' : 'scale(1)',
                            boxShadow: filter === s.type ? `0 10px 20px ${cfg.bg}` : 'none'
                        }}
                            onClick={() => setFilter(filter === s.type ? 'all' : s.type)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>{s.label}</span>
                                <span style={{ color: cfg.color, padding: '8px', background: cfg.bg, borderRadius: '10px' }}>{s.icon}</span>
                            </div>
                            <div className="stat-card-value" style={{ fontSize: '28px', color: cfg.color }}>{counts[s.type] || 0}</div>
                        </div>
                    );
                })}
            </div>

            {/* Filter Bar */}
            <div className="tabs" style={{ marginBottom: '32px' }}>
                {['all', 'error', 'warning', 'security', 'info'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`tab ${filter === f ? 'active' : ''}`}
                        style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {f === 'all' ? <Filter size={16} /> : severityConfig[f].icon}
                        {f === 'all' ? 'All Alerts' : f}
                    </button>
                ))}
            </div>

            {/* Alert List */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Bell size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                        Loading alerts...
                    </div>
                ) : visible.length === 0 ? (
                    <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <CheckCircle size={48} style={{ color: '#4ade80', margin: '0 auto 16px' }} />
                        <p style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>All Clear!</p>
                        <p style={{ fontSize: '15px' }}>No alerts matching current filter.</p>
                    </div>
                ) : visible.map((alert, i) => {
                    const cfg = severityConfig[alert.type] || severityConfig.info;
                    return (
                        <div key={alert.id} style={{
                            display: 'flex', alignItems: 'flex-start', gap: '20px',
                            padding: '24px',
                            borderBottom: i < visible.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                            background: cfg.bg,
                            borderLeft: `4px solid ${cfg.color}`,
                            transition: 'background 0.2s',
                        }}
                            onMouseOver={(e) => { e.currentTarget.style.background = `linear-gradient(90deg, ${cfg.bg} 0%, rgba(255,255,255,0.03) 100%)`; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = cfg.bg; }}
                        >
                            <div style={{ color: cfg.color, marginTop: '2px', flexShrink: 0, padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>{cfg.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontWeight: '600', fontSize: '16px' }}>{alert.title}</span>
                                        <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            {alert.service}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{alert.time}</span>
                                        <button onClick={() => setDismissed(prev => new Set([...prev, alert.id]))}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                                            onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{alert.message}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Alerts;
