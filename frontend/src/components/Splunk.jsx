import React, { useState, useEffect } from 'react';
import { Search, Filter, Activity, PieChart, Layers, List, Clock, Shield, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { splunkAPI } from '../api/client';

const Splunk = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeView, setActiveView] = useState('summary'); // summary, logs, search

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(isRefreshing ? false : true);
            const res = await splunkAPI.getLogs();
            setLogs(res.logs || []);
        } catch (err) {
            console.error("Splunk fetch failed:", err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const chartData = [
        { name: '16:00', errors: 12, warnings: 45 },
        { name: '16:05', errors: 18, warnings: 52 },
        { name: '16:10', errors: 45, warnings: 38 },
        { name: '16:15', errors: 30, warnings: 65 },
        { name: '16:20', errors: 25, warnings: 48 },
    ];

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchLogs();
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <PieChart color="#F0943F" size={32} /> Splunk Observability
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Aggregate logs, correlate events, and detect anomalies across all services.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleRefresh} className="btn-secondary" style={{ padding: '10px 20px' }}>
                        <RefreshCw size={18} style={{ marginRight: '8px', animation: isRefreshing ? 'spin 1.5s linear infinite' : 'none' }} />
                        Refresh Real-time
                    </button>
                    <button className="btn-primary" style={{ padding: '10px 20px', background: '#F0943F', borderColor: '#F0943F' }}>
                        <Layers size={18} style={{ marginRight: '8px' }} />
                        New Dashboard
                    </button>
                </div>
            </div>

            {/* Splunk Mission Card */}
            <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', borderLeft: '4px solid #F0943F' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#F0943F' }}>Splunk in DevOps</h4>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                    Splunk is the <strong>"Machine Data Engine"</strong> of DevOps. In this website, it acts as the central brain for
                    <strong>Log Management</strong> and <strong>Incident Response</strong>. It monitors the metrics from Prometheus,
                    logs from Kubernetes pods, and build events from GitHub Actions to provide complete full-stack visibility.
                </p>
            </div>

            {/* Top Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {[
                    { label: 'Total Events', val: '1.2M', change: '+12%', icon: <Activity size={20} />, color: '#F0943F' },
                    { label: 'Security Alerts', val: '5', change: '-2', icon: <Shield size={20} />, color: '#f87171' },
                    { label: 'Index Rate', val: '450 GB/day', change: 'Stable', icon: <Layers size={20} />, color: '#4FC3F7' },
                    { label: 'MTTR', val: '14m', change: '-5m', icon: <Clock size={20} />, color: '#9D4EDD' },
                ].map((s, i) => (
                    <div key={i} className="glass-card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.label}</span>
                            <div style={{ color: s.color }}>{s.icon}</div>
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{s.val}</div>
                        <div style={{ fontSize: '11px', color: s.change.startsWith('+') ? '#4ade80' : '#f87171', marginTop: '4px' }}>{s.change} from yesterday</div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h4 style={{ marginBottom: '20px' }}>Log Volume Over Time</h4>
                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="splunkColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F0943F" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F0943F" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
                                <Area type="monotone" dataKey="errors" stroke="#F0943F" fillOpacity={1} fill="url(#splunkColor)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <h4 style={{ marginBottom: '20px' }}>Event Source Distribution</h4>
                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'K8s', logs: 500 },
                                { name: 'Nginx', logs: 800 },
                                { name: 'DB', logs: 300 },
                                { name: 'App', logs: 1200 },
                                { name: 'Auth', logs: 400 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
                                <Bar dataKey="logs" fill="#4FC3F7" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Log Search / Viewer */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                        <button onClick={() => setActiveView('summary')} style={{ padding: '8px 16px', background: activeView === 'summary' ? '#F0943F' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '13px' }}>Dashboard</button>
                        <button onClick={() => setActiveView('logs')} style={{ padding: '8px 16px', background: activeView === 'logs' ? '#F0943F' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '13px' }}>Raw Logs</button>
                    </div>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="index=prod source=nginx-access..." style={{ width: '100%', padding: '8px 12px 8px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', fontSize: '13px' }} />
                    </div>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', fontSize: '12px', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '12px 20px' }}>TIMESTAMP</th>
                                <th style={{ padding: '12px 20px' }}>LEVEL</th>
                                <th style={{ padding: '12px 20px' }}>SERVICE</th>
                                <th style={{ padding: '12px 20px' }}>MESSAGE</th>
                                <th style={{ padding: '12px 20px' }}>SOURCE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Filtering Splunk indices...</td></tr>
                            ) : logs.map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '13px', fontFamily: '"Fira Code", monospace' }}>
                                    <td style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                                    <td style={{ padding: '12px 20px' }}>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            background: log.level === 'ERROR' ? 'rgba(248,113,113,0.1)' : log.level === 'WARNING' ? 'rgba(251,191,36,0.1)' : 'rgba(79,195,247,0.1)',
                                            color: log.level === 'ERROR' ? '#f87171' : log.level === 'WARNING' ? '#FFBE0B' : '#4FC3F7',
                                            fontSize: '11px',
                                            fontWeight: 'bold'
                                        }}>{log.level}</span>
                                    </td>
                                    <td style={{ padding: '12px 20px' }}>{log.service}</td>
                                    <td style={{ padding: '12px 20px', color: '#ddd' }}>{log.message}</td>
                                    <td style={{ padding: '12px 20px', color: 'var(--text-muted)', fontSize: '11px' }}>{log.source}</td>
                                </tr>
                            ))}
                            {!loading && logs.length === 0 && (
                                <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No logs found for current index.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Splunk;
