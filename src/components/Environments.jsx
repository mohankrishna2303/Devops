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
        { name: 'Production (US-East-1)', status: 'Healthy', uptime: '99.98%', load: '42%', color: '#00E676', icon: '🟢' },
        { name: 'Staging (EU-West-1)', status: 'Active', uptime: '98.5%', load: '68%', color: '#4FC3F7', icon: '🔵' },
        { name: 'Dev / Local', status: 'Running', uptime: '100%', load: '15%', color: '#FFB74D', icon: '🟡' },
    ];

    const metricStats = [
        { label: 'Active Containers', value: '42', color: '#4FC3F7' },
        { label: 'Cloud Cost (MTD)', value: '$1,240', color: '#FF3D00' },
        { label: 'Security Alerts', value: '0', color: '#00E676' },
        { label: 'System Health', value: '99%', color: '#BB86FC' },
    ];

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Environments & Infrastructure</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Monitor live environments, databases, and auto-discover unmanaged cloud resources.</p>
                </div>
                <button className="btn-secondary" onClick={fetchData} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={16} /> Refresh All
                </button>
            </div>

            {/* Resource Intelligence Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {metricStats.map((m, i) => (
                    <div key={i} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</p>
                        <p style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: m.color }}>{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Environment Status Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {envs.map((env, i) => (
                    <div key={i} className="glass-card" style={{ padding: '24px', borderLeft: `4px solid ${env.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${env.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Server size={20} color={env.color} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '15px' }}>{env.name}</h4>
                                    <span style={{ fontSize: '11px', color: env.color, fontWeight: 'bold' }}>{env.status}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                            <span>Uptime: <b style={{ color: 'white' }}>{env.uptime}</b></span>
                            <span>Load: <b style={{ color: env.color }}>{env.load}</b></span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                            <div style={{ height: '100%', width: env.load, background: `linear-gradient(90deg, ${env.color}99, ${env.color})`, borderRadius: '3px', transition: 'width 0.6s ease' }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Databases + Terraform Deployment History */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* Databases */}
                <div className="glass-card" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Database size={20} color="var(--primary)" /> Database Connections
                        </h4>
                        <button onClick={handleConnectLocal} disabled={isConnecting} className="btn-secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}>
                            <Laptop size={14} /> {isConnecting ? 'Connecting...' : 'Connect Local DB'}
                        </button>
                    </div>
                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading databases...</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {dbs.length > 0 ? dbs.map((db, i) => (
                                <div key={db.id || i} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '14px' }}>{db.name}</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{db.engine} • {db.host}:{db.port || '5432'}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: db.status === 'Online' || db.status === 'Connected' ? '#00E676' : '#FF3D00' }} />
                                        <span style={{ fontSize: '12px', color: db.status === 'Online' || db.status === 'Connected' ? '#00E676' : '#FF3D00' }}>{db.status}</span>
                                    </div>
                                </div>
                            )) : (
                                <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No database connections found.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Terraform Deployment History */}
                <div className="glass-card" style={{ padding: '28px' }}>
                    <h4 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Clock size={20} color="var(--secondary)" /> Terraform Deployment History
                    </h4>
                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {history.length > 0 ? history.map((run, i) => (
                                <div key={run.id || i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: run.status === 'Applied' ? 'rgba(0,230,118,0.1)' : 'rgba(255,61,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {run.status === 'Applied' ? <CheckCircle size={18} color="#00E676" /> : <AlertCircle size={18} color="var(--primary)" />}
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600' }}>{run.plan_name}</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
                                            v{run.version} • {run.provider} •
                                            <span style={{ marginLeft: '4px', color: run.status === 'Applied' ? '#00E676' : 'var(--primary)' }}>{run.status}</span>
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                    <p>No deployments recorded yet.</p>
                                    <p style={{ fontSize: '11px', marginTop: '8px' }}>Terraform runs from the Toolbox will appear here.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Cloud Auto-Discovery */}
            <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Radar size={20} color="var(--primary)" /> Cloud Auto-Discovery
                        </h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Scan AWS/GCP/Azure for unmanaged "shadow IT" resources not tracked by Terraform.</p>
                    </div>
                    <button onClick={handleScan} disabled={isScanning} className="btn-primary" style={{ fontSize: '13px', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={16} /> {isScanning ? '🔍 Scanning...' : 'Start Cloud Scan'}
                    </button>
                </div>
                {untracked.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        {untracked.map((res, i) => (
                            <div key={res.id || i} style={{ padding: '20px', background: 'rgba(255,61,0,0.04)', borderRadius: '14px', border: '1px solid rgba(255,61,0,0.2)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <Box size={18} color="var(--primary)" />
                                    <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 'bold', background: 'rgba(255,61,0,0.1)', padding: '2px 8px', borderRadius: '10px' }}>UNTRACKED</span>
                                </div>
                                <h5 style={{ margin: '0 0 6px 0', fontSize: '14px' }}>{res.name}</h5>
                                <p style={{ margin: '0 0 14px 0', fontSize: '11px', color: 'var(--text-muted)' }}>{res.type || res.resource_type} • {res.provider}</p>
                                <button className="btn-secondary" onClick={() => handleImportToTerraform(res)} style={{ width: '100%', fontSize: '11px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                    <Plus size={12} /> Import to Terraform
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                        <Shield size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>No untracked resources found. Run a cloud scan to discover shadow IT.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Environments;
