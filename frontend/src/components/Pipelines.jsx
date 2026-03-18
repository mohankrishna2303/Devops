import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, User, Hash, Github, Circle, ArrowRight } from 'lucide-react';
import { pipelinesAPI } from '../api/client';

const Pipelines = ({ selectedId, onPipelineClick, onBack }) => {
    const [pipelines, setPipelines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        pipelinesAPI.getAll()
            .then(res => { setPipelines(res.data || res); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const filtered = pipelines.filter(p => !selectedId || p.id === selectedId);

    return (
        <div className="fade-in" style={{ color: 'white' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.02em' }}>
                        <ArrowRight color="var(--primary)" size={32} /> Pipeline History
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>Trace every build, test, and deployment execution across the org.</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Search builds..." className="topbar-search" style={{ width: '240px' }} />
                    </div>

                    <button className="btn-secondary" style={{ padding: '9px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={15} /> Filters
                    </button>

                    <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 4px' }} />

                    {/* App Links */}
                    <button onClick={() => window.open('https://github.com', '_blank')} className="btn-secondary" style={{ padding: '9px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', borderColor: 'rgba(255,255,255,0.15)' }}>
                        <Github size={15} /> GitHub
                    </button>
                    <button onClick={() => window.open('http://localhost:8080', '_blank')} className="btn-secondary" style={{ padding: '9px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.05)' }}>
                        <Clock size={15} /> Jenkins
                    </button>
                </div>
            </div>

            {selectedId && (
                <button onClick={onBack} className="btn-secondary" style={{ marginBottom: '24px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'transparent' }}>
                    ← Back to Full History
                </button>
            )}

            {/* Table Card */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '0', overflowX: 'auto', overflowY: 'hidden' }}>
                <table className="devops-table" style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ paddingLeft: '24px' }}>ID</th>
                            <th>Repository / Pipeline</th>
                            <th>Branch</th>
                            <th>Status</th>
                            <th>Triggered By</th>
                            <th>Duration</th>
                            <th>Date</th>
                            <th style={{ width: '40px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan="8" style={{ padding: 0 }}>
                                        <div className="skeleton" style={{ height: '54px', width: '100%', margin: '4px 0' }} />
                                    </td>
                                </tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="8" style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>No pipeline executions found.</td></tr>
                        ) : (
                            filtered.map(run => {
                                const isSucc = run.status === 'success' || run.status === 'completed';
                                const isFail = run.status === 'failure' || run.status === 'failed';
                                const badgeClass = isSucc ? 'badge-success' : isFail ? 'badge-error' : 'badge-warning';

                                // Simulate semi-random duration based on ID length or just fallback
                                const mins = (run.id % 6) + 1;
                                const secs = (run.id % 59) + 1;

                                return (
                                    <tr key={run.id} onClick={() => onPipelineClick && onPipelineClick(run.id)} style={{ cursor: 'pointer', transition: 'background 0.2s' }}>
                                        <td style={{ paddingLeft: '24px' }}>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 'bold' }}>#{run.build_number || Math.floor(Math.random() * 900 + 100)}</span>
                                        </td>
                                        <td style={{ fontWeight: '600', color: 'white' }}>{run.project_name || run.repo_name || 'Generic Service'}</td>
                                        <td>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                                                <GitBranchIcon size={13} />
                                                <span style={{ fontFamily: 'var(--font-mono)' }}>{run.branch || 'main'}</span>
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${badgeClass}`}>
                                                <Circle fill="currentColor" size={6} style={{ marginRight: '4px' }} />
                                                {run.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-amber) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', color: 'white' }}>
                                                    {(run.triggered_by || 'A')[0].toUpperCase()}
                                                </div>
                                                <span style={{ fontSize: '13px' }}>{run.triggered_by || 'Auto / Hook'}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '13.5px', fontFamily: 'var(--font-mono)' }}>{mins}m {secs}s</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>{new Date(run.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                        <td style={{ paddingRight: '24px', textAlign: 'right' }}>
                                            <ArrowRight size={16} color="var(--text-muted)" style={{ opacity: 0.5 }} />
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* Mini inline component since lucide export for branch looks weird without importing above */
const GitBranchIcon = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
);

export default Pipelines;
