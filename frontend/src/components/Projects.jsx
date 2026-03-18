import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Github, Link, Globe, Code, ExternalLink, RefreshCw, Box, UploadCloud, Terminal, Layers } from 'lucide-react';
import { projectsAPI } from '../api/client';
import ProjectCard from './ProjectCard';

const LANGUAGES = ['Node.js', 'Python', 'Java', 'Go'];
const FRAMEWORKS = ['Express', 'Django', 'Spring', 'Gin'];
const CLOUDS = ['AWS', 'Azure', 'GCP'];

const Projects = ({ onProjectClick }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ name: '', language: 'Node.js', framework: 'Express', cloud_provider: 'AWS', provider: 'GitHub', repo_name: '' });
    const [wizardState, setWizardState] = useState(null); // null | 'import'
    const [importStep, setImportStep] = useState(1);
    const [creationMode, setCreationMode] = useState('manual');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        projectsAPI.getAll().then(res => { setProjects(Array.isArray(res) ? res : res?.data || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const handleClick = (id) => { if (onProjectClick) onProjectClick(id); else navigate(`/projects/${id}`); };

    const startImport = (provider) => {
        setForm(f => ({ ...f, provider })); setWizardState('import'); setShowCreate(false); setImportStep(1);
    };

    const handleCreate = async (e) => {
        if (e) e.preventDefault();
        setCreating(true); setError('');
        try {
            const res = await projectsAPI.create({ name: form.name || 'New Project', language: form.language, framework: form.framework, cloud_provider: form.cloud_provider, provider: form.provider || 'GitHub', repo_name: form.repo_name || '' });
            setShowCreate(false); setWizardState(null);
            setForm({ name: '', language: 'Node.js', framework: 'Express', cloud_provider: 'AWS' });
            setProjects(prev => [...prev, res]); navigate(`/projects/${res.id}`);
        } catch (err) {
            setError(err.message || 'Create failed');
        } finally { setCreating(false); }
    };

    if (wizardState === 'import') {
        return (
            <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 0' }}>
                <button onClick={() => setWizardState(null)} className="btn-secondary" style={{ marginBottom: '32px', padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
                    ← Back to Projects
                </button>

                <div className="glass-card" style={{ padding: '48px 56px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '16px', margin: '0 0 8px' }}>
                                {form.provider === 'GitHub' ? <Github size={36} color="var(--primary)" /> : <Code size={36} color="var(--primary)" />}
                                Connect {form.provider}
                            </h2>
                            <p className="text-muted" style={{ margin: 0, fontSize: '15px' }}>Let our AI scan, build, and deploy your code automatically.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {[1, 2, 3].map(s => (
                                <div key={s} style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: importStep >= s ? 'var(--primary-soft)' : 'rgba(255,255,255,0.03)', color: importStep >= s ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '700', border: `1px solid ${importStep >= s ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}` }}>{s}</div>
                            ))}
                        </div>
                    </div>

                    <div className="section-divider" style={{ margin: '0 -56px 40px' }} />

                    {/* Step 1 */}
                    {importStep === 1 && (
                        <div className="fade-in slide-up">
                            <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Step 1: Authenticate & Select Repository</h3>
                            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {form.provider === 'GitHub' ? <Github size={28} /> : <Code size={28} />}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '15px' }}>Logged in as <span style={{ color: 'var(--primary)' }}>mohan-dev</span></h4>
                                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Connected via secure OAuth 2.0</p>
                                    </div>
                                </div>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Search Repositories</label>
                                <div style={{ position: 'relative' }}>
                                    <Globe size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input type="text" placeholder="e.g., octocat/hello-world" value={form.repo_name} onChange={e => setForm(f => ({ ...f, repo_name: e.target.value, name: e.target.value.split('/').pop() }))} style={{ width: '100%', padding: '16px 16px 16px 46px', background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '15px' }} />
                                </div>
                            </div>
                            <button className="btn-primary" style={{ padding: '14px 28px', fontSize: '15px' }} disabled={!form.repo_name} onClick={() => setImportStep(2)}>
                                Scan Infrastructure <RefreshCw size={16} style={{ marginLeft: '4px' }} />
                            </button>
                        </div>
                    )}

                    {/* Step 2 */}
                    {importStep === 2 && (
                        <div className="fade-in slide-up">
                            <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Step 2: AI Infrastructure Scanning</h3>
                            <div style={{ padding: '48px', textAlign: 'center', background: 'rgba(0,0,0,0.15)', borderRadius: '20px', border: '1px dashed var(--border)', marginBottom: '32px' }}>
                                <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto 24px' }}>
                                    <div style={{ position: 'absolute', inset: 0, border: '2px solid var(--primary)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1.5s linear infinite' }} />
                                    <Box size={28} color="var(--primary)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                                </div>
                                <h4 style={{ margin: '0 0 12px', fontSize: '20px' }}>Analyzing {form.repo_name}...</h4>
                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', maxWidth: '340px', marginInline: 'auto' }}>
                                    Detecting language frameworks, configuration files, and mapping dependency graphs.
                                </p>
                                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                    <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: '12px' }}>✓ Found Node.js 18</span>
                                    <span className="badge badge-info" style={{ padding: '6px 14px', fontSize: '12px' }}>✓ Found Dockerfile</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button className="btn-secondary" style={{ padding: '14px 28px' }} onClick={() => setImportStep(1)}>Back</button>
                                <button className="btn-primary" style={{ padding: '14px 28px' }} onClick={() => setImportStep(3)}>Verify AI Configuration</button>
                            </div>
                        </div>
                    )}

                    {/* Step 3 */}
                    {importStep === 3 && (
                        <div className="fade-in slide-up">
                            <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Step 3: Finalize & Provision</h3>
                            <div className="grid-2" style={{ gap: '24px', marginBottom: '36px' }}>
                                <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <h5 style={{ margin: '0 0 20px', fontSize: '12px', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>PROJECT DETAILS</h5>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Project Name</label>
                                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', marginBottom: '20px', padding: '12px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', color: 'white', fontSize: '16px', borderRadius: 0 }} />

                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Target Cloud Edge</label>
                                    <select value={form.cloud_provider} onChange={e => setForm(f => ({ ...f, cloud_provider: e.target.value }))} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'white', borderRadius: '10px', fontSize: '14px' }}>
                                        {CLOUDS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div style={{ padding: '24px', background: 'rgba(0,210,255,0.05)', borderRadius: '16px', border: '1px solid rgba(0,210,255,0.15)', display: 'flex', flexDirection: 'column' }}>
                                    <h5 style={{ margin: '0 0 16px', fontSize: '12px', letterSpacing: '0.06em', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><UploadCloud size={14} /> AI AUTO-PROVISIONING</h5>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>Our AI has prepared a Terraform blueprint for this project.</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e2e8f0', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                                            EKS Cluster (t3.medium)
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e2e8f0', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                                            CI/CD Pipeline injected
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e2e8f0', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                                            Snyk security tests attached
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button className="btn-secondary" style={{ padding: '14px 28px' }} onClick={() => setImportStep(2)}>Back</button>
                                <button className="btn-primary" style={{ padding: '14px 28px', flex: 1, justifyContent: 'center' }} onClick={handleCreate} disabled={creating}>
                                    {creating ? <><RefreshCw size={16} className="spinning" /> Provisioning Infrastructure...</> : 'Launch Project & Infrastructure'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in" style={{ color: 'white' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.02em' }}>
                        <Layers color="var(--primary)" size={32} /> DevOps Projects
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>Deploy directly from Git or define manually.</p>
                </div>
                <button type="button" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '10px', fontSize: '14px' }} onClick={() => setShowCreate(true)}>
                    <Plus size={18} /> Add New Project
                </button>
            </div>

            {/* Quick Create Modal */}
            {showCreate && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowCreate(false)}>
                    <div className="glass-card fade-in slide-up" style={{ padding: '40px', width: '560px', maxWidth: '95%' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Terminal size={24} color="var(--primary)" /> New Project Setup
                            </h3>
                            <button onClick={() => setShowCreate(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>

                        {/* Mode toggles */}
                        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '14px', marginBottom: '32px', border: '1px solid var(--border)' }}>
                            <button onClick={() => setCreationMode('manual')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: creationMode === 'manual' ? 'rgba(255,255,255,0.08)' : 'transparent', color: creationMode === 'manual' ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' }}>Form Builder</button>
                            <button onClick={() => setCreationMode('link')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: creationMode === 'link' ? 'rgba(0,210,255,0.15)' : 'transparent', color: creationMode === 'link' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s', border: creationMode === 'link' ? '1px solid rgba(0,210,255,0.3)' : 'border: 1px solid transparent' }}>Git Connection</button>
                        </div>

                        {error && <div style={{ padding: '14px 18px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '10px', color: '#f87171', fontSize: '13.5px', marginBottom: '24px' }}>{error}</div>}

                        <form onSubmit={handleCreate}>
                            {creationMode === 'manual' ? (
                                <div className="fade-in">
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Project Namespace</label>
                                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., identity-service-v2" style={{ width: '100%', marginBottom: '24px', padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }} required />

                                    <div className="grid-2" style={{ gap: '16px', marginBottom: '24px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Stack / Language</label>
                                            <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                                                {LANGUAGES.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Web Framework</label>
                                            <select value={form.framework} onChange={e => setForm(f => ({ ...f, framework: e.target.value }))} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                                                {FRAMEWORKS.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Deployment Cloud Target</label>
                                    <select value={form.cloud_provider} onChange={e => setForm(f => ({ ...f, cloud_provider: e.target.value }))} style={{ width: '100%', marginBottom: '40px', padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                                        {CLOUDS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                            ) : (
                                <div className="fade-in">
                                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '32px' }}>
                                            <div onClick={() => startImport('GitHub')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border)', flex: 1, transition: 'all 0.2s', className: 'no-hover-lift' }}>
                                                <Github size={32} color="white" /> <span style={{ fontSize: '13px', fontWeight: '600' }}>GitHub</span>
                                            </div>
                                            <div onClick={() => startImport('GitLab')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border)', flex: 1, transition: 'all 0.2s', className: 'no-hover-lift' }}>
                                                <Globe size={32} color="#FC6D26" /> <span style={{ fontSize: '13px', fontWeight: '600' }}>GitLab</span>
                                            </div>
                                            <div onClick={() => startImport('Bitbucket')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border)', flex: 1, transition: 'all 0.2s', className: 'no-hover-lift' }}>
                                                <Code size={32} color="#2684FF" /> <span style={{ fontSize: '13px', fontWeight: '600' }}>Bitbucket</span>
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>By connecting a repository, BrainDevOps will automatically generate Kubernetes manifests, pipelines, and provision infrastructure.</p>
                                    </div>
                                </div>
                            )}

                            {creationMode === 'manual' && (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="button" className="btn-secondary" style={{ flex: 1, padding: '14px' }} onClick={() => setShowCreate(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary" style={{ flex: 1, padding: '14px', justifyContent: 'center' }} disabled={creating}>
                                        {creating ? <><RefreshCw size={16} className="spinning" /> Creating Project...</> : 'Save & Build Configs'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton" style={{ height: '220px', width: 'min(100%, 380px)', borderRadius: '16px' }} />)}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                    {projects.map(project => <ProjectCard key={project.id} project={project} onClick={handleClick} />)}

                    {projects.length === 0 && (
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', padding: '64px 32px', textAlign: 'center', gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '16px' }}>
                            <Box size={48} color="rgba(0,210,255,0.5)" style={{ marginBottom: '24px' }} />
                            <h3 style={{ fontSize: '20px', margin: '0 0 12px', fontWeight: '600' }}>Empty Workspace</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '400px', margin: '0 0 32px', lineHeight: '1.6' }}>You haven't tracked any codebases yet. Connect a repository or create a project manually to spin up environments.</p>
                            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '10px', fontSize: '14px' }} onClick={() => setShowCreate(true)}><Plus size={18} /> Create Project</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Projects;
