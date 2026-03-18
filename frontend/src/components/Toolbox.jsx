import React, { useState, useEffect } from 'react';
import {
    Terminal, Database, Lock, Container, Cpu, Plus, Eye, EyeOff,
    RefreshCcw, Box, Code, Play, FileCode, Wrench, Search, ShieldCheck,
    Activity, Trash2, GitBranch, Zap, CheckCircle, AlertCircle, Download, Upload, Server
} from 'lucide-react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000/api' });

const DEVOPS_ROLES = [
    {
        title: 'Infrastructure Engineer (IaC)',
        color: '#00D2FF',
        icon: '🏗️',
        tools: ['Terraform', 'AWS', 'Ansible'],
        tasks: [
            'Write terraform/ modules for VPC, EKS, S3',
            'Run terraform plan → apply in the Toolbox below',
            'Track state via backend S3 + DynamoDB lock',
            'Review destroyed resources before terraform destroy',
        ]
    },
    {
        title: 'CI/CD Engineer',
        color: '#4FC3F7',
        icon: '⚙️',
        tools: ['GitHub Actions', 'Jenkins', 'Docker'],
        tasks: [
            'Create .github/workflows/ pipeline YAML',
            'Sync Jenkins jobs via the "Jenkins Sync" button',
            'Build Docker images on every git push',
            'Push images to ECR / Docker Hub',
        ]
    },
    {
        title: 'Site Reliability Engineer (SRE)',
        color: '#9D4EDD',
        icon: '📡',
        tools: ['Kubernetes', 'Prometheus', 'PagerDuty'],
        tasks: [
            'Monitor K8s fleet health in the K8s tab',
            'Set up HPA auto-scaling for EKS node groups',
            'Define SLO/SLA thresholds (99.9% uptime)',
            'Run incident response drills with stress tests',
        ]
    },
    {
        title: 'DevSecOps Engineer',
        color: '#BB86FC',
        icon: '🔒',
        tools: ['Snyk', 'OWASP', 'Vault'],
        tasks: [
            'Scan repos for secrets with "Secret Leak Scanner"',
            'Run SAST/DAST in CI pipeline before deploy',
            'Rotate credentials stored in Secrets Vault',
            'Run Security Audit from overview dashboard',
        ]
    },
];

const Toolbox = () => {
    const [showSecrets, setShowSecrets] = useState(false);
    const [infraHub, setInfraHub] = useState([]);
    const [k8sFleet, setK8sFleet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [tfFiles, setTfFiles] = useState({});
    const [activeTfFile, setActiveTfFile] = useState('');
    const [activeRoleTab, setActiveRoleTab] = useState(0);
    const [syncStatus, setSyncStatus] = useState({ github: null, jenkins: null });

    useEffect(() => {
        fetchAll();
        fetchTfFiles();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [tfRes, k8sRes] = await Promise.allSettled([
                API.get('/terraform/hub/'),
                API.get('/k8s/fleet/')
            ]);
            if (tfRes.status === 'fulfilled') {
                const d = tfRes.value.data;
                setInfraHub(Array.isArray(d) ? d : (d?.data || []));
            }
            if (k8sRes.status === 'fulfilled') {
                const d = k8sRes.value.data;
                setK8sFleet(Array.isArray(d) ? d : (d?.data || []));
            }
        } catch (e) {
            console.error('Toolbox fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchTfFiles = async () => {
        const files = ['terraform/main.tf', 'terraform/variables.tf', 'terraform/outputs.tf'];
        const fileData = {};
        for (const f of files) {
            try {
                const res = await API.get(`/files/read/?path=${f}`);
                fileData[f.split('/').pop()] = res.data.content;
            } catch (e) {
                console.error(`Failed to read ${f}`, e);
            }
        }
        if (Object.keys(fileData).length > 0) {
            setTfFiles(fileData);
            setActiveTfFile(prev => prev && fileData[prev] ? prev : Object.keys(fileData)[0]);
        }
    };

    const handleRunTerraform = async (planName) => {
        setIsLoading(true);
        try {
            const res = await API.post('/terraform/apply/', { plan_name: planName });
            alert(`✅ Terraform Apply Success!\n\n${res.data?.message || 'Plan applied.'}\n\nResources updated in the Environments tab.`);
            fetchAll();
        } catch {
            alert('❌ Terraform apply failed. Check backend logs.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleScale = async (id) => {
        const count = prompt('Enter target instance count:', '2');
        if (!count) return;
        try {
            const res = await API.post('/terraform/scale/', { plan_id: id, instance_count: parseInt(count) });
            alert(`✅ Scaled! ${res.data?.message}`);
            fetchAll();
        } catch {
            alert('Scale failed.');
        }
    };

    const handleDestroy = async (id, name) => {
        if (!window.confirm(`⚠️ WARNING: This will DESTROY all infrastructure for "${name}".\n\nAre you sure?`)) return;
        try {
            const res = await API.post('/terraform/destroy/', { plan_id: id });
            alert(`✅ ${res.data?.message}`);
            fetchAll();
        } catch {
            alert('Destroy failed.');
        }
    };

    const handleSyncGitHub = async () => {
        const repo = prompt('Enter GitHub Repo (e.g. myorg/myrepo):', 'octocat/hello-world');
        if (!repo) return;
        setSyncStatus(s => ({ ...s, github: 'syncing' }));
        try {
            const res = await API.post('/sync/github/', { repo_name: repo });
            setSyncStatus(s => ({ ...s, github: 'done' }));
            alert(`✅ GitHub Sync Complete!\n\n${res.data?.message || 'Synced.'}\nRepos: ${(res.data?.synced_repos || [repo]).join(', ')}`);
        } catch {
            setSyncStatus(s => ({ ...s, github: 'error' }));
            alert('GitHub sync failed. Check backend.');
        }
    };

    const handleSyncJenkins = async () => {
        const job = prompt('Enter Jenkins Job Name:', 'my-project-build');
        if (!job) return;
        setSyncStatus(s => ({ ...s, jenkins: 'syncing' }));
        try {
            const res = await API.post('/sync/jenkins/', { job_name: job });
            setSyncStatus(s => ({ ...s, jenkins: 'done' }));
            const runs = res.data?.new_runs || [];
            alert(`✅ Jenkins Sync Complete!\n\n${res.data?.message || 'Synced.'}\nNew runs imported: ${runs.length}`);
        } catch {
            setSyncStatus(s => ({ ...s, jenkins: 'error' }));
            alert('Jenkins sync failed. Check backend.');
        }
    };

    const handleImportData = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsLoading(true);
        try {
            const res = await API.post('/import/failures/', { filename: file.name, type: 'csv' });
            alert(`📊 Import & AI Validation Complete!\n\n${res.data?.message}\n\n• Items Validated: ${res.data?.validated_items}\n• Errors Auto-Corrected: ${res.data?.errors_corrected}\n\nSuggestions:\n${(res.data?.suggestions || []).map(s => '→ ' + s).join('\n')}`);
        } catch {
            alert('Import failed.');
        } finally {
            setIsLoading(false);
            e.target.value = '';
        }
    };

    const secrets = [
        { key: 'AWS_ACCESS_KEY_ID', value: 'AKIA***************XYZ' },
        { key: 'DB_CONNECTION_STRING', value: 'postgresql://admin:***@prod-db.aws.com:5432' },
        { key: 'OPENAI_API_KEY', value: 'sk-proj-************************************' },
        { key: 'SLACK_WEBHOOK_URL', value: 'https://hooks.slack.com/services/T.../B.../X...' },
    ];

    const SyncBadge = ({ status }) => {
        if (!status) return null;
        const colors = { syncing: '#FFB74D', done: '#9D4EDD', error: '#00D2FF' };
        const labels = { syncing: '⟳ Syncing...', done: '✓ Synced', error: '✗ Failed' };
        return <span style={{ fontSize: '11px', color: colors[status], marginLeft: '8px', fontWeight: 'bold' }}>{labels[status]}</span>;
    };

    return (
        <div className="fade-in">
            {/* ── Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Infrastructure Hub (Terraform)</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Manage IaC modules, sync integrations, and view secrets. All DevOps tools in one place.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button className="btn-secondary" onClick={handleSyncGitHub} style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                        <GitBranch size={16} /> Import GitHub <SyncBadge status={syncStatus.github} />
                    </button>
                    <button className="btn-secondary" onClick={handleSyncJenkins} style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', borderColor: '#D32F2F', color: '#ff6b6b' }}>
                        <Zap size={16} /> Sync Jenkins <SyncBadge status={syncStatus.jenkins} />
                    </button>
                    <label className="btn-secondary" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', borderColor: '#4FC3F7', color: '#4FC3F7' }}>
                        <Upload size={16} /> Import CSV Data
                        <input type="file" accept=".csv,.json" style={{ display: 'none' }} onChange={handleImportData} />
                    </label>
                    <button className="btn-secondary" onClick={fetchAll} style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                        <RefreshCcw size={16} /> Refresh
                    </button>
                    <button className="btn-primary" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }} onClick={() => handleRunTerraform('New Module')}>
                        <Plus size={16} /> Provision Resource
                    </button>
                </div>
            </div>

            {/* ── Section 1: Terraform Modules from Backend ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '28px' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <Code size={20} color="var(--primary)" /> Terraform Modules (Live State)
                    </h4>
                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Fetching state from Terraform Cloud...</p>
                    ) : infraHub.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {infraHub.map((plan) => (
                                <div key={plan.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div>
                                            <h5 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{plan.plan_name}</h5>
                                            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                                <span>{plan.provider} • v{plan.version}</span>
                                                <span style={{ color: plan.status === 'Applied' ? '#9D4EDD' : 'var(--primary)' }}>● {plan.status}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleRunTerraform(plan.plan_name)} className="btn-primary" style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Play size={12} /> Apply
                                            </button>
                                            <button onClick={() => handleScale(plan.id)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Box size={12} /> Scale
                                            </button>
                                            <button onClick={() => handleDestroy(plan.id, plan.plan_name)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '12px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Trash2 size={12} /> Destroy
                                            </button>
                                        </div>
                                    </div>
                                    {plan.resources?.length > 0 && (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                            {plan.resources.map((res, j) => (
                                                <div key={j} style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                                    <p style={{ margin: '0 0 4px 0', fontSize: '10px', color: 'var(--text-muted)' }}>{res.resource_type}</p>
                                                    <p style={{ margin: '0', fontSize: '12px', fontWeight: '600' }}>{res.name}</p>
                                                    <span style={{ fontSize: '10px', color: res.status === 'Healthy' ? '#9D4EDD' : 'var(--primary)' }}>● {res.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                            <Server size={32} style={{ opacity: 0.4, marginBottom: '12px' }} />
                            <p style={{ fontSize: '14px' }}>No Terraform modules found.</p>
                            <p style={{ fontSize: '12px' }}>Click "Provision Resource" to create your first module.</p>
                        </div>
                    )}
                </div>

                {/* K8s Fleet & Secrets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Container size={20} color="#9D4EDD" /> K8s Fleet
                        </h4>
                        {k8sFleet.length > 0 ? k8sFleet.map((cluster, i) => (
                            <div key={i} style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <h5 style={{ margin: 0, fontSize: '14px' }}>{cluster.name}</h5>
                                    <span style={{ fontSize: '11px', color: '#9D4EDD', fontWeight: 'bold' }}>{cluster.status}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                                    <span>{cluster.nodes} Nodes</span>
                                    <span>{cluster.pods} Pods</span>
                                    <span>{cluster.provider}</span>
                                </div>
                            </div>
                        )) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No clusters found. Check Kubernetes tab.</p>
                        )}
                    </div>

                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <Lock size={20} color="var(--primary)" /> Secrets Vault
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Environment variables & credentials managed securely.</p>
                        <button onClick={() => setShowSecrets(!showSecrets)} className="btn-secondary" style={{ width: '100%', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {showSecrets ? <><EyeOff size={14} /> Hide Secrets</> : <><Eye size={14} /> Reveal Secrets</>}
                        </button>
                        {showSecrets && (
                            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--glass-border)', borderRadius: '10px', overflow: 'hidden' }}>
                                {secrets.map((s, i) => (
                                    <div key={i} style={{ background: 'rgba(13,13,20,0.9)', padding: '12px 16px' }}>
                                        <code style={{ color: 'var(--accent)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>{s.key}</code>
                                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#777' }}>{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Section 2: Terraform Folder Viewer (LIVE from devops/terraform/) ── */}
            <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', border: '1px solid rgba(0,210,255,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileCode size={20} color="var(--primary)" /> Live Terraform Directory — <code style={{ fontSize: '14px', color: 'var(--primary)' }}>devops/terraform/</code>
                        </h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>These files are the actual IaC configuration stored on disk, integrated directly into your website.</p>
                    </div>
                    <a href="https://app.terraform.io" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Download size={14} /> Open Terraform Cloud
                        </button>
                    </a>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>
                    {/* File Tree */}
                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
                        <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>📁 terraform/</p>
                        {Object.keys(tfFiles).map(f => (
                            <button key={f} onClick={() => setActiveTfFile(f)} style={{
                                display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px',
                                background: activeTfFile === f ? 'rgba(0,210,255,0.15)' : 'transparent',
                                border: activeTfFile === f ? '1px solid rgba(0,210,255,0.4)' : '1px solid transparent',
                                color: activeTfFile === f ? 'var(--primary)' : 'var(--text-muted)',
                                cursor: 'pointer', fontSize: '13px', marginBottom: '4px',
                                fontFamily: 'monospace'
                            }}>
                                📄 {f}
                            </button>
                        ))}
                        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'var(--text-muted)' }}>QUICK COMMANDS</p>
                            {['terraform init', 'terraform plan', 'terraform apply', 'terraform destroy'].map((cmd, i) => (
                                <div key={i} style={{ padding: '6px 8px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', marginBottom: '4px' }}>
                                    <code style={{ fontSize: '10px', color: '#4FC3F7' }}>{cmd}</code>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* File Content */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <code style={{ fontSize: '13px', color: 'var(--primary)' }}>terraform/{activeTfFile}</code>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(157,78,221,0.1)', color: '#9D4EDD', padding: '2px 10px', borderRadius: '10px' }}>● Live File</span>
                        </div>
                        <pre style={{
                            background: '#0A0A0F',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '20px',
                            fontSize: '12px',
                            fontFamily: '"Fira Code", "Courier New", monospace',
                            color: '#a8d8a8',
                            overflowX: 'auto',
                            lineHeight: '1.7',
                            maxHeight: '380px',
                            overflowY: 'auto',
                            margin: 0
                        }}>
                            {tfFiles[activeTfFile] || 'Select a file to view its content.'}
                        </pre>
                    </div>
                </div>
            </div>

            {/* ── Section 3: DevOps Roles & What To Do ── */}
            <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
                <h4 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Wrench size={20} color="var(--primary)" /> DevOps Roles — What To Do With Each Tool
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
                    Your website mirrors a real DevOps team. Each tab corresponds to a DevOps role. Here's what each role does and how the tools are used.
                </p>

                {/* Role Tab Switcher */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {DEVOPS_ROLES.map((role, i) => (
                        <button key={i} onClick={() => setActiveRoleTab(i)} style={{
                            padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                            background: activeRoleTab === i ? `${role.color}20` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${activeRoleTab === i ? role.color : 'var(--glass-border)'}`,
                            color: activeRoleTab === i ? role.color : 'var(--text-muted)',
                            transition: 'all 0.2s'
                        }}>
                            {role.icon} {role.title.split('(')[0].trim()}
                        </button>
                    ))}
                </div>

                {/* Active Role Details */}
                {(() => {
                    const role = DEVOPS_ROLES[activeRoleTab];
                    return (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <h5 style={{ margin: '0 0 16px 0', color: role.color }}>{role.icon} {role.title}</h5>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                    {role.tools.map((t, i) => (
                                        <span key={i} style={{ padding: '4px 12px', background: `${role.color}15`, border: `1px solid ${role.color}40`, borderRadius: '12px', fontSize: '12px', color: role.color }}>{t}</span>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {role.tasks.map((task, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `${role.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                                <span style={{ fontSize: '10px', color: role.color, fontWeight: 'bold' }}>{i + 1}</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#ddd' }}>{task}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '24px' }}>
                                <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>How it works in this website</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {[
                                        { step: 'Plan', desc: `Write or view config files (e.g. ${role.tools[0]} scripts in this tab)`, color: role.color },
                                        { step: 'Execute', desc: `Click action buttons (Deploy / Sync / Apply) to run commands via backend API`, color: '#4FC3F7' },
                                        { step: 'Monitor', desc: `Watch status change in real-time across Dashboard, Environments & K8s tabs`, color: '#9D4EDD' },
                                        { step: 'Iterate', desc: `AI auto-suggests fixes for failures. Regenerate configs with one click.`, color: '#BB86FC' },
                                    ].map((s, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: s.color, background: `${s.color}15`, padding: '2px 8px', borderRadius: '8px', flexShrink: 0, marginTop: '2px' }}>{s.step}</span>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* ── Section 4: DevOps Utility Suite ── */}
            <div style={{ padding: '28px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={20} color="var(--primary)" /> DevOps Utility Suite
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '13px' }}>Professional-grade tools for daily operations, security audits, and monitoring.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {[
                        { icon: <Search size={20} color="var(--primary)" />, bg: 'rgba(0,210,255,0.1)', title: 'Log Pattern Analyzer', desc: 'Scan millions of log lines to find anomalies and root causes.', btn: 'Open Analyzer' },
                        { icon: <ShieldCheck size={20} color="#9D4EDD" />, bg: 'rgba(157,78,221,0.1)', title: 'Secret Leak Scanner', desc: 'Deep scan all connected repos for exposed API keys or credentials.', btn: 'Start Audit' },
                        { icon: <Activity size={20} color="#4FC3F7" />, bg: 'rgba(79,195,247,0.1)', title: 'Global Health Check', desc: 'External endpoint monitoring with latency heatmaps across regions.', btn: 'View Monitor' },
                    ].map((tool, i) => (
                        <div key={i} className="glass-card" style={{ padding: '24px', cursor: 'pointer' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: tool.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{tool.icon}</div>
                            <h5 style={{ marginBottom: '8px', fontSize: '15px' }}>{tool.title}</h5>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>{tool.desc}</p>
                            <button className="btn-secondary" style={{ width: '100%', fontSize: '12px', padding: '10px' }}>{tool.btn}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Toolbox;
