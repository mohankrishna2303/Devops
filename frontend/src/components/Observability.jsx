import React, { useState, useEffect, useRef } from 'react';
import {
    Activity, Terminal, Search, Play, Pause, Trash2,
    Cpu, Database, Wifi, RefreshCw, BarChart2, Download, Eye
} from 'lucide-react';
import { getTelemetry } from '../api';

const LOG_MESSAGES = [
    { level: 'INFO', msgs: ['Incoming request 200 OK /api/projects/', 'Cache hit for user:session:881', 'Database query executed in 34ms', 'Garbage collection completed in 12ms'] },
    { level: 'WARN', msgs: ['Connection pool reaching 80% capacity', 'Response time spike: 1.4s on /api/k8s/fleet/', 'Auth token expires in 5 minutes'] },
    { level: 'ERROR', msgs: ['Failed to parse JWT token', 'Timeout connecting to redis:6379', '503 from upstream payment-gateway'] },
];

const pickLog = () => {
    const pick = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
    const sources = ['backend-api', 'frontend-web', 'db-proxy', 'cache-node', 'k8s-hpa'];
    return {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        level: pick.level,
        msg: pick.msgs[Math.floor(Math.random() * pick.msgs.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
    };
};

const levelColor = { INFO: '#4ade80', WARN: '#FFBE0B', ERROR: '#f87171' };

const GRAFANA_PANELS = [
    { id: 1, label: 'Request Rate (req/s)', value: '142', trend: '+8%', color: '#3A86FF', unit: 'req/s' },
    { id: 2, label: 'Error Rate', value: '0.4%', trend: '-0.1%', color: '#4ade80', unit: '' },
    { id: 3, label: 'P99 Latency', value: '210ms', trend: '-15ms', color: '#8338EC', unit: '' },
    { id: 4, label: 'Active Connections', value: '841', trend: '+22', color: '#FFBE0B', unit: '' },
];

const Observability = () => {
    const logEndRef = useRef(null);
    const [logs, setLogs] = useState([
        { id: 1, time: '14:30:12', level: 'INFO', msg: 'System heartbeat: healthy. All pods running.', source: 'k8s-node-01' },
        { id: 2, time: '14:30:15', level: 'WARN', msg: 'High latency detected in us-east-1 (1.2s)', source: 'gateway' },
        { id: 3, time: '14:30:18', level: 'INFO', msg: 'Auto-scaling: added 1 pod to backend-svc', source: 'hpa' },
        { id: 4, time: '14:30:22', level: 'ERROR', msg: 'Timeout connecting to cache: redis:6379', source: 'backend-api' },
        { id: 5, time: '14:30:31', level: 'INFO', msg: '200 OK /api/dashboard/ — 38ms', source: 'nginx' },
    ]);
    const [isLive, setIsLive] = useState(true);
    const [filterLevel, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [activeView, setView] = useState('metrics'); // 'metrics' | 'logs' | 'grafana'
    const [liveStats, setLiveStats] = useState({
        avg_latency: '82ms', cpu_usage: '42%', db_connections: 124, error_rate: '0.4%'
    });

    // Fetch telemetry from backend
    useEffect(() => {
        const fetchStats = () => {
            getTelemetry()
                .then(res => setLiveStats(res.data || res))
                .catch(() => { }); // keep defaults on error
        };
        fetchStats();
        const iv = setInterval(fetchStats, 8000);
        return () => clearInterval(iv);
    }, []);

    // Simulate live log streaming
    useEffect(() => {
        if (!isLive) return;
        const iv = setInterval(() => {
            setLogs(prev => [...prev.slice(-74), pickLog()]);
        }, 2200);
        return () => clearInterval(iv);
    }, [isLive]);

    useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

    const visibleLogs = logs.filter(l =>
        (filterLevel === 'ALL' || l.level === filterLevel) &&
        (!search || l.msg.toLowerCase().includes(search.toLowerCase()) || l.source.toLowerCase().includes(search.toLowerCase()))
    );

    const VIEWS = [
        { id: 'metrics', label: 'Live Metrics', icon: <Activity size={15} /> },
        { id: 'logs', label: 'Log Stream', icon: <Terminal size={15} /> },
        { id: 'grafana', label: 'Grafana', icon: <BarChart2 size={15} /> },
    ];

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Activity color="var(--secondary)" size={32} /> Observability Center
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time telemetry, live log streaming, and Grafana dashboards.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setIsLive(!isLive)} className="btn-primary"
                        style={{ padding: '10px 20px', background: isLive ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}>
                        {isLive ? <Pause size={18} style={{ marginRight: '8px' }} /> : <Play size={18} style={{ marginRight: '8px' }} />}
                        {isLive ? 'Pause Stream' : 'Resume Stream'}
                    </button>
                    <button className="btn-secondary" style={{ padding: '10px 20px' }}>
                        <Download size={18} style={{ marginRight: '8px' }} /> Export Logs
                    </button>
                </div>
            </div>

            {/* View tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
                {VIEWS.map(v => (
                    <button key={v.id} onClick={() => setView(v.id)} style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px',
                        borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px',
                        background: activeView === v.id ? 'rgba(157,78,221,0.12)' : 'transparent',
                        color: activeView === v.id ? 'var(--secondary)' : 'var(--text-muted)',
                        fontWeight: activeView === v.id ? '600' : '400'
                    }}>
                        {v.icon} {v.label}
                    </button>
                ))}
            </div>

            {/* ── METRICS VIEW ── */}
            {activeView === 'metrics' && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
                        {[
                            { label: 'Avg Latency', value: liveStats?.avg_latency || '82ms', icon: <Wifi size={20} />, color: '#3A86FF' },
                            { label: 'CPU Usage', value: liveStats?.cpu_usage || '42%', icon: <Cpu size={20} />, color: '#FFBE0B' },
                            { label: 'DB Connections', value: liveStats?.db_connections || '124', icon: <Database size={20} />, color: '#8338EC' },
                            { label: 'Error Rate', value: liveStats?.error_rate || '0.4%', icon: <Activity size={20} />, color: liveStats?.error_rate > '1%' ? '#f87171' : '#4ade80' },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '12px' }}>{stat.label}</span>
                                    <span style={{ color: stat.color }}>{stat.icon}</span>
                                </div>
                                <h3 style={{ margin: '0 0 10px', fontSize: '24px', color: stat.color }}>{stat.value}</h3>
                                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                                    <div style={{ height: '100%', width: `${20 + i * 18}%`, background: stat.color, borderRadius: '2px', transition: 'width 1s ease' }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Grafana-style metric panels */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        {GRAFANA_PANELS.map(panel => (
                            <div key={panel.id} className="glass-card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{panel.label}</span>
                                    <Eye size={16} color="var(--text-muted)" />
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: '700', color: panel.color, marginBottom: '8px' }}>
                                    {panel.value}
                                </div>
                                <div style={{ fontSize: '12px', color: panel.trend.startsWith('+') ? '#4ade80' : '#f87171' }}>
                                    {panel.trend} vs last hour
                                </div>
                                {/* Mini spark-line simulation */}
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', marginTop: '16px', height: '40px' }}>
                                    {Array.from({ length: 20 }, (_, i) => (
                                        <div key={i} style={{
                                            flex: 1, background: panel.color + '55',
                                            height: `${30 + Math.sin(i + panel.id) * 20}%`,
                                            borderRadius: '2px', minHeight: '4px'
                                        }} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ── LOG STREAM VIEW ── */}
            {activeView === 'logs' && (
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '600px' }}>
                    {/* Toolbar */}
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Terminal size={18} color="var(--primary)" />
                            <h4 style={{ margin: 0, fontSize: '14px' }}>
                                Live System Logs {isLive && <span style={{ fontSize: '10px', color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>● LIVE</span>}
                            </h4>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {/* Level filter */}
                            {['ALL', 'INFO', 'WARN', 'ERROR'].map(l => (
                                <button key={l} onClick={() => setFilter(l)} style={{
                                    padding: '4px 10px', borderRadius: '6px', border: 'none', fontSize: '11px', cursor: 'pointer',
                                    background: filterLevel === l ? (levelColor[l] || 'var(--primary)') + '22' : 'transparent',
                                    color: filterLevel === l ? (levelColor[l] || 'white') : 'var(--text-muted)',
                                    fontWeight: filterLevel === l ? '700' : '400'
                                }}>{l}</button>
                            ))}
                            {/* Search */}
                            <div style={{ position: 'relative' }}>
                                <Search size={13} style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter…"
                                    style={{ padding: '5px 9px 5px 28px', fontSize: '12px', background: 'rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white', width: '150px' }} />
                            </div>
                            <button onClick={() => setLogs([])} title="Clear logs" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Log lines */}
                    <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(0,0,0,0.15)' }}>
                        {visibleLogs.map(log => (
                            <div key={log.id} style={{ display: 'flex', gap: '14px', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                <span style={{ color: 'rgba(255,255,255,0.25)', minWidth: '85px', flexShrink: 0 }}>[{log.time}]</span>
                                <span style={{ fontWeight: '700', color: levelColor[log.level], minWidth: '46px', flexShrink: 0 }}>{log.level}</span>
                                <span style={{ color: 'var(--secondary)', minWidth: '110px', flexShrink: 0 }}>@{log.source}</span>
                                <span style={{ color: '#e2e8f0' }}>{log.msg}</span>
                            </div>
                        ))}
                        {visibleLogs.length === 0 && (
                            <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '60px' }}>No logs matching current filter.</div>
                        )}
                        <div ref={logEndRef} />
                    </div>
                </div>
            )}

            {/* ── GRAFANA VIEW ── */}
            {activeView === 'grafana' && (
                <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
                    <BarChart2 size={48} color="var(--primary)" style={{ display: 'block', margin: '0 auto 16px', opacity: 0.4 }} />
                    <h3 style={{ marginBottom: '12px' }}>Grafana Dashboard</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>
                        Embed your live Grafana dashboards directly in the platform. Configure the Grafana URL in Settings → Integrations to enable embedded panels.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="http://localhost:3000" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <button className="btn-primary" style={{ padding: '12px 28px' }}>
                                Open Grafana Dashboard ↗
                            </button>
                        </a>
                        <button className="btn-secondary" style={{ padding: '12px 28px' }}>
                            Configure Embed URL
                        </button>
                    </div>

                    {/* Simulated panel previews */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '40px' }}>
                        {['CPU Over Time', 'Memory Usage', 'HTTP Status Codes', 'Pod Restarts', 'Network I/O', 'Disk Latency'].map((title, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '16px', textAlign: 'left', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 12px' }}>{title}</p>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '48px' }}>
                                    {Array.from({ length: 24 }, (_, j) => (
                                        <div key={j} style={{
                                            flex: 1,
                                            height: `${25 + Math.abs(Math.sin((i + j) * 0.7)) * 75}%`,
                                            background: `hsl(${(i * 60 + 200) % 360}, 70%, 55%)`,
                                            borderRadius: '1px', opacity: 0.7
                                        }} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Observability;
