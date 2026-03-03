import React from 'react';
import { Box, Download, ExternalLink, ShieldCheck, Tag, Trash2, Search } from 'lucide-react';

const Registry = () => {
    const images = [
        { name: 'braindevops-backend', tag: 'v1.4.2', size: '245MB', status: 'Scanned', vulnerabilities: 0, pulled: '12m ago' },
        { name: 'braindevops-frontend', tag: 'v1.4.1', size: '182MB', status: 'Scanned', vulnerabilities: 0, pulled: '45m ago' },
        { name: 'api-gateway-service', tag: 'latest', size: '120MB', status: 'Warning', vulnerabilities: 2, pulled: '2h ago' },
        { name: 'postgres-custom-db', tag: '15-alpine', size: '89MB', status: 'Scanned', vulnerabilities: 0, pulled: '1d ago' },
    ];

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Container Registry</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Private Docker Hub for your organization's verified images.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Search images..." style={{ padding: '10px 12px 10px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                    </div>
                    <button className="btn-primary" style={{ padding: '10px 20px' }}>Push New Image</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
                {images.map((img, i) => (
                    <div key={i} className="glass-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(3, 169, 244, 0.1)', color: '#03A9F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{img.name}</h4>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                                        <Tag size={12} color="var(--text-muted)" />
                                        <span style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: '600' }}>{img.tag}</span>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• {img.size}</span>
                                    </div>
                                </div>
                            </div>
                            <span style={{
                                fontSize: '11px',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                background: img.status === 'Scanned' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 183, 77, 0.1)',
                                color: img.status === 'Scanned' ? '#4ade80' : '#FFB74D',
                                border: `1px solid ${img.status === 'Scanned' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 183, 77, 0.2)'}`
                            }}>
                                {img.status === 'Scanned' ? <ShieldCheck size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> : null}
                                {img.status.toUpperCase()}
                            </span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>docker pull registry.braindevops.io/{img.name}:{img.tag}</span>
                            <Download size={14} style={{ cursor: 'pointer' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pulled {img.pulled}</span>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><ExternalLink size={16} /></button>
                                <button style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-card" style={{ marginTop: '32px', padding: '32px' }}>
                <h4 style={{ marginBottom: '24px' }}>Registry Statistics</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                    {[
                        { label: 'Total Images', value: '142' },
                        { label: 'Storage Used', value: '14.2 GB' },
                        { label: 'Bandwidth (Monthly)', value: '820 GB' },
                        { label: 'Vulnerabilities Fixed', value: '89' }
                    ].map((stat, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</p>
                            <h3 style={{ margin: 0, fontSize: '24px' }}>{stat.value}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Registry;
