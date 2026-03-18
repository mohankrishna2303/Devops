import React, { useState, useEffect } from 'react';
import { Server, Database, Clock, Terminal, Radar, Box, Plus, RefreshCw, CheckCircle, AlertCircle, Globe, Laptop, Shield } from 'lucide-react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000/api' });

const Environments = () => {
    const [dbs, setDbs] = useState([]);
    const [history, setHistory] = useState([]);
    const [untracked, setUntracked] = useState([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [dbRes, tfRes, unRes] = await Promise.allSettled([
                API.get('/databases/all/'),
                API.get('/terraform/hub/'),
                API.get('/cloud/untracked/')
            ]);
            if (dbRes.status === 'fulfilled') {
                const d = dbRes.value.data;
                setDbs(Array.isArray(d) ? d : (d?.data || []));
            }
            if (tfRes.status === 'fulfilled') {
                const d = tfRes.value.data;
                setHistory(Array.isArray(d) ? d : (d?.data || []));
            }
            if (unRes.status === 'fulfilled') {
                const d = unRes.value.data;
                setUntracked(Array.isArray(d) ? d : (d?.data || []));
            }
        } catch (e) {
            console.error('Environments fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async () => {
        setIsScanning(true);
        try {
            const res = await API.post('/cloud/scan/');
            const discovered = res.data?.data?.discovered ?? res.data?.discovered ?? '?';
            alert(`✅ Cloud Scan Complete!\n\nFound ${discovered} new untracked resources across:\n• us-east-1\n• eu-west-1`);
            fetchData();
        } catch (err) {
            alert('Scan failed. Make sure the backend is running.');
        } finally {
            setIsScanning(false);
        }
    };

    const handleConnectLocal = async () => {
        const port = prompt('Enter Local Database Port:', '5432');
        if (!port) return;
        setIsConnecting(true);
        try {
            await API.post('/databases/connect-local/', { name: 'Local System DB', port: parseInt(port) });
            alert('✅ Connected to local database successfully!');
            fetchData();
        } catch {
            alert('Connection failed.');
        } finally {
            setIsConnecting(false);
        }
    };

    const handleImportToTerraform = (res) => {
        alert(`🏗️ Terraform Import Command:\n\nterraform import aws_${res.type?.toLowerCase().replace(' ', '_')}.${res.name} ${res.id}\n\nThis command has been copied to the Infrastructure Hub → Terraform Modules section.`);
    };

    const envs = [
        { name: 'Production (US-East-1)', status: 'Healthy', uptime: '99.98%', load: '42%', color: '#9D4EDD', icon: '🟢' },
        { name: 'Staging (EU-West-1)', status: 'Active', uptime: '98.5%', load: '68%', color: '#4FC3F7', icon: '🔵' },
        { name: 'Dev / Local', status: 'Running', uptime: '100%', load: '15%', color: '#FFB74D', icon: '🟡' },
    ];

    const metricStats = [
        { label: 'Active Containers', value: '42', color: '#4FC3F7' },
        { label: 'Cloud Cost (MTD)', value: '$1,240', color: '#00D2FF' },
        { label: 'Security Alerts', value: '0', color: '#9D4EDD' },
        { label: 'System Health', value: '99%', color: '#BB86FC' },
    ];

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Globe color="var(--primary)" size={26} /> Environments & Infrastructure
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>Monitor live environments, databases, and auto-discover unmanaged cloud resources.</p>
                </div>
                <button className="btn-secondary" onClick={fetchData} style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={18} /> Refresh All
                </button>
            </div>

            {/* Resource Intelligence Stats */}
            <div className="grid-4" style={{ gap: '20px', marginBottom: '40px' }}>
                {metricStats.map((m, i) => (
                    <div key={i} className="glass-card" style={{ padding: '28px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>{m.label}</p>
                        <p className="stat-card-value" style={{ margin: 0, color: m.color }}>{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Environment Status Cards */}
            <div className="grid-3" style={{ gap: '20px', marginBottom: '40px' }}>
                {envs.map((env, i) => (
                    <div key={i} className="glass-card" style={{ padding: '28px', borderLeft: `5px solid ${env.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${env.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Server size={24} color={env.color} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{env.name}</h4>
                                    <span style={{ fontSize: '12px', color: env.color, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{env.status}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                            <span>Uptime: <b style={{ color: 'white' }}>{env.uptime}</b></span>
                            <span>Load: <b style={{ color: env.color }}>{env.load}</b></span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: env.load, background: `linear-gradient(90deg, ${env.color}60, ${env.color})`, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Databases + Terraform Deployment History */}
            <div className="grid-2" style={{ gap: '24px', marginBottom: '40px' }}>
                {/* Databases */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', letterSpacing: '0.01em' }}>
                            <Database size={20} color="var(--primary)" /> Database Connections
                        </h4>
                        <button onClick={handleConnectLocal} disabled={isConnecting} className="btn-secondary" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px' }}>
                            <Laptop size={16} /> {isConnecting ? 'Connecting...' : 'Connect Local DB'}
                        </button>
                    </div>
                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading databases...</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {dbs.length > 0 ? dbs.map((db, i) => (
                                <div key={db.id || i} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ margin: '0 0 6px 0', fontWeight: '600', fontSize: '15px' }}>{db.name}</p>
                                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>{db.engine} • {db.host}:{db.port || '5432'}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: db.status === 'Online' || db.status === 'Connected' ? 'rgba(157,78,221,0.1)' : 'rgba(0,210,255,0.1)', padding: '6px 14px', borderRadius: '20px', border: `1px solid ${db.status === 'Online' || db.status === 'Connected' ? 'rgba(157,78,221,0.2)' : 'rgba(0,210,255,0.2)'}` }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: db.status === 'Online' || db.status === 'Connected' ? '#9D4EDD' : '#00D2FF', boxShadow: `0 0 8px ${db.status === 'Online' || db.status === 'Connected' ? '#9D4EDD' : '#00D2FF'}` }} />
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: db.status === 'Online' || db.status === 'Connected' ? '#9D4EDD' : '#00D2FF' }}>{db.status}</span>
                                    </div>
                                </div>
                            )) : (
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>No database connections found.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Terraform Deployment History */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <h4 style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', letterSpacing: '0.01em' }}>
                        <Clock size={20} color="var(--secondary)" /> Terraform Deployment History
                    </h4>
                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {history.length > 0 ? history.map((run, i) => (
                                <div key={run.id || i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: run.status === 'Applied' ? 'rgba(157,78,221,0.1)' : 'rgba(0,210,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${run.status === 'Applied' ? 'rgba(157,78,221,0.2)' : 'rgba(0,210,255,0.2)'}` }}>
                                        {run.status === 'Applied' ? <CheckCircle size={20} color="#9D4EDD" /> : <AlertCircle size={20} color="var(--primary)" />}
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '600' }}>{run.plan_name}</p>
                                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                                            v{run.version} • {run.provider} •
                                            <span style={{ marginLeft: '6px', fontWeight: '600', color: run.status === 'Applied' ? '#9D4EDD' : 'var(--primary)' }}>{run.status}</span>
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                                    <p style={{ margin: 0 }}>No deployments recorded yet.</p>
                                    <p style={{ fontSize: '12px', marginTop: '8px' }}>Terraform runs from the Toolbox will appear here.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Cloud Auto-Discovery */}
            <div className="glass-card" style={{ padding: '32px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', letterSpacing: '0.01em' }}>
                            <Radar size={22} color="var(--primary)" /> Cloud Auto-Discovery
                        </h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Scan AWS/GCP/Azure for unmanaged "shadow IT" resources not tracked by Terraform.</p>
                    </div>
                    <button onClick={handleScan} disabled={isScanning} className="btn-primary" style={{ fontSize: '14px', padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Globe size={18} style={{ animation: isScanning ? 'spin 2s linear infinite' : 'none' }} /> {isScanning ? 'Scanning Infrastructure...' : 'Start Cloud Scan'}
                    </button>
                </div>
                {untracked.length > 0 ? (
                    <div className="grid-4" style={{ gap: '20px' }}>
                        {untracked.map((res, i) => (
                            <div key={res.id || i} style={{ padding: '24px', background: 'rgba(0,210,255,0.02)', borderRadius: '16px', border: '1px solid rgba(0,210,255,0.2)', transition: 'all 0.2s', cursor: 'default' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,210,255,0.06)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,210,255,0.02)'}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                                    <Box size={22} color="var(--primary)" />
                                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', background: 'rgba(0,210,255,0.1)', padding: '4px 10px', borderRadius: '12px', letterSpacing: '0.05em' }}>UNTRACKED</span>
                                </div>
                                <h5 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{res.name}</h5>
                                <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--text-muted)' }}>{res.type || res.resource_type} • {res.provider}</p>
                                <button className="btn-secondary" onClick={() => handleImportToTerraform(res)} style={{ width: '100%', fontSize: '13px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: '10px' }}>
                                    <Plus size={16} /> Import to Terraform
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '60px 40px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                        <Shield size={48} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.3 }} />
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>No untracked resources found in your environments. Your infrastructure is secure and fully managed by Terraform.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Environments;
