import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Search, Lock, Eye, Shield as ShieldAlert, Search as Scan, AlertTriangle as FileWarning } from 'lucide-react';
import { securityAPI } from '../api/client';
import './css/Security.css';

const defaultStats = {
    score: 85,
    vulnerabilities: { critical: 0, high: 2, medium: 5, low: 12 },
    scans: [
        { name: 'SAST Scan', status: 'Passed', date: '2026-03-07' },
        { name: 'Dependency Scan', status: 'Warning', date: '2026-03-07' },
        { name: 'Container Scan', status: 'Passed', date: '2026-03-06' },
        { name: 'Secret Detection', status: 'Passed', date: '2026-03-07' },
    ]
};

const mockFindings = [
    { id: 1, severity: 'High', package: 'requests==2.28.1', cve: 'CVE-2023-32681', description: 'Leaks proxy-authorization headers.', project: 'core-app', fixed: '2.31.0' },
    { id: 2, severity: 'High', package: 'cryptography==38.0.0', cve: 'CVE-2023-23931', description: 'NULL dereference via crafted buffer.', project: 'auth-service', fixed: '39.0.1' },
    { id: 3, severity: 'Medium', package: 'pillow==9.3.0', cve: 'CVE-2023-44271', description: 'DoS via malformed image file.', project: 'media-api', fixed: '10.0.1' },
    { id: 4, severity: 'Medium', package: 'django==3.2.14', cve: 'CVE-2022-34265', description: 'SQL injection in Trunc()/Extract().', project: 'backend', fixed: '3.2.15' },
    { id: 5, severity: 'Low', package: 'certifi==2022.12.7', cve: 'CVE-2023-37920', description: 'Compromised "e-Tugra" root cert.', project: 'core-app', fixed: '2023.7.22' },
];

const scoreBand = (score) => {
    if (score >= 90) return { label: 'Excellent', color: '#4ade80' };
    if (score >= 75) return { label: 'Good', color: '#3A86FF' };
    if (score >= 60) return { label: 'Fair', color: '#FFBE0B' };
    return { label: 'At Risk', color: '#f87171' };
};

const Security = () => {
    const [stats, setStats] = useState(defaultStats);
    const [loading, setLoading] = useState(true);
    const [auditing, setAuditing] = useState(false);
    const [auditResult, setAuditResult] = useState(null);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    const fetchStats = async () => {
        try {
            const res = await securityAPI.getStats();
            setStats(res);
        } catch {
            setStats(defaultStats);
        } finally {
            setLoading(false);
        }
    };

    const runAudit = async () => {
        setAuditing(true);
        try {
            const res = await securityAPI.runAudit();
            setAuditResult(res);
            setActiveTab('audit');
        } catch {
            setAuditResult({ score: defaultStats.score, findings: mockFindings.slice(0, 3) });
            setActiveTab('audit');
        } finally {
            setAuditing(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    const { label: scoreLabel, color: scoreColor } = scoreBand(stats.score || 85);
    const filteredFindings = mockFindings.filter(f =>
        !search || f.package.toLowerCase().includes(search.toLowerCase()) ||
        f.cve.toLowerCase().includes(search.toLowerCase()) ||
        f.project.toLowerCase().includes(search.toLowerCase())
    );

    const sevColor = { Critical: '#f87171', High: '#fb923c', Medium: '#FFBE0B', Low: '#3A86FF' };

    return (
        <div className="fade-in security-page">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Shield color="var(--primary)" size={26} /> DevSecOps Security Center
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>Automated vulnerability scanning, secret detection, and compliance monitoring.</p>
                </div>
                <button onClick={runAudit} className="btn-primary" disabled={auditing}
                    style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Scan size={18} style={{ animation: auditing ? 'spin 1s linear infinite' : 'none' }} />
                    {auditing ? 'Running Audit...' : 'Run Security Audit'}
                </button>
            </div>

            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
                {[
                    { id: 'overview', label: 'Overview', icon: <Shield size={15} /> },
                    { id: 'findings', label: 'CVE Findings', icon: <ShieldAlert size={15} /> },
                    { id: 'audit', label: 'Audit Results', icon: <FileWarning size={15} /> },
                ].map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px',
                        borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px',
                        background: activeTab === t.id ? 'rgba(167,139,250,0.15)' : 'transparent',
                        color: activeTab === t.id ? '#8338EC' : 'var(--text-muted)',
                        fontWeight: activeTab === t.id ? '600' : '400'
                    }}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'overview' && (
                <>
                    {/* Security Score + Vuln breakdown */}
                    <div className="grid-2" style={{ gridTemplateColumns: '1fr 2.5fr', gap: '24px', marginBottom: '40px' }}>
                        {/* Circular score */}
                        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                                <svg width="120" height="120" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                                    <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor} strokeWidth="12"
                                        strokeDasharray={`${2 * Math.PI * 52}`}
                                        strokeDashoffset={`${2 * Math.PI * 52 * (1 - (stats.score || 85) / 100)}`}
                                        strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                                </svg>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: scoreColor }}>{stats.score || 85}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ 100</div>
                                </div>
                            </div>
                            <p style={{ fontWeight: '700', fontSize: '18px', color: scoreColor, margin: '0 0 4px' }}>{scoreLabel}</p>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Security Score</p>
                        </div>

                        {/* Vuln cards */}
                        <div className="grid-2" style={{ gap: '20px' }}>
                            {[
                                { sev: 'Critical', count: stats.vulnerabilities?.critical ?? 0, color: '#fca5a5' },
                                { sev: 'High', count: stats.vulnerabilities?.high ?? 2, color: '#fdba74' },
                                { sev: 'Medium', count: stats.vulnerabilities?.medium ?? 5, color: '#fcd34d' },
                                { sev: 'Low', count: stats.vulnerabilities?.low ?? 12, color: '#93c5fd' },
                            ].map(v => (
                                <div key={v.sev} className="glass-card" style={{ padding: '24px', borderLeft: `4px solid ${v.color}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{v.sev}</span>
                                        <AlertTriangle size={18} color={v.color} />
                                    </div>
                                    <div className="stat-card-value" style={{ color: v.color }}>{v.count}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>vulnerabilities</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Scan Status */}
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h4 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', letterSpacing: '0.01em' }}>
                            <Scan size={20} color="var(--primary)" /> Latest Scan Results
                        </h4>
                        <div className="grid-4" style={{ gap: '20px' }}>
                            {(stats.scans || defaultStats.scans).map((scan, i) => (
                                <div key={i} style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <div>
                                        <p style={{ margin: '0 0 4px', fontWeight: '600', fontSize: '14px' }}>{scan.name}</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{scan.date}</p>
                                    </div>
                                    <span style={{
                                        fontSize: '11px', padding: '4px 10px', borderRadius: '12px',
                                        background: scan.status === 'Passed' ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)',
                                        color: scan.status === 'Passed' ? '#4ade80' : '#FFBE0B',
                                        border: `1px solid ${scan.status === 'Passed' ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)'}`,
                                        display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600'
                                    }}>
                                        {scan.status === 'Passed' ? <CheckCircle size={12} /> : null}
                                        {scan.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* ── CVE FINDINGS TAB ── */}
            {activeTab === 'findings' && (
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldAlert size={20} color="var(--primary)" /> CVE Vulnerability Report
                        </h4>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search by CVE, package, or project…"
                                style={{
                                    padding: '12px 16px 12px 42px', background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border)', borderRadius: '12px', color: 'white',
                                    width: '320px', fontSize: '13px', transition: 'all 0.2s', outline: 'none'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '16px 32px', fontWeight: '600' }}>Severity</th>
                                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>CVE ID</th>
                                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>Package</th>
                                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>Description</th>
                                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>Project</th>
                                    <th style={{ padding: '16px 32px', fontWeight: '600' }}>Fix Version</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFindings.length > 0 ? filteredFindings.map(f => (
                                    <tr key={f.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '14px', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '16px 32px' }}>
                                            <span style={{ padding: '4px 10px', borderRadius: '6px', background: `${sevColor[f.severity]}15`, color: sevColor[f.severity], fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {f.severity}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 20px', color: '#8338EC', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{f.cve}</td>
                                        <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#3A86FF' }}>{f.package}</td>
                                        <td style={{ padding: '16px 20px', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: '1.5', fontSize: '13px' }}>{f.description}</td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', fontSize: '12px' }}>{f.project}</span>
                                        </td>
                                        <td style={{ padding: '16px 32px', color: '#4ade80', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{f.fixed}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No vulnerabilities found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── AUDIT RESULTS TAB ── */}
            {activeTab === 'audit' && !auditResult && (
                <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Lock size={48} style={{ display: 'block', margin: '0 auto 24px', opacity: 0.2 }} />
                    <p style={{ fontSize: '16px' }}>Click <strong>"Run Security Audit"</strong> to generate a full security report and compliance check.</p>
                </div>
            )}
            {activeTab === 'audit' && auditResult && (
                <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '18px' }}>Audit Report — {new Date().toLocaleDateString()}</h4>
                        <span style={{ fontSize: '14px', color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '6px 16px', borderRadius: '20px', fontWeight: '600', border: '1px solid rgba(74,222,128,0.2)' }}>
                            Score: {auditResult.score || 88}/100
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {(auditResult.findings || mockFindings.slice(0, 3)).map((f, i) => (
                            <div key={i} style={{ display: 'flex', gap: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)', borderLeft: `4px solid ${sevColor[f.severity] || '#3A86FF'}` }}>
                                <ShieldAlert size={20} color={sevColor[f.severity] || '#3A86FF'} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: '600', fontSize: '15px', color: 'white' }}>{f.severity} – {f.cve || f.issue}</span>
                                    </div>
                                    <p style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{f.description || f.fix}</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#3A86FF', fontFamily: 'var(--font-mono)' }}>Fix: upgrade to {f.fixed || '(latest)'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Security;
