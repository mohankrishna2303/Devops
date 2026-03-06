import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
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
    const [form, setForm] = useState({ name: '', language: 'Node.js', framework: 'Express', cloud_provider: 'AWS' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        projectsAPI.getAll()
            .then((res) => {
                setProjects(Array.isArray(res) ? res : res?.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch projects:', err);
                setLoading(false);
            });
    }, []);

    const handleClick = (id) => {
        if (onProjectClick) onProjectClick(id);
        else navigate(`/projects/${id}`);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError('');
        try {
            const res = await projectsAPI.create({
                name: form.name || 'New Project',
                language: form.language,
                framework: form.framework,
                cloud_provider: form.cloud_provider,
                provider: 'GitHub',
                repo_name: form.repo_name || '',
            });
            setShowCreate(false);
            setForm({ name: '', language: 'Node.js', framework: 'Express', cloud_provider: 'AWS' });
            setProjects((prev) => [...prev, res]);
            navigate(`/projects/${res.id}`);
        } catch (err) {
            const d = err.response?.data;
            if (d && typeof d === 'object') {
                const parts = [];
                if (d.detail) parts.push(typeof d.detail === 'object' ? JSON.stringify(d.detail) : d.detail);
                ['name', 'language', 'framework', 'cloud_provider'].forEach((f) => {
                    if (Array.isArray(d[f])) parts.push(`${f}: ${d[f].join(' ')}`);
                });
                setError(parts.length ? parts.join(' ') : err.message || 'Create failed');
            } else {
                setError(err.message || 'Create failed');
            }
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Project Management</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your projects and AI-generated DevOps configs.</p>
                </div>
                <button type="button" className="btn-primary" style={{ padding: '10px 20px', display: 'inline-flex', alignItems: 'center' }} onClick={() => setShowCreate(true)}>
                    <Plus size={18} style={{ marginRight: '8px' }} />
                    Add New Project
                </button>
            </div>

            {showCreate && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowCreate(false)}>
                    <div className="glass-card" style={{ padding: 24, width: 400, maxWidth: '90%' }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ marginTop: 0 }}>Create Project</h3>
                        {error && <p style={{ color: 'var(--primary)', fontSize: 14 }}>{error}</p>}
                        <form onSubmit={handleCreate}>
                            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Name</label>
                            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="My App" style={{ width: '100%', marginBottom: 12, padding: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'white' }} />
                            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Language</label>
                            <select value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))} style={{ width: '100%', marginBottom: 12, padding: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'white' }}>
                                {LANGUAGES.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Framework</label>
                            <select value={form.framework} onChange={(e) => setForm((f) => ({ ...f, framework: e.target.value }))} style={{ width: '100%', marginBottom: 12, padding: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'white' }}>
                                {FRAMEWORKS.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Cloud</label>
                            <select value={form.cloud_provider} onChange={(e) => setForm((f) => ({ ...f, cloud_provider: e.target.value }))} style={{ width: '100%', marginBottom: 16, padding: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'white' }}>
                                {CLOUDS.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowCreate(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={creating}>{creating ? 'Creating...' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading projects...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={handleClick}
                        />
                    ))}
                    {projects.length === 0 && (
                        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No projects yet. Create a project from the API or connect a repo.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Projects;
