import React, { useState, useEffect, useRef } from 'react';
import { Activity, Terminal, Search, Filter, Play, Pause, Trash2, Cpu, Database, Wifi } from 'lucide-react';
import { getTelemetry } from '../api';

const Observability = () => {
    const logEndRef = useRef(null);
    const [logs, setLogs] = useState([
        { id: 1, time: '20:30:12', level: 'INFO', msg: 'System heartbeat: healthy', source: 'k8s-node-01' },
        { id: 2, time: '20:30:15', level: 'WARN', msg: 'High latency detected in us-east-1', source: 'gateway' },
        { id: 3, time: '20:30:18', level: 'INFO', msg: 'Auto-scaling: added 1 pod to backend-svc', source: 'hpa' },
    ]);
    const [isLive, setIsLive] = useState(true);
    const [liveStats, setLiveStats] = useState({
        avg_latency: '...',
        cpu_usage: '...',
        db_connections: '...',
        error_rate: '...'
    });

    useEffect(() => {
        const fetchStats = () => {
            getTelemetry().then(res => setLiveStats(res.data));
        };
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    // Simulate live log streaming
    useEffect(() => {
        if (!isLive) return;
        const interval = setInterval(() => {
            const time = new Date().toLocaleTimeString();
            const levels = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR'];
            const level = levels[Math.floor(Math.random() * levels.length)];
            const sources = ['backend-api', 'frontend-web', 'db-proxy', 'cache-node'];
            const source = sources[Math.floor(Math.random() * sources.length)];
            const messages = [
                'Incoming request 200 OK',
                'Database query executed in 45ms',
                'Cache hit for user:session:123',
                'Garbage collection completed',
                'Connection pool reaching 80% capacity',
                'Failed to parse JWT token'
            ];
            const msg = messages[Math.floor(Math.random() * messages.length)];

            setLogs(prev => [...prev.slice(-49), { id: Date.now(), time, level, msg, source }]);
        }, 2000);
        return () => clearInterval(interval);
    }, [isLive]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Observability Center</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time telemetry, live log streaming, and system health monitors.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className="btn-primary"
                        style={{ padding: '10px 20px', background: isLive ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}
                    >
                        {isLive ? <Pause size={18} style={{ marginRight: '8px' }} /> : <Play size={18} style={{ marginRight: '8px' }} />}
                        {isLive ? 'Live Streaming' : 'Resume Stream'}
                    </button>
                    <button className="btn-secondary" style={{ padding: '10px 20px' }}>Export Logs</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                {[
                    { label: 'Avg Latency', value: liveStats.avg_latency, status: 'normal', icon: <Wifi size={20} /> },
                    { label: 'CPU Usage', value: liveStats.cpu_usage, status: 'normal', icon: <Cpu size={20} /> },
                    { label: 'DB Connections', value: liveStats.db_connections, status: 'low', icon: <Database size={20} /> },
                    { label: 'Error Rate', value: liveStats.error_rate, status: 'good', icon: <Activity size={20} /> },
                ].map((stat, i) => (
                    <div key={i} className="glass-card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px' }}>{stat.label}</span>
                            {stat.icon}
                        </div>
                        <h3 style={{ margin: 0 }}>{stat.value}</h3>
                        <div style={{ marginTop: '8px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                            <div style={{ height: '100%', width: i === 1 ? '42%' : '20%', background: 'var(--secondary)', borderRadius: '2px' }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '500px' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Terminal size={18} color="var(--primary)" />
                        <h4 style={{ margin: 0 }}>System Log Stream</h4>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="text" placeholder="Filter logs..." style={{ padding: '6px 10px 6px 30px', fontSize: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white' }} />
                        </div>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                </div>

                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {logs.map((log) => (
                        <div key={log.id} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '4px' }}>
                            <span style={{ color: 'var(--text-muted)', minWidth: '80px' }}>[{log.time}]</span>
                            <span style={{
                                fontWeight: 'bold',
                                color: log.level === 'ERROR' ? '#f87171' : log.level === 'WARN' ? '#FFB74D' : '#4ade80',
                                minWidth: '50px'
                            }}>{log.level}</span>
                            <span style={{ color: 'var(--secondary)' }}>@{log.source}</span>
                            <span style={{ color: '#eee' }}>{log.msg}</span>
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>
            </div>
        </div>
    );
};

export default Observability;
