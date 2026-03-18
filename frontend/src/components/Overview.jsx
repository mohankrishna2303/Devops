import React, { useState, useRef, useEffect } from 'react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    BarChart as RechartsBarChart, Bar
} from 'recharts';
import {
    Activity, AlertTriangle, Clock, Zap, ExternalLink, RefreshCw,
    Download, Upload, Shield, Code, Settings, Terminal, CheckCircle,
    Server, ArrowRight, Share2, Box, Cpu
} from 'lucide-react';
import { metricsAPI, pipelinesAPI, apiCall } from '../api/client';
// // import chatgptService...

const fallbackData = [
    { name: 'Mon', success: 40, fail: 2 }, { name: 'Tue', success: 30, fail: 4 },
    { name: 'Wed', success: 50, fail: 1 }, { name: 'Thu', success: 28, fail: 6 },
    { name: 'Fri', success: 59, fail: 1 }, { name: 'Sat', success: 10, fail: 5 },
    { name: 'Sun', success: 15, fail: 2 },
];

const StatCard = ({ title, value, change, icon, color }) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden'
    }}
        onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
            <p className="text-muted" style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>{title}</p>
            <div style={{ color, background: `${color}15`, padding: '8px', borderRadius: '10px' }}>{icon}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <h3 className="stat-card-value" style={{ color: 'white', margin: 0, fontSize: '28px' }}>{value}</h3>
            <span style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', color: change.startsWith('+') ? '#4ade80' : change.startsWith('-') ? '#f87171' : 'var(--text-muted)' }}>{change}</span>
        </div>
    </div>
);

const Overview = ({ onProjectClick, onTabChange }) => {
    const [stats, setStats] = useState({ total_pipelines: '...', failure_rate: '...', avg_fix_time: '...', common_error: '...', chart_data: [], common_errors: [] });
    const [pipelines, setPipelines] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        metricsAPI.getAll().then(data => setStats(data)).catch(() => { });
        pipelinesAPI.getAll().then(res => setPipelines((res.data || res).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5))).catch(() => { });
    }, []);

    const handleSync = async (type) => {
        const input = prompt(`Enter ${type === 'github' ? 'GitHub Repo (owner/repo)' : 'Jenkins Job Name'}:`);
        if (!input) return;
        setIsSyncing(true);
        try {
            const res = await apiCall(`/sync/${type}/`, { method: 'POST', body: JSON.stringify(type === 'github' ? { repo: input } : { job: input }) });
            alert(`✅ Success: ${res.message}`);
            metricsAPI.getAll().then(setStats);
            pipelinesAPI.getAll().then(r => setPipelines((r.data || r).slice(0, 5)));
        } catch (err) { alert(`Sync failed: ${err.message}`); }
        setIsSyncing(false);
    };

    const handleAIFix = async (id) => {
        try {
            const analysis = "AI feature disabled";
            alert(`🤖 AI Analysis Complete!\n\n${analysis}`);
        } catch { alert("AI processing failed."); }
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.02em', color: 'white' }}>
                        Welcome back, Dave
                    </h2>
                    <p className="text-muted" style={{ margin: 0, fontSize: '15px' }}>
                        Monitoring 15+ DevOps tools across global infrastructure.
                        <span onClick={() => onTabChange && onTabChange('devops-process')} style={{ color: 'var(--primary)', marginLeft: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', borderBottom: '1px dashed var(--primary)' }}>View Process Map →</span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleSync('github')} disabled={isSyncing} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}>
                        <RefreshCw size={16} className={isSyncing ? 'spinning' : ''} /> Sync GitHub
                    </button>
                    <button onClick={() => handleSync('jenkins')} disabled={isSyncing} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.05)' }}>
                        <RefreshCw size={16} className={isSyncing ? 'spinning' : ''} /> Sync Jenkins
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '10px', fontSize: '14px' }} onClick={() => onTabChange?.('ai-assistant')}>
                        <Zap size={16} /> AI Validation
                    </button>
                </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid-4" style={{ marginBottom: '32px' }}>
                <StatCard title="Total Deployments" value={stats.total_pipelines} change="+12.5% this week" icon={<Activity size={22} />} color="#3A86FF" />
                <StatCard title="Failure Rate" value={`${stats.failure_rate}%`} change="-2.1% this week" icon={<AlertTriangle size={22} />} color="#F87171" />
                <StatCard title="MTTR (Recovery Time)" value={stats.avg_fix_time} change="-5m improvement" icon={<Clock size={22} />} color="#FFBE0B" />
                <StatCard title="System Health" value="99.9%" change="Stable" icon={<CheckCircle size={22} />} color="#4ADE80" />
            </div>

            {/* 2 Main AI Cards */}
            <div className="grid-2" style={{ marginBottom: '32px', gap: '24px' }}>
                {/* AI Predictive */}
                <div style={{ background: 'linear-gradient(145deg, rgba(0,210,255,0.05) 0%, rgba(0,0,0,0.2) 100%)', border: '1px solid rgba(0,210,255,0.2)', borderRadius: '16px', padding: '0', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid rgba(0,210,255,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}><AlertTriangle size={18} color="var(--primary)" /> Predictive Incident Alerts</h4>
                            <span className="badge badge-error">PROACTIVE</span>
                        </div>
                    </div>
                    <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', gap: '16px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '12px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFBE0B', marginTop: '6px' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Storage Exhaustion Imminent</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Kubernetes Node eks-prod-worker-2 reaching 85% capacity in ~14 hours based on current growth.</div>
                            </div>
                            <button className="btn-secondary" style={{ alignSelf: 'center', padding: '6px 14px', fontSize: '12px' }}>Auto-Scale</button>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f87171', marginTop: '6px' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Memory Leak Risk (auth-svc)</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>auth-service-v2 showing non-linear memory growth over last 72h.</div>
                            </div>
                            <button className="btn-secondary" style={{ alignSelf: 'center', padding: '6px 14px', fontSize: '12px' }}>Restart Pod</button>
                        </div>
                    </div>
                </div>

                {/* AI Optimization */}
                <div className="glass-card" style={{ padding: '0', background: 'linear-gradient(145deg, rgba(157,78,221, 0.05) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(157,78,221,0.2)' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}><Zap size={18} color="var(--secondary)" /> Cloud & Pipeline Optimization</h4>
                            <span className="badge badge-success">AIOPS ACTIVE</span>
                        </div>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#3A86FF', marginBottom: '6px' }}>🚀 BUILD TIME REDUCTION</div>
                            <div style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: 1.5 }}>
                                Build time for <code className="font-mono">frontend-app</code> increased by 45s. AI recommends implementing <strong>Docker Layer Caching</strong> in GitHub Actions.
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#8338EC', marginBottom: '6px' }}>💰 COST SAVINGS</div>
                            <div style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: 1.5 }}>
                                3 Idle EC2 instances (t3.xlarge) detected in us-east-1. Safe to terminate. Potential savings: <strong>$142/mo</strong>.
                            </div>
                        </div>
                        <button className="btn-primary" style={{ alignSelf: 'flex-start', background: 'rgba(157,78,221,0.15)', color: 'var(--secondary)', border: '1px solid rgba(157,78,221,0.4)', marginTop: 'auto' }}>
                            Apply 2 Recommendations
                        </button>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid-2" style={{ gridTemplateColumns: '60% calc(40% - 20px)', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h4 style={{ marginBottom: '24px' }}>Deployment Velocity</h4>
                    <div style={{ height: '300px', width: '100%', minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={stats.chart_data?.length ? stats.chart_data : fallbackData}>
                                <defs>
                                    <linearGradient id="colorSucc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#9D4EDD" stopOpacity={0.4} /><stop offset="95%" stopColor="#9D4EDD" stopOpacity={0} /></linearGradient>
                                    <linearGradient id="colorFail" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00D2FF" stopOpacity={0.4} /><stop offset="95%" stopColor="#00D2FF" stopOpacity={0} /></linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ background: '#12121A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                                <Area type="monotone" dataKey="success" stroke="#9D4EDD" strokeWidth={2} fill="url(#colorSucc)" />
                                <Area type="monotone" dataKey="fail" stroke="#00D2FF" strokeWidth={2} fill="url(#colorFail)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <h4 style={{ marginBottom: '24px' }}>Error Clusters</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {(stats.common_errors?.length ? stats.common_errors : [
                            { type: 'Dependency Conflict', count: 42, color: 'var(--primary)' },
                            { type: 'Test Timeout', count: 28, color: '#FFBE0B' },
                            { type: 'Linting Errors', count: 18, color: '#3A86FF' },
                            { type: 'OOM Killed', count: 12, color: '#8338EC' }
                        ]).map((err, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}>
                                    <span>{err.type}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{err.count} instances</span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(err.count / 50) * 100}%`, background: err.color, borderRadius: '3px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => onTabChange?.('failures')} className="btn-secondary" style={{ width: '100%', marginTop: '36px', justifyContent: 'center' }}>
                        Analyze All Failures <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* End to end visualization */}
            <div className="glass-card" style={{ padding: '32px', marginBottom: '32px', background: 'radial-gradient(circle at center, rgba(167,139,250,0.08) 0%, transparent 60%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}><Share2 size={20} color="var(--accent-purple)" /> DevOps Pipeline Telemetry</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-time Trace active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '22px', left: '8%', right: '8%', height: '2px', background: 'rgba(255,255,255,0.05)', zIndex: 0 }}>
                        <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, #3A86FF, #9D4EDD, #FFBE0B, #00D2FF, #8338EC)' }} className="live-dot-track"></div>
                    </div>
                    {[
                        { label: 'COSMIC IDE', icon: <Code size={20} />, status: 'Code Committed', color: '#3A86FF' },
                        { label: 'GITHUB', icon: <Activity size={20} />, status: 'Hook Triggered', color: '#9D4EDD' },
                        { label: 'JENKINS', icon: <Settings size={20} />, status: 'Build / Test', color: '#FFBE0B' },
                        { label: 'DOCKER', icon: <Box size={20} />, status: 'Image Pushed', color: '#00D2FF' },
                        { label: 'EKS CLUSTER', icon: <Cpu size={20} />, status: 'Rolling Update', color: '#8338EC' }
                    ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', zIndex: 1, width: '20%' }}>
                            <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#12121A', border: `2px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color, boxShadow: `0 0 16px ${step.color}25` }}>
                                {step.icon}
                            </div>
                            <span style={{ fontSize: '12.5px', fontWeight: '600', letterSpacing: '0.05em' }}>{step.label}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>{step.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Pipelines Table */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <h4 style={{ margin: 0 }}>Recent Executions</h4>
                    <span onClick={() => onTabChange?.('pipelines')} style={{ fontSize: '13px', color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}>View All Runs →</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Branch</th>
                            <th>Status</th>
                            <th>Triggered By</th>
                            <th>Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pipelines.map(run => (
                            <tr key={run.id}>
                                <td onClick={() => onProjectClick?.(run.project)} style={{ cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '600' }}>
                                    {run.project_name || 'Generic Project'}
                                </td>
                                <td><code className="font-mono">{run.branch || 'main'}</code></td>
                                <td>
                                    <span className={`badge ${run.status === 'success' || run.status === 'completed' ? 'badge-success' : 'badge-error'}`}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', marginRight: '4px' }} />
                                        {(run.status || 'pending').toUpperCase()}
                                    </span>
                                </td>
                                <td>{run.triggered_by || 'GitHub Hook'}</td>
                                <td>{new Date(run.created_at).toLocaleDateString()}</td>
                                <td style={{ textAlign: 'right' }}>
                                    {(run.status === 'failure' || run.status === 'failed') && (
                                        <button onClick={() => handleAIFix(run.id)} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '11px', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)', marginRight: '10px' }}>
                                            AI Fix
                                        </button>
                                    )}
                                    <ExternalLink size={15} style={{ color: 'var(--text-muted)', cursor: 'pointer', verticalAlign: 'middle' }} />
                                </td>
                            </tr>
                        ))}
                        {pipelines.length === 0 && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No recent pipelines found. Sync a repo to start tracking.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Overview;
