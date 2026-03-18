import React, { useState, useEffect } from 'react';
import { Box, Download, ExternalLink, CheckCircle as ShieldCheck, Tag, Trash2, Search, RefreshCw, Upload, AlertTriangle } from 'lucide-react';
import { registryAPI } from '../services/apiService';

const defaultImages = [
    { name: 'braindevops-backend', tag: 'v1.4.2', size: '245MB', status: 'Scanned', vulnerabilities: 0, pulled: '12m ago' },
    { name: 'braindevops-frontend', tag: 'v1.4.1', size: '182MB', status: 'Scanned', vulnerabilities: 0, pulled: '45m ago' },
    { name: 'api-gateway-service', tag: 'latest', size: '120MB', status: 'Warning', vulnerabilities: 2, pulled: '2h ago' },
    { name: 'postgres-custom-db', tag: '15-alpine', size: '89MB', status: 'Scanned', vulnerabilities: 0, pulled: '1d ago' },
];

const Registry = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const fetchImages = async () => {
        setRefreshing(true);
        try {
            const res = await registryAPI.getImages();
            setImages(res.images || defaultImages);
        } catch {
            setImages(defaultImages);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchImages(); }, []);

    const filtered = images.filter(img =>
        !search || img.name.toLowerCase().includes(search.toLowerCase()) ||
        img.tag.toLowerCase().includes(search.toLowerCase())
    );

    const totalVulns = images.reduce((acc, img) => acc + (img.vulnerabilities || 0), 0);
    const scannedCount = images.filter(img => img.status === 'Scanned').length;

    return (
        <div className="fade-in" style={{ color: 'white' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.02em' }}>
                        <Box color="var(--primary)" size={32} /> Container Registry
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>Private Docker Hub for your organization's verified, scanned images.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button onClick={fetchImages} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}>
                        <RefreshCw size={18} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                        Refresh
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '10px', fontSize: '14px' }}>
                        <Upload size={18} />
                        Push New Image
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid-4" style={{ gap: '20px', marginBottom: '32px' }}>
                {[
                    { label: 'Total Images', value: images.length || 142, color: 'var(--primary)' },
                    { label: 'Scanned & Clean', value: `${scannedCount}/${images.length || 4}`, color: '#4ade80' },
                    { label: 'Total Vulnerabilities', value: totalVulns, color: totalVulns > 0 ? '#FFBE0B' : '#4ade80' },
                    { label: 'Storage Used', value: '14.2 GB', color: '#8338EC' },
                ].map((stat, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
                        <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>{stat.label}</p>
                        <h3 className="stat-card-value" style={{ margin: 0, fontSize: '28px', color: stat.color }}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="search-bar" style={{ marginBottom: '32px', maxWidth: '480px' }}>
                <Search size={18} className="search-icon" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    type="text" placeholder="Search images by name or tag…"
                    className="search-input" />
            </div>

            {/* Image Cards */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
                    <Box size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                    Loading registry…
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '24px' }}>
                    {filtered.map((img, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', transition: 'all 0.2s', ...(img.status === 'Warning' ? { border: '1px solid rgba(251,191,36,0.3)' } : {}) }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Box size={24} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '600' }}>{img.name}</h4>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Tag size={14} color="var(--text-muted)" />
                                                <span style={{ fontSize: '13px', color: '#3A86FF', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{img.tag}</span>
                                            </div>
                                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>• {img.size}</span>
                                        </div>
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '12px', padding: '6px 12px', borderRadius: '20px', fontWeight: '600',
                                    background: img.status === 'Scanned' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                    color: img.status === 'Scanned' ? '#4ade80' : '#FFBE0B',
                                    border: `1px solid ${img.status === 'Scanned' ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)'}`,
                                    display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                    {img.status === 'Scanned'
                                        ? <ShieldCheck size={14} />
                                        : <AlertTriangle size={14} />}
                                    {img.status.toUpperCase()}
                                    {img.vulnerabilities > 0 && ` (${img.vulnerabilities})`}
                                </span>
                            </div>

                            {/* Pull command */}
                            <div style={{ background: '#0a0a0f', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#a5b4fc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
                                <span>docker pull registry.braindevops.io/{img.name}:{img.tag}</span>
                                <Download size={16} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Last pulled {img.pulled}</span>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button title="View on Docker Hub" style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', color: 'white', cursor: 'pointer' }}>
                                        <ExternalLink size={16} />
                                    </button>
                                    <button title="Remove image" style={{ background: 'rgba(248,113,113,0.1)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Registry;
