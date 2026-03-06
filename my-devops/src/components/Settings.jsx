import React, { useState, useEffect } from 'react';
import { User, Globe, Code, Key, Shovel, Save, Github, Cloud, Gitlab, Database as DbIcon, ShieldCheck } from 'lucide-react';
import { getIntegrations } from '../api';

const Settings = () => {
    const [integrations, setIntegrations] = useState({ cloud: [], git: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIntegrations = async () => {
            try {
                const res = await getIntegrations();
                setIntegrations(res.data || { cloud: [], git: [] });
            } catch (err) {
                console.error('Failed to fetch integrations:', err);
                setError('Failed to load integrations');
                setIntegrations({ cloud: [], git: [] });
            } finally {
                setLoading(false);
            }
        };
        
        fetchIntegrations();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ color: 'var(--text-muted)' }}>Loading settings...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        style={{ marginTop: '16px', padding: '8px 16px', background: 'var(--primary)', border: 'none', borderRadius: '4px', color: 'white' }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Organization Settings</h2>
                <p style={{ color: 'var(--text-muted)' }}>Configure your global platform preferences and API keys.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '1200px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h4 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Globe size={20} color="var(--primary)" /> General Configuration
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Organization Name</label>
                                <input type="text" defaultValue="BrainDevOps Inc." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: 'white' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn-primary" style={{ padding: '10px 24px' }}>
                                    <Save size={18} style={{ marginRight: '8px' }} /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h4 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Cloud size={20} color="var(--secondary)" /> Cloud Connectors
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(integrations?.cloud || []).map(c => (
                                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Cloud size={16} />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{c.provider}</p>
                                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>ID: {c.account}</p>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '11px', color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>{c.status}</span>
                                </div>
                            ))}
                            <button className="btn-secondary" style={{ marginTop: '12px', fontSize: '13px' }}>+ Connect New Provider (AWS/Azure/GCP)</button>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h4 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Github size={20} color="white" /> Git & Repo Sync
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(integrations?.git || []).map(g => (
                                <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {g.provider === 'GitHub' ? <Github size={20} /> : <Gitlab size={20} color="#E24329" />}
                                        <div>
                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{g.provider}</p>
                                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>@{g.user}</p>
                                        </div>
                                    </div>
                                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>Settings</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h4 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ShieldCheck size={20} color="#4ade80" /> Security & Access
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Global Webhook Secret</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input type="text" readOnly defaultValue="whsec_88b...a7f2" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white', fontSize: '12px' }} />
                                    <button className="btn-secondary" style={{ fontSize: '12px' }}>Rotate</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
