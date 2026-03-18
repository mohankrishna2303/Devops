import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Clock, Target, Zap, DollarSign, Zap as CloudLightning, Activity, Server, FileText } from 'lucide-react';
import { metricsAPI } from '../api/client';

const Analytics = () => {
    const [stats, setStats] = useState({ total_pipelines: 0, failure_rate: 0, avg_fix_time: '0m', common_error: 'None' });
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([metricsAPI.getAll(), metricsAPI.getDORA()])
            .then(([s, g]) => { setStats(s); setGraphData(g.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    // Placeholder mock recommendations
    const costRecs = [
        { id: 1, title: 'Idle dev environments detected', desc: '4 Kubernetes namespaces have zero traffic for 7+ days.', savings: 450, sev: 'High' },
        { id: 2, title: 'Underutilized NAT Gateway', desc: 'us-west-2 NAT gateway processing < 1GB/day.', savings: 32.50, sev: 'Low' }
    ];

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.02em' }}>
                        <Zap color="var(--primary)" size={32} /> Intelligence Analytics
                        <span className="badge badge-info" style={{ fontSize: '11px', verticalAlign: 'middle', marginLeft: '12px' }}>LIVE DORA</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>DORA metrics, predictive performance analysis, and cost optimization.</p>
                </div>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
                    <button style={{ background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid rgba(0,210,255,0.2)', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>7 Days</button>
                    <button style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>30 Days</button>
                    <button style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>All Time</button>
                </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid-4" style={{ marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>Recovery Time (MTTR)</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                        <h3 className="stat-card-value" style={{ margin: 0, color: 'white' }}>{stats.avg_fix_time}</h3>
                        <span className="badge badge-success" style={{ fontSize: '11px', padding: '2px 8px' }}><TrendingDown size={11} style={{ marginRight: '4px' }} /> 15%</span>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>Deploy Frequency</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                        <h3 className="stat-card-value" style={{ margin: 0, color: 'white' }}>{Math.round(stats.total_pipelines / 30) || 12}/day</h3>
                        <span className="badge badge-success" style={{ fontSize: '11px', padding: '2px 8px' }}><TrendingUp size={11} style={{ marginRight: '4px' }} /> 8%</span>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>Change Failure Rate</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                        <h3 className="stat-card-value" style={{ margin: 0, color: 'white' }}>{stats.failure_rate}%</h3>
                        <span className="badge badge-success" style={{ fontSize: '11px', padding: '2px 8px' }}><TrendingDown size={11} style={{ marginRight: '4px' }} /> 0.8%</span>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>Top Issue Cluster</p>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#f87171', fontWeight: '600', lineHeight: 1.2 }}>{stats.common_error}</h3>
                    </div>
                </div>
            </div>

            {/* Graphs & Impact */}
            <div className="grid-2" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '32px 32px 24px' }}>
                    <h4 style={{ margin: '0 0 32px', fontSize: '18px', letterSpacing: '0.01em' }}>DORA Metrics Progression</h4>
                    <div style={{ height: '320px', width: '100%', position: 'relative', minHeight: '320px' }}>
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={graphData.length > 0 ? graphData : [{ name: 'A', mttr: 1 }, { name: 'B', mttr: 2 }]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} dy={10} fontSize={12} />
                                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} dx={-10} fontSize={12} />
                                <Tooltip contentStyle={{ background: '#12121A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                                <Line type="monotone" dataKey="mttr" name="MTTR (min)" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary)' }} />
                                <Line type="monotone" dataKey="deployment" name="Deployments" stroke="var(--secondary)" strokeWidth={3} dot={{ fill: 'var(--secondary)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--secondary)' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '32px' }}>
                    <h4 style={{ margin: '0 0 36px', fontSize: '18px', letterSpacing: '0.01em' }}>Developer Velocity Impact</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(157,78,221, 0.1)', border: '1px solid rgba(157,78,221, 0.2)', color: '#9D4EDD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Clock size={24} />
                            </div>
                            <div>
                                <h5 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>AI Auto-Remediation</h5>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>Average issue recovery time reduced by <strong style={{ color: 'white' }}>42%</strong> this month.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,210,255, 0.1)', border: '1px solid rgba(0,210,255, 0.2)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Target size={24} />
                            </div>
                            <div>
                                <h5 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>Deployment Precision</h5>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>Success rate on main branch reached an all-time org high of <strong style={{ color: 'white' }}>98.2%</strong>.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.2)', color: '#3A86FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <CloudLightning size={24} />
                            </div>
                            <div>
                                <h5 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>Flaky Test Reduction</h5>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>AI test clustering eliminated {Math.round(stats.total_pipelines * 0.05) || 12} major flaky test suites entirely.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cost section */}
            <div className="glass-card" style={{ padding: '0', background: 'linear-gradient(135deg, rgba(157,78,221, 0.05) 0%, transparent 100%)', border: '1px solid rgba(157,78,221, 0.2)' }}>
                <div style={{ padding: '32px 32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', color: '#9D4EDD' }}>
                        <DollarSign size={24} strokeWidth={2.5} /> FinOps · Cost Optimization
                    </h4>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0 0 4px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>Monthly Savings Opportunity</p>
                        <h3 style={{ margin: 0, color: '#9D4EDD', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                            ${costRecs.reduce((a, c) => a + c.savings, 0).toFixed(2)}
                            <TrendingDown size={18} />
                        </h3>
                    </div>
                </div>

                <div style={{ padding: '32px' }}>
                    <div className="grid-2">
                        {costRecs.map(rec => (
                            <div key={rec.id} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <h5 style={{ margin: 0, fontSize: '16px', color: 'white' }}>{rec.title}</h5>
                                    <span className={`badge ${rec.sev === 'High' ? 'badge-error' : 'badge-warning'}`} style={{ fontSize: '10px' }}>{rec.sev} PRIORITY</span>
                                </div>
                                <p style={{ margin: '0 0 24px', fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{rec.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                                    <span style={{ color: '#9D4EDD', fontWeight: '700', fontSize: '15px' }}>+${rec.savings.toFixed(2)}/mo saved</span>
                                    <button className="btn-primary" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #9D4EDD', color: '#9D4EDD', boxShadow: 'none' }} onClick={() => alert('Applying automated FinOps resource termination...')}>Apply Fix</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
