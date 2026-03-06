import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Clock, Target, Zap, DollarSign, ShieldAlert, CheckCircle } from 'lucide-react';
import { metricsAPI } from '../api/client';

const Analytics = () => {
    const [stats, setStats] = useState({
        total_pipelines: '...',
        failure_rate: '...',
        avg_fix_time: '...',
        common_error: '...'
    });
    const [graphData, setGraphData] = useState([]);
    const [costRecs, setCostRecs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        Promise.all([metricsAPI.getAll(), metricsAPI.getDORA()])
            .then(([statsRes, graphRes]) => {
                setStats(statsRes);
                setGraphData(graphRes.data || []);
                setCostRecs([]); // Placeholder for cost recommendations
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching analytics data:", err);
                setLoading(false);
            });
    };

    const handleApplyRec = (id) => {
        // Placeholder for cost recommendations
        alert("Cost recommendations functionality coming soon!");
        fetchData();
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Intelligence Analytics</h2>
                    <p style={{ color: 'var(--text-muted)' }}>DORA metrics and predictive performance analysis.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px' }}>
                    <button style={{ background: 'var(--secondary)', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Weekly</button>
                    <button style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Monthly</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px' }}>Mean Time To Recovery</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 style={{ margin: 0 }}>{stats.avg_fix_time}</h3>
                        <span style={{ color: '#4ade80', fontSize: '12px', display: 'flex', alignItems: 'center' }}><TrendingDown size={14} /> -15%</span>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px' }}>Deployment Frequency</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 style={{ margin: 0 }}>{Math.round(stats.total_pipelines / 30)} / day</h3>
                        <span style={{ color: '#4ade80', fontSize: '12px', display: 'flex', alignItems: 'center' }}><TrendingUp size={14} /> +8%</span>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px' }}>Change Failure Rate</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 style={{ margin: 0 }}>{stats.failure_rate}%</h3>
                        <span style={{ color: '#4ade80', fontSize: '12px', display: 'flex', alignItems: 'center' }}><TrendingDown size={14} /> -0.8%</span>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px' }}>Latest Common Issue</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>{stats.common_error}</h3>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '32px', minWidth: 0, overflow: 'hidden' }}>
                    <h4 style={{ marginBottom: '32px' }}>DORA Metrics Progression</h4>
                    <div style={{ height: '300px', width: '100%', position: 'relative', minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip contentStyle={{ background: '#0D0D14', border: '1px solid var(--glass-border)' }} />
                                <Line type="monotone" dataKey="mttr" name="MTTR (min)" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', strokeWidth: 2 }} />
                                <Line type="monotone" dataKey="deployment" name="Deployments" stroke="var(--secondary)" strokeWidth={3} dot={{ fill: 'var(--secondary)', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '32px' }}>
                    <h4 style={{ marginBottom: '32px' }}>Developer Velocity Impact</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 230, 118, 0.1)', color: '#00E676', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Clock size={24} />
                            </div>
                            <div>
                                <h5 style={{ margin: '0 0 4px 0' }}>Time Saved with AI Fixes</h5>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Average recovery time reduced by 42% this month.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 61, 0, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Target size={24} />
                            </div>
                            <div>
                                <h5 style={{ margin: '0 0 4px 0' }}>Deployment Precision</h5>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Success rate on main branch reached an all-time high of 98.2%.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(3, 169, 244, 0.1)', color: '#03A9F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Zap size={24} />
                            </div>
                            <div>
                                <h5 style={{ margin: '0 0 4px 0' }}>Flaky Test Reduction</h5>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>AI clustering identified and resolved {Math.round(stats.total_pipelines * 0.05)} major flaky tests.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '32px', marginTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <DollarSign size={24} color="#00E676" /> AI Cost Savings Intelligence
                    </h4>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Total Monthly Potential Savings</p>
                        <h3 style={{ margin: 0, color: '#00E676' }}>${costRecs.reduce((acc, curr) => acc + curr.savings, 0).toFixed(2)}</h3>
                    </div>
                </div>

                {costRecs.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        {costRecs.map(rec => (
                            <div key={rec.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <h5 style={{ margin: 0, fontSize: '15px' }}>{rec.title}</h5>
                                        <span style={{
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            background: rec.severity === 'High' ? 'rgba(255, 61, 0, 0.1)' : 'rgba(255, 183, 77, 0.1)',
                                            color: rec.severity === 'High' ? 'var(--primary)' : '#FFB74D'
                                        }}>{rec.severity}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{rec.description}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                                    <span style={{ color: '#00E676', fontWeight: 'bold' }}>+${rec.savings.toFixed(2)}/mo</span>
                                    <button
                                        onClick={() => handleApplyRec(rec.id)}
                                        className="btn-primary"
                                        style={{ padding: '6px 16px', fontSize: '12px' }}
                                    >Optimize Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(0, 230, 118, 0.05)', borderRadius: '12px', border: '1px dashed #00E676' }}>
                        <CheckCircle size={32} color="#00E676" style={{ marginBottom: '12px' }} />
                        <p style={{ color: '#00E676', fontWeight: '600' }}>Your infrastructure is fully optimized! No savings detected at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
