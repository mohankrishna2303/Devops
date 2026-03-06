import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, User, Hash } from 'lucide-react';
import { pipelinesAPI } from '../api/client';

const Pipelines = ({ selectedId, onPipelineClick, onBack }) => {
    const [pipelines, setPipelines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        pipelinesAPI.getAll()
            .then(res => {
                setPipelines(res.data || res);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching pipelines:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Pipeline History</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Drill down into every build execution across the organization.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Search builds..." style={{ padding: '10px 12px 10px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                    </div>
                    <button className="btn-secondary" style={{ padding: '10px 20px' }}>
                        <Filter size={18} style={{ marginRight: '8px' }} />
                        Filters
                    </button>
                </div>
            </div>

            {selectedId && (
                <button
                    onClick={onBack}
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    &larr; Back to full history
                </button>
            )}

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '14px', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '16px 24px' }}><Hash size={14} /> ID</th>
                            <th style={{ padding: '16px 24px' }}>Project / Repository</th>
                            <th style={{ padding: '16px 24px' }}>Branch</th>
                            <th style={{ padding: '16px 24px' }}>Status</th>
                            <th style={{ padding: '16px 24px' }}><Calendar size={14} /> Date</th>
                            <th style={{ padding: '16px 24px' }}><User size={14} /> Triggered By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ padding: '32px', textAlign: 'center' }}>Loading history...</td></tr>
                        ) : (
                            pipelines
                                .filter(p => !selectedId || p.id === selectedId)
                                .map((run) => (
                                    <tr
                                        key={run.id}
                                        onClick={() => onPipelineClick && onPipelineClick(run.id)}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '14px', transition: 'background 0.2s', cursor: 'pointer' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>#{run.build_number}</td>
                                        <td style={{ padding: '16px 24px' }}>{run.project_name || 'Generic'}</td>
                                        <td style={{ padding: '16px 24px' }}><code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{run.branch}</code></td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                color: run.status === 'success' ? '#4ade80' : 'var(--primary)'
                                            }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: run.status === 'success' ? '#4ade80' : 'var(--primary)' }}></div>
                                                {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>{new Date(run.created_at).toLocaleString()}</td>
                                        <td style={{ padding: '16px 24px' }}>{run.triggered_by}</td>
                                    </tr>
                                ))
                        )}
                        {!loading && pipelines.length === 0 && (
                            <tr><td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No pipeline history found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Pipelines;
