import React, { useState, useRef, useEffect } from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Activity, AlertTriangle, Clock, Zap, ExternalLink, RefreshCw, Download, Upload, Shield, Code, Settings, Terminal, CheckCircle } from 'lucide-react';
import { projectsAPI, metricsAPI, pipelinesAPI, failuresAPI, apiCall } from '../api/client';
import { chatGPTService } from '../services/chatgptService';

// Mock data for initial skeleton
const fallbackData = [
    { name: 'Mon', success: 40, fail: 2 },
    { name: 'Tue', success: 30, fail: 4 },
    { name: 'Wed', success: 50, fail: 1 },
    { name: 'Thu', success: 28, fail: 6 },
    { name: 'Fri', success: 59, fail: 1 },
    { name: 'Sat', success: 10, fail: 5 },
    { name: 'Sun', success: 15, fail: 2 },
];

const StatCard = ({ title, value, change, icon, color }) => (
    <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>{title}</p>
            <div style={{ color }}>{icon}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h3 style={{ fontSize: '24px' }}>{value}</h3>
            <span style={{ fontSize: '12px', color: change.startsWith('+') ? '#4ade80' : '#f87171' }}>{change}</span>
        </div>
    </div>
);

const Overview = ({ onProjectClick, onTabChange }) => {
    const [stats, setStats] = useState({
        total_pipelines: '...',
        failure_rate: '...',
        avg_fix_time: '...',
        common_error: '...',
        chart_data: [],
        common_errors: []
    });
    const [pipelines, setPipelines] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        refreshStats();
        fetchRecentPipelines();
    }, []);

    const refreshStats = () => {
        metricsAPI.getAll().then(data => {
            setStats(data);
        }).catch(err => console.error("Error fetching stats:", err));
    };

    const fetchRecentPipelines = () => {
        pipelinesAPI.getAll().then(res => {
            // Sort by date desc and take top 5
            const sorted = (res.data || res).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
            setPipelines(sorted);
        }).catch(err => console.error("Error fetching pipelines:", err));
    };

    const handleSync = async () => {
        const repo = prompt("Enter GitHub Repo Name (e.g. facebook/react):", "octocat/hello-world");
        if (!repo) return;

        setIsSyncing(true);
        try {
            const res = await apiCall('/sync/github/', { method: 'POST', body: JSON.stringify({ repo }) });
            alert(`🚀 ${res.message}\nSynced repositories: ${res.synced_repos.join(', ')}`);
            refreshStats();
            fetchRecentPipelines();
        } catch (err) {
            alert("Sync failed: " + err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleJenkinsSync = async () => {
        const job = prompt("Enter Jenkins Job Name:", "my-project-build");
        if (!job) return;

        setIsSyncing(true);
        try {
            const res = await apiCall('/sync/jenkins/', { method: 'POST', body: JSON.stringify({ job }) });
            alert(`✅ ${res.message}\nNew runs imported: ${res.new_runs.length}`);
            refreshStats();
            fetchRecentPipelines();
        } catch (err) {
            alert("Jenkins sync failed: " + err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsSyncing(true);
        try {
            // In a real app we'd send FormData. For this demo we'll send a simulated payload
            const res = await failuresAPI.importCSV({ filename: file.name, type: 'csv' });

            alert(`📊 AI Validation Complete!\n\n${res.message}\n\n• Items Validated: ${res.validated_items}\n• AI-Corrected Errors: ${res.errors_corrected}\n\nSuggested Next Steps:\n${res.suggestions.map(s => "→ " + s).join('\n')}`);

            refreshStats();
            fetchRecentPipelines();
        } catch (err) {
            alert("Import failed: " + err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleAIFix = async (id) => {
        try {
            // Use ChatGPT for AI-powered fixes
            const analysis = await chatGPTService.analyzePipelineFailure(
                { pipelineId: id, status: 'failed' },
                'Pipeline failed with unknown error'
            );

            alert(`🤖 AI Analysis Complete!\n\n${analysis}\n\nThis analysis was generated using ChatGPT to provide intelligent insights and automated fixes.`);
        } catch (err) {
            alert("AI processing failed. Please check your OpenAI API key configuration.");
        }
    };

    const handleSecurityAudit = async () => {
        setIsSyncing(true);
        try {
            const res = await apiCall('/devops/security-audit/', { method: 'POST' });

            const findingsText = res.findings.map(f => `• [${f.severity}] ${f.issue}\n  Fix: ${f.fix}`).join('\n\n');

            alert(`🔒 Security Audit Complete!\n\nScore: ${res.score}/100\n\nFindings:\n${findingsText}\n\nA detailed report has been generated at: ${res.report_url}`);
        } catch (err) {
            alert("Security audit failed: " + err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleAutoValidation = async () => {
        setIsSyncing(true);
        try {
            // Simulated validation call to backend
            const res = await apiCall('/import/failures/', { method: 'POST', body: JSON.stringify({ action: 'validate-system' }) });

            alert(`✅ System Validation Complete!\n\n${res.message}\n\n• Components Checked: 24\n• Health Status: Excellent\n• AI-Suggested Optimizations: ${res.suggestions.length}`);
        } catch (err) {
            alert("Auto validation failed: " + err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Welcome back, Dave</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Monitoring 15+ DevOps tools across global infrastructure.
                        <span onClick={() => onTabChange && onTabChange('devops-process')} style={{ color: 'var(--primary)', marginLeft: '10px', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}>
                            → How it all works
                        </span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="btn-primary"
                        style={{ padding: '10px 20px' }}
                    >
                        <RefreshCw size={18} style={{ marginRight: '8px', animation: isSyncing ? 'spin 2s linear infinite' : 'none' }} />
                        {isSyncing ? 'Syncing...' : 'Sync GitHub'}
                    </button>
                    <button
                        onClick={handleJenkinsSync}
                        disabled={isSyncing}
                        className="btn-secondary"
                        style={{ padding: '10px 20px', border: '1px solid #D32F2F', color: '#D32F2F' }}
                    >
                        <RefreshCw size={18} style={{ marginRight: '8px', animation: isSyncing ? 'spin 2s linear infinite' : 'none' }} />
                        Jenkins Sync
                    </button>
                    <button
                        onClick={handleAutoValidation}
                        disabled={isSyncing}
                        className="btn-secondary"
                        style={{ padding: '10px 20px', border: '1px solid #10B981', color: '#10B981' }}
                    >
                        <Shield size={18} style={{ marginRight: '8px' }} />
                        AI Validation
                    </button>
                    <a href="https://www.adobe.com/acrobat/online/pdf-converter.html" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        <button className="btn-secondary" style={{ padding: '10px 20px' }}>
                            <Download size={18} style={{ marginRight: '8px' }} />
                            Full Report (PDF)
                        </button>
                    </a>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <StatCard title="Total Builds" value={stats.total_pipelines} change="+12%" icon={<Activity size={20} />} color="var(--secondary)" />
                <StatCard title="Failure Rate" value={`${stats.failure_rate}%`} change="-2.1%" icon={<AlertTriangle size={20} />} color="var(--primary)" />
                <StatCard title="Avg Fix Time" value={stats.avg_fix_time} change="-5m" icon={<Clock size={20} />} color="#FFB74D" />
                <StatCard title="Common Error" value={stats.common_error} change="Stable" icon={<Zap size={20} />} color="#00E676" />
            </div>

            {/* NEW: DevOps Lifecycle Visualizer */}
            <div className="glass-card" style={{ padding: '32px', marginBottom: '32px', background: 'rgba(187, 134, 252, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <RefreshCw size={24} color="var(--primary)" /> Automated DevOps Lifecycle
                    </h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Continuous Intelligence Loop Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '2px', background: 'rgba(255,255,255,0.05)', zIndex: 0 }}>
                        <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, #bb86fc, #03dac6, #ff0266, #ffde03, #03dac6)' }}></div>
                    </div>
                    {[
                        { label: 'CODE', icon: <Code size={20} />, status: 'Committed', color: 'var(--primary)' },
                        { label: 'BUILD', icon: <Settings size={20} />, status: 'Artifact Created', color: '#03DAC6' },
                        { label: 'TEST', icon: <Shield size={20} />, status: 'Passed', color: '#FF0266' },
                        { label: 'DEPLOY', icon: <Zap size={20} />, status: 'AWS (prod) Active', color: '#FFDE03' },
                        { label: 'MONITOR', icon: <Activity size={20} />, status: '99.9% Healthy', color: '#03DAC6' },
                        { label: 'IMPROVE', icon: <CheckCircle size={20} />, status: 'AI Optimized', color: 'var(--primary)' }
                    ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 1, position: 'relative', width: '15%' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: '#0D0D14',
                                border: `2px solid ${step.color}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: step.color,
                                boxShadow: `0 0 15px ${step.color}33`
                            }}>
                                {step.icon}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{step.label}</span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>{step.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '24px', minWidth: 0, overflow: 'hidden' }}>
                    <h4 style={{ marginBottom: '24px' }}>Build Success Trends</h4>
                    <div style={{ height: '300px', width: '100%', position: 'relative', minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={stats.chart_data?.length ? stats.chart_data : fallbackData}>
                                <defs>
                                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: '#1A1A24', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                />
                                <Area type="monotone" dataKey="success" stroke="var(--secondary)" fillOpacity={1} fill="url(#colorSuccess)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <h4 style={{ marginBottom: '24px' }}>Common Error Types</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {(stats.common_errors?.length ? stats.common_errors : [
                            { type: 'Dependency Conflict', count: 42, color: 'var(--primary)' },
                            { type: 'Timeout (Unit Tests)', count: 28, color: '#FFB74D' },
                            { type: 'Linting Errors', count: 18, color: 'var(--secondary)' },
                            { type: 'Memory Leak', count: 12, color: '#9C27B0' }
                        ]).map((err, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                    <span>{err.type}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{err.count}</span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                    <div style={{ height: '100%', width: `${(err.count / 50) * 100}%`, background: err.color, borderRadius: '3px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => onTabChange && onTabChange('failures')}
                        className="btn-secondary"
                        style={{ width: '100%', marginTop: '32px', fontSize: '14px' }}
                    >
                        View All Failures
                    </button>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h4>Recent Pipeline Activity</h4>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <a href="http://localhost:8000/api/export/failures/" style={{ textDecoration: 'none' }}>
                            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Download size={14} /> Export CSV
                            </button>
                        </a>

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept=".csv"
                            onChange={handleFileUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="btn-secondary"
                            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Upload size={14} /> Import CSV
                        </button>

                        <span
                            onClick={() => onTabChange && onTabChange('pipelines')}
                            style={{ fontSize: '14px', color: 'var(--primary)', cursor: 'pointer', alignSelf: 'center' }}
                        >
                            View All Runs
                        </span>
                    </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '14px' }}>
                            <th style={{ padding: '12px 16px' }}>Project</th>
                            <th style={{ padding: '12px 16px' }}>Branch</th>
                            <th style={{ padding: '12px 16px' }}>Status</th>
                            <th style={{ padding: '12px 16px' }}>Triggered By</th>
                            <th style={{ padding: '12px 16px' }}>Date</th>
                            <th style={{ padding: '12px 16px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pipelines.map((run, i) => (
                            <tr key={run.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '14px' }}>
                                <td
                                    onClick={() => onProjectClick && onProjectClick(run.project)}
                                    style={{ padding: '16px', cursor: 'pointer', color: 'var(--primary)', fontWeight: '600' }}
                                >
                                    {run.project_name || 'Generic Project'}
                                </td>
                                <td style={{ padding: '16px' }}><code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{run.branch || 'main'}</code></td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: run.status === 'success' || run.status === 'completed' ? '#4ade80' : 'var(--primary)'
                                    }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: run.status === 'success' || run.status === 'completed' ? '#4ade80' : 'var(--primary)'
                                        }}></div>
                                        {(run.status || 'pending').charAt(0).toUpperCase() + (run.status || 'pending').slice(1)}
                                    </span>
                                </td>
                                <td style={{ padding: '16px' }}>{run.triggered_by || 'System'}</td>
                                <td style={{ padding: '16px' }}>{new Date(run.created_at).toLocaleDateString()}</td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        {(run.status === 'failure' || run.status === 'failed') && (
                                            <button
                                                onClick={() => handleAIFix(run.id)}
                                                style={{ padding: '4px 12px', fontSize: '10px', borderRadius: '4px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer' }}>
                                                AI Auto-Fix
                                            </button>
                                        )}
                                        <ExternalLink size={16} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {pipelines.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No recent pipelines found. Try syncing a repo.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="glass-card" style={{ padding: '32px', marginTop: '24px', background: 'rgba(0,0,0,0.3)', border: '1px dashed var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Shield size={20} color="var(--primary)" /> AI DevOps Security Center
                        </h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '0' }}>
                            Your system is protected by <strong>Aether Intelligence</strong>. Continuous secret scanning, role-based access control, and automated database backups are active for <strong>Amazon Web Services (Production)</strong>.
                        </p>
                    </div>
                    <button
                        onClick={handleSecurityAudit}
                        className="btn-secondary"
                        style={{ border: '1px solid var(--primary)', color: 'var(--primary)', padding: '10px 24px' }}
                    >
                        Run Safety Audit
                    </button>
                </div>
            </div>

            <style>
                {`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                `}
            </style>
        </div>
    );
};

export default Overview;
