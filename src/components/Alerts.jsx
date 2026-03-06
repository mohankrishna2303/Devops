import React from 'react';
import { Bell, Slack, Mail, Monitor, Shield, AlertCircle, Plus } from 'lucide-react';

const Alerts = () => {
    const alertHistory = [
        { title: 'Failure Cluster Triggered', msg: 'Dependency Conflict (24 occurrences) reached high severity.', time: '10m ago', type: 'Critical' },
        { title: 'Build Success Streak', msg: 'frontend-core has 50 consecutive successful builds.', time: '2h ago', type: 'Info' },
        { title: 'New Secret Detected', msg: 'Possible plaintext secret in infra-terraform #4519.', time: '5h ago', type: 'Warning' },
    ];

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Smart Alerts</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Configure intelligent notification triggers and delivery channels.</p>
                </div>
                <button className="btn-primary" style={{ padding: '10px 20px' }}>
                    <Plus size={18} style={{ marginRight: '8px' }} />
                    Create Alert Rule
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                <div>
                    <h4 style={{ marginBottom: '24px' }}>Delivery Channels</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {[
                            { name: 'Slack Integration', icon: <Slack size={24} />, status: 'Connected', desc: 'Alerts sent to #devops-alerts' },
                            { name: 'Email Notifications', icon: <Mail size={24} />, status: 'Active', desc: 'Sent to team@braindevops.ai' },
                            { name: 'In-App Alerts', icon: <Bell size={24} />, status: 'Active', desc: 'Real-time dashboard notifications' },
                            { name: 'PagerDuty', icon: <AlertCircle size={24} />, status: 'Disconnected', desc: 'On-call incident management' },
                        ].map((channel, i) => (
                            <div key={i} className="glass-card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div style={{ color: channel.status === 'Connected' || channel.status === 'Active' ? 'var(--secondary)' : 'var(--text-muted)' }}>{channel.icon}</div>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: channel.status === 'Connected' || channel.status === 'Active' ? '#4ade80' : 'var(--text-muted)' }}>{channel.status}</span>
                                </div>
                                <h5 style={{ margin: '0 0 4px 0' }}>{channel.name}</h5>
                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{channel.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 style={{ marginBottom: '24px' }}>Recent Activity</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {alertHistory.map((alert, i) => (
                            <div key={i} className="glass-card" style={{ padding: '16px', display: 'flex', gap: '16px' }}>
                                <div style={{
                                    width: '4px',
                                    borderRadius: '2px',
                                    background: alert.type === 'Critical' ? 'var(--primary)' : alert.type === 'Warning' ? '#FFB74D' : '#4ade80'
                                }}></div>
                                <div>
                                    <h5 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{alert.title}</h5>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-muted)' }}>{alert.msg}</p>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{alert.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alerts;
