import React, { useState, useEffect } from 'react';
import {
    Globe, Key, Github, Cloud, ShieldCheck, Save, CheckCircle,
    AlertTriangle, RefreshCw, Eye, EyeOff, Bell, Palette,
    Code, Database, Zap, Plus, Trash2, Copy
} from 'lucide-react';
import { getIntegrations } from '../api';

// ── small reusable field ──────────────────────────────────────────────────────
const Field = ({ label, type = 'text', value, onChange, placeholder, readOnly, mono }) => (
    <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '10px' }}>{label}</label>
        <input
            type={type} value={value} onChange={onChange} placeholder={placeholder}
            readOnly={readOnly}
            style={{
                width: '100%', padding: '12px 16px',
                background: readOnly ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)', borderRadius: '12px',
                color: 'white', fontSize: mono ? '13px' : '15px',
                fontFamily: mono ? 'var(--font-mono)' : 'inherit', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s'
            }}
            onFocus={e => !readOnly && (e.target.style.borderColor = 'var(--primary)')}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
    </div>
);

// ── toggle switch ─────────────────────────────────────────────────────────────
const Toggle = ({ label, desc, value, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div>
            <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '500' }}>{label}</p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</p>
        </div>
        <div onClick={onChange} style={{
            width: '42px', height: '22px', borderRadius: '11px', cursor: 'pointer', position: 'relative', flexShrink: 0,
            background: value ? 'var(--primary)' : 'rgba(255,255,255,0.1)', transition: 'background 0.25s'
        }}>
            <div style={{
                position: 'absolute', top: '3px', left: value ? '22px' : '3px',
                width: '16px', height: '16px', borderRadius: '50%', background: 'white', transition: 'left 0.25s'
            }} />
        </div>
    </div>
);

// ── section card wrapper ──────────────────────────────────────────────────────
const Section = ({ title, icon, children }) => (
    <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
        <h4 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', letterSpacing: '0.01em' }}>
            {icon} {title}
        </h4>
        {children}
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
    { id: 'general', label: 'General', icon: <Globe size={16} /> },
    { id: 'integrations', label: 'Integrations', icon: <Cloud size={16} /> },
    { id: 'api-keys', label: 'API Keys', icon: <Key size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck size={16} /> },
];

const Settings = () => {
    const [tab, setTab] = useState('general');
    const [integrations, setIntegrations] = useState({ cloud: [], git: [] });
    const [saved, setSaved] = useState(false);
    const [showKey, setShowKey] = useState({});

    // General
    const [orgName, setOrgName] = useState('BrainDevOps Inc.');
    const [region, setRegion] = useState('us-east-1');
    const [theme, setTheme] = useState('dark');

    // API Keys
    const [openAIKey, setOpenAIKey] = useState(localStorage.getItem('openai_api_key') || '');
    const [githubToken, setGithubToken] = useState(localStorage.getItem('github_token') || '');
    const [jenkinsURL, setJenkinsURL] = useState(localStorage.getItem('jenkins_url') || 'http://jenkins.example.com');
    const [awsKeyId, setAwsKeyId] = useState('');
    const [awsSecret, setAwsSecret] = useState('');
    const [webhookSecret] = useState('whsec_88b2ff0e4c91f4a7b9...a7f2');

    // Notifications
    const [notif, setNotif] = useState({
        pipelineFailure: true, deploySuccess: true, securityAlert: true,
        costAlert: false, weeklySummary: false
    });

    // Security
    const [sec, setSec] = useState({
        mfa: false, rbac: true, secretScan: true, auditLog: true
    });

    useEffect(() => {
        getIntegrations()
            .then(res => setIntegrations(res.data || res || { cloud: [], git: [] }))
            .catch(() => setIntegrations({
                cloud: [
                    { id: 1, provider: 'AWS', account: '123456789012', region: 'us-east-1', status: 'Connected' },
                ],
                git: [
                    { id: 1, provider: 'GitHub', user: 'braindevops-org', status: 'Connected' },
                ]
            }));
    }, []);

    const handleSave = () => {
        localStorage.setItem('openai_api_key', openAIKey);
        localStorage.setItem('github_token', githubToken);
        localStorage.setItem('jenkins_url', jenkinsURL);
        setSaved(true);
        setTimeout(() => setSaved(false), 2800);
    };

    const toggleKey = (k) => setShowKey(prev => ({ ...prev, [k]: !prev[k] }));

    const copyText = (text) => {
        navigator.clipboard.writeText(text).catch(() => { });
    };

    return (
        <div className="fade-in" style={{ maxWidth: '960px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px', letterSpacing: '-0.02em' }}>Platform Settings</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>Configure integrations, API keys, notifications and security policies.</p>
                </div>
                <button onClick={handleSave} className="btn-primary" style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', background: saved ? '#4ade80' : 'var(--primary)' }}>
                    {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                    {saved ? 'Saved Successfully!' : 'Save All Changes'}
                </button>
            </div>

            {saved && (
                <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '10px', padding: '12px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: '#4ade80', fontSize: '14px' }}>
                    <CheckCircle size={18} /> Settings saved successfully!
                </div>
            )}

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
                {TABS.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px',
                        background: tab === t.id ? 'rgba(0,210,255,0.15)' : 'transparent',
                        color: tab === t.id ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: tab === t.id ? '600' : '400'
                    }}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* ── GENERAL ── */}
            {tab === 'general' && (
                <>
                    <Section title="Organization" icon={<Globe size={20} color="var(--primary)" />}>
                        <Field label="Organization Name" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Your org name" />
                        <div className="grid-2" style={{ gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '10px' }}>Default AWS Region</label>
                                <select value={region} onChange={e => setRegion(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '15px', outline: 'none' }}>
                                    {['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-south-1'].map(r => (
                                        <option key={r} value={r} style={{ background: '#0a0a0f' }}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '10px' }}>Theme</label>
                                <select value={theme} onChange={e => setTheme(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '15px', outline: 'none' }}>
                                    <option value="dark" style={{ background: '#0a0a0f' }}>Premium Dark (Default)</option>
                                    <option value="darker" style={{ background: '#0a0a0f' }}>Deep Black</option>
                                </select>
                            </div>
                        </div>
                    </Section>

                    <Section title="Platform Version" icon={<Code size={18} color="#3A86FF" />}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                            {[
                                { label: 'Platform Version', value: 'v2.4.1', ok: true },
                                { label: 'Backend API', value: 'Django 4.2 / DRF 3.15', ok: true },
                                { label: 'Frontend', value: 'React 18 / Vite 5', ok: true },
                            ].map((item, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px' }}>
                                    <p style={{ margin: '0 0 4px', fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</p>
                                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: item.ok ? '#4ade80' : '#f87171' }}>{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
                </>
            )}

            {/* ── INTEGRATIONS ── */}
            {tab === 'integrations' && (
                <>
                    <Section title="Cloud Providers" icon={<Cloud size={20} color="var(--secondary)" />}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {(integrations.cloud || []).length === 0 && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No cloud providers connected yet.</p>
                            )}
                            {(integrations.cloud || []).map(c => (
                                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,153,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Cloud size={24} color="#FF9900" />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '600', fontSize: '16px' }}>{c.provider}</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Account: {c.account} · {c.region}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '6px 14px', borderRadius: '20px', fontWeight: '600', border: '1px solid rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <CheckCircle size={14} />{c.status}
                                        </span>
                                        <button style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '8px' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                            <button className="btn-secondary" style={{ alignSelf: 'flex-start', padding: '12px 24px', borderRadius: '12px' }}>
                                <Plus size={16} style={{ marginRight: '8px' }} /> Connect AWS / Azure / GCP
                            </button>
                        </div>
                    </Section>

                    <Section title="Git & Repository Providers" icon={<Github size={20} color="white" />}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {(integrations.git || []).map(g => (
                                <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Github size={24} />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '600', fontSize: '16px' }}>{g.provider}</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>@{g.user}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '6px 14px', borderRadius: '20px', fontWeight: '600', border: '1px solid rgba(74,222,128,0.2)' }}>Connected</span>
                                        <button className="btn-secondary" style={{ padding: '8px 16px', borderRadius: '10px' }}>Re-auth</button>
                                    </div>
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button className="btn-secondary" style={{ padding: '12px 24px', borderRadius: '12px' }}><Plus size={16} style={{ marginRight: '8px' }} /> GitHub</button>
                                <button className="btn-secondary" style={{ padding: '12px 24px', borderRadius: '12px' }}><Plus size={16} style={{ marginRight: '8px' }} /> GitLab</button>
                                <button className="btn-secondary" style={{ padding: '12px 24px', borderRadius: '12px' }}><Plus size={16} style={{ marginRight: '8px' }} /> Bitbucket</button>
                            </div>
                        </div>
                    </Section>

                    <Section title="CI/CD Tools" icon={<Zap size={20} color="#FFBE0B" />}>
                        <div className="grid-2" style={{ gap: '16px' }}>
                            {[
                                { name: 'Jenkins', status: 'Connected', color: '#D24939', url: jenkinsURL },
                                { name: 'GitHub Actions', status: 'Connected', color: '#2088FF', url: '' },
                                { name: 'ArgoCD', status: 'Not set up', color: '#EF7B4D', url: '' },
                                { name: 'CircleCI', status: 'Not set up', color: '#343434', url: '' },
                            ].map((t, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.color, boxShadow: `0 0 10px ${t.color}80` }} />
                                        <span style={{ fontSize: '16px', fontWeight: '600' }}>{t.name}</span>
                                    </div>
                                    <span style={{ fontSize: '13px', color: t.status === 'Connected' ? '#4ade80' : 'var(--text-muted)' }}>{t.status}</span>
                                </div>
                            ))}
                        </div>
                    </Section>
                </>
            )}

            {/* ── API KEYS ── */}
            {tab === 'api-keys' && (
                <>
                    <Section title="OpenAI Integration" icon={<Zap size={20} color="#8338EC" />}>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
                            Used for AI-powered pipeline failure analysis, code generation, and DevOps chat. Get your key at{' '}
                            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color: '#8338EC', textDecoration: 'none' }}>platform.openai.com</a>.
                        </p>
                        <div style={{ position: 'relative' }}>
                            <Field label="OpenAI API Key" type={showKey.openai ? 'text' : 'password'}
                                value={openAIKey} onChange={e => setOpenAIKey(e.target.value)}
                                placeholder="sk-…" mono />
                            <button onClick={() => toggleKey('openai')} style={{ position: 'absolute', right: '16px', top: '42px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                                {showKey.openai ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </Section>

                    <Section title="GitHub Personal Access Token" icon={<Github size={20} color="white" />}>
                        <div style={{ position: 'relative' }}>
                            <Field label="GitHub PAT (repo, workflow, read:org scopes)" type={showKey.github ? 'text' : 'password'}
                                value={githubToken} onChange={e => setGithubToken(e.target.value)}
                                placeholder="ghp_…" mono />
                            <button onClick={() => toggleKey('github')} style={{ position: 'absolute', right: '16px', top: '42px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                                {showKey.github ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </Section>

                    <Section title="Jenkins Configuration" icon={<Zap size={20} color="#D24939" />}>
                        <Field label="Jenkins Base URL" value={jenkinsURL} onChange={e => setJenkinsURL(e.target.value)} placeholder="http://jenkins.your-org.com" />
                    </Section>

                    <Section title="AWS Credentials" icon={<Cloud size={20} color="#FF9900" />}>
                        <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', fontSize: '13px', color: '#FFBE0B', display: 'flex', alignItems: 'center' }}>
                            <AlertTriangle size={18} style={{ marginRight: '10px', flexShrink: 0 }} />
                            Use IAM roles when possible. Avoid long-lived keys in production.
                        </div>
                        <div className="grid-2" style={{ gap: '20px' }}>
                            <Field label="AWS Access Key ID" value={awsKeyId} onChange={e => setAwsKeyId(e.target.value)} placeholder="AKIA…" mono />
                            <Field label="AWS Secret Access Key" type={showKey.aws ? 'text' : 'password'} value={awsSecret} onChange={e => setAwsSecret(e.target.value)} placeholder="••••••••" mono />
                        </div>
                        <button onClick={() => toggleKey('aws')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '-8px' }}>
                            {showKey.aws ? <EyeOff size={16} /> : <Eye size={16} />} {showKey.aws ? 'Hide' : 'Show'} secret key
                        </button>
                    </Section>

                    <Section title="Webhook Secret" icon={<Key size={20} color="#3A86FF" />}>
                        <div style={{ position: 'relative' }}>
                            <Field label="Global Webhook Secret (used for GitHub / Jenkins webhooks)" value={webhookSecret} readOnly mono />
                            <button onClick={() => copyText(webhookSecret)} style={{ position: 'absolute', right: '16px', top: '42px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                                <Copy size={18} />
                            </button>
                        </div>
                        <button className="btn-secondary" style={{ fontSize: '13px', padding: '10px 20px', borderRadius: '10px' }}>
                            <RefreshCw size={14} style={{ marginRight: '8px' }} /> Rotate Secret
                        </button>
                    </Section>
                </>
            )}

            {/* ── NOTIFICATIONS ── */}
            {tab === 'notifications' && (
                <Section title="Alert Preferences" icon={<Bell size={20} color="var(--primary)" />}>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>Choose which events trigger notifications in the Alerts Center and email.</p>
                    <Toggle label="Pipeline Failures" desc="Alert when a Jenkins or GitHub Actions build fails" value={notif.pipelineFailure} onChange={() => setNotif(n => ({ ...n, pipelineFailure: !n.pipelineFailure }))} />
                    <Toggle label="Deployment Success" desc="Celebrate successful Kubernetes deployments" value={notif.deploySuccess} onChange={() => setNotif(n => ({ ...n, deploySuccess: !n.deploySuccess }))} />
                    <Toggle label="Security Alerts" desc="Immediate notification of new CVEs or leaked secrets" value={notif.securityAlert} onChange={() => setNotif(n => ({ ...n, securityAlert: !n.securityAlert }))} />
                    <Toggle label="Cost Anomaly Alerts" desc="Alert when cloud spend exceeds defined threshold" value={notif.costAlert} onChange={() => setNotif(n => ({ ...n, costAlert: !n.costAlert }))} />
                    <Toggle label="Weekly Summary Email" desc="Receive a DORA metrics summary every Monday" value={notif.weeklySummary} onChange={() => setNotif(n => ({ ...n, weeklySummary: !n.weeklySummary }))} />
                </Section>
            )}

            {/* ── SECURITY ── */}
            {tab === 'security' && (
                <>
                    <Section title="Access & Authentication" icon={<ShieldCheck size={20} color="#4ade80" />}>
                        <Toggle label="Multi-Factor Authentication (MFA)" desc="Require TOTP/authenticator for all logins" value={sec.mfa} onChange={() => setSec(s => ({ ...s, mfa: !s.mfa }))} />
                        <Toggle label="Role-Based Access Control (RBAC)" desc="Enforce least-privilege for all team members" value={sec.rbac} onChange={() => setSec(s => ({ ...s, rbac: !s.rbac }))} />
                        <Toggle label="Secret Scanning" desc="Continuously scan repos for leaked tokens and keys" value={sec.secretScan} onChange={() => setSec(s => ({ ...s, secretScan: !s.secretScan }))} />
                        <Toggle label="Audit Logging" desc="Log every API action with user, timestamp, and IP" value={sec.auditLog} onChange={() => setSec(s => ({ ...s, auditLog: !s.auditLog }))} />
                    </Section>

                    <Section title="Team Members" icon={<Globe size={20} color="#3A86FF" />}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { name: 'Dave Mohan', email: 'dave@braindevops.io', role: 'Owner', color: '#8338EC' },
                                { name: 'Priya Sharma', email: 'priya@braindevops.io', role: 'Admin', color: '#3A86FF' },
                                { name: 'Alex Park', email: 'alex@braindevops.io', role: 'Dev', color: '#4ade80' },
                            ].map((m, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: m.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: m.color, border: `1px solid ${m.color}30` }}>
                                            {m.name[0]}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '600', fontSize: '15px' }}>{m.name}</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>{m.email}</p>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '12px', color: m.color, background: m.color + '15', padding: '6px 14px', borderRadius: '20px', border: `1px solid ${m.color}30`, fontWeight: '600' }}>{m.role}</span>
                                </div>
                            ))}
                            <button className="btn-secondary" style={{ alignSelf: 'flex-start', padding: '12px 24px', borderRadius: '12px', marginTop: '8px' }}>
                                <Plus size={16} style={{ marginRight: '8px' }} /> Invite Team Member
                            </button>
                        </div>
                    </Section>
                </>
            )}
        </div>
    );
};

export default Settings;
