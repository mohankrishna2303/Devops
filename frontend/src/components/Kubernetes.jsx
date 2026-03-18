import React, { useState, useEffect, useCallback } from 'react';
import {
    Cpu, Server, Box, Layers, Terminal, RefreshCw, Search,
    ChevronDown, ChevronUp, ArrowUpDown, Scale, Trash2, Play,
    Plus, FileCode, Activity, AlertTriangle, CheckCircle,
    Clock, BarChart2, Zap, GitBranch, Cloud, Eye, X, Minus
} from 'lucide-react';
import {
    getK8sFleet, getK8sNamespaces, getK8sWorkloads, getK8sPods,
    getK8sPodLogs, scaleK8sWorkload, deployK8sWorkload, deleteK8sWorkload,
    applyK8sYaml, getK8sEvents
} from '../api';

/* ── helpers ─────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        Running: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
        Healthy: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
        Active: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
        Pending: { color: '#FFBE0B', bg: 'rgba(251,191,36,0.1)' },
        Warning: { color: '#FFBE0B', bg: 'rgba(251,191,36,0.1)' },
        Crashed: { color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
        Failed: { color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
        Stopped: { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)' },
    };
    const s = map[status] || { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)' };
    return (
        <span style={{
            padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
            color: s.color, background: s.bg, border: `1px solid ${s.color}33`
        }}>● {status}</span>
    );
};

const MetricBar = ({ value, color = '#00D2FF' }) => (
    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '6px', width: '100%', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(value, 100)}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.4s ease' }} />
    </div>
);

const Card = ({ children, style = {} }) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '24px', ...style
    }}>{children}</div>
);

const Spinner = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <RefreshCw size={28} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
    </div>
);

/* ─── Cluster Card ───────────────────────────────────────────────────── */
const ClusterCard = ({ cluster, selected, onClick }) => {
    const cpuColor = cluster.cpu_usage > 80 ? '#f87171' : cluster.cpu_usage > 60 ? '#FFBE0B' : '#4ade80';
    const memColor = cluster.mem_usage > 80 ? '#f87171' : cluster.mem_usage > 60 ? '#FFBE0B' : '#4ade80';
    return (
        <div
            onClick={onClick}
            id={`cluster-card-${cluster.id}`}
            style={{
                padding: '24px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                background: selected ? 'var(--card-hover)' : 'var(--card-bg)',
                border: selected ? '1px solid var(--primary)' : '1px solid var(--border)',
                transform: selected ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selected ? '0 10px 30px rgba(0,210,255,0.15)' : 'none'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{cluster.name}</h4>
                    <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {cluster.provider} · {cluster.region} · v{cluster.version}
                    </p>
                </div>
                <StatusBadge status={cluster.status} />
            </div>
            <div className="grid-2" style={{ gap: '16px', marginBottom: '24px' }}>
                {[
                    { label: 'Nodes', value: cluster.nodes, icon: <Server size={16} /> },
                    { label: 'Pods', value: cluster.pods, icon: <Box size={16} /> },
                    { label: 'Workloads', value: cluster.workload_count, icon: <Layers size={16} /> },
                    { label: 'Namespaces', value: cluster.namespace_count, icon: <GitBranch size={16} /> },
                ].map(m => (
                    <div key={m.label} style={{ textAlign: 'center', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            {m.icon} <span style={{ fontSize: '12px' }}>{m.label}</span>
                        </div>
                        <span style={{ fontSize: '22px', fontWeight: '700' }}>{m.value}</span>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>CPU</span>
                        <span style={{ color: cpuColor, fontWeight: '600' }}>{cluster.cpu_usage}%</span>
                    </div>
                    <MetricBar value={cluster.cpu_usage} color={cpuColor} />
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Memory</span>
                        <span style={{ color: memColor, fontWeight: '600' }}>{cluster.mem_usage}%</span>
                    </div>
                    <MetricBar value={cluster.mem_usage} color={memColor} />
                </div>
            </div>
        </div>
    );
};

/* ─── Scale Modal ────────────────────────────────────────────────────── */
const ScaleModal = ({ workload, onClose, onScaled }) => {
    const [replicas, setReplicas] = useState(workload.replicas);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleScale = async () => {
        setLoading(true);
        try {
            await scaleK8sWorkload(workload.id, replicas);
            setMsg(`✓ Scaled to ${replicas} replicas`);
            setTimeout(() => { onScaled(); onClose(); }, 1200);
        } catch { setMsg('Error scaling workload'); }
        setLoading(false);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'
        }}>
            <Card style={{ width: '420px', position: 'relative', padding: '32px' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
                <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px' }}>
                    <Scale size={24} color="var(--primary)" /> Scale Workload
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>{workload.kind} <span style={{ color: 'var(--primary)', opacity: 0.5 }}>/</span> {workload.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', justifyContent: 'center', marginBottom: '32px' }}>
                    <button onClick={() => setReplicas(r => Math.max(0, r - 1))}
                        className="btn-secondary"
                        style={{ width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', padding: 0 }}>
                        <Minus size={24} />
                    </button>
                    <div style={{ textAlign: 'center', minWidth: '80px' }}>
                        <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--primary)', lineHeight: 1 }}>{replicas}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '8px', fontWeight: '600' }}>Replicas</div>
                    </div>
                    <button onClick={() => setReplicas(r => r + 1)}
                        className="btn-secondary"
                        style={{ width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', padding: 0 }}>
                        <Plus size={24} />
                    </button>
                </div>
                {msg && <p style={{ color: '#4ade80', fontSize: '13px', textAlign: 'center', marginBottom: '16px', background: 'rgba(74,222,128,0.1)', padding: '10px', borderRadius: '8px' }}>{msg}</p>}
                <button
                    id="btn-confirm-scale"
                    onClick={handleScale}
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '15px', justifyContent: 'center' }}>
                    {loading ? 'Scaling…' : 'Confirm Scale'}
                </button>
            </Card>
        </div>
    );
};

/* ─── Deploy Modal ───────────────────────────────────────────────────── */
const DeployModal = ({ onClose, onDeployed }) => {
    const [form, setForm] = useState({
        name: '', kind: 'Deployment', namespace: 'default',
        image: '', replicas: 1, cpu_request: '100m', mem_request: '128Mi'
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleDeploy = async () => {
        if (!form.name || !form.image) { setMsg('Name and image are required'); return; }
        setLoading(true);
        try {
            await deployK8sWorkload({ ...form, replicas: Number(form.replicas) });
            setMsg('✓ Workload deployed!');
            setTimeout(() => { onDeployed(); onClose(); }, 1200);
        } catch { setMsg('Deployment failed'); }
        setLoading(false);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'
        }}>
            <Card style={{ width: '560px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: '32px' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
                <h3 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px' }}>
                    <Plus size={24} color="var(--primary)" /> Deploy New Workload
                </h3>
                <div className="grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
                    <div>
                        <label className="form-label">Workload Name *</label>
                        <input id="deploy-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="my-app" className="form-input" />
                    </div>
                    <div>
                        <label className="form-label">Kind</label>
                        <select id="deploy-kind" value={form.kind} onChange={e => set('kind', e.target.value)} className="form-input">
                            {['Deployment', 'StatefulSet', 'DaemonSet', 'Job', 'CronJob'].map(k => <option key={k}>{k}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Container Image *</label>
                        <input id="deploy-image" value={form.image} onChange={e => set('image', e.target.value)} placeholder="nginx:latest" className="form-input" />
                    </div>
                    <div>
                        <label className="form-label">Namespace</label>
                        <input id="deploy-namespace" value={form.namespace} onChange={e => set('namespace', e.target.value)} placeholder="default" className="form-input" />
                    </div>
                    <div>
                        <label className="form-label">Replicas</label>
                        <input id="deploy-replicas" type="number" min="0" max="50" value={form.replicas} onChange={e => set('replicas', e.target.value)} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label">CPU Request</label>
                        <input id="deploy-cpu" value={form.cpu_request} onChange={e => set('cpu_request', e.target.value)} placeholder="100m" className="form-input" />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Memory Request</label>
                        <input id="deploy-mem" value={form.mem_request} onChange={e => set('mem_request', e.target.value)} placeholder="128Mi" className="form-input" />
                    </div>
                </div>
                {msg && <p style={{ color: msg.startsWith('✓') ? '#4ade80' : '#f87171', fontSize: '13px', marginBottom: '16px', background: msg.startsWith('✓') ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', padding: '12px', borderRadius: '8px' }}>{msg}</p>}
                <button
                    id="btn-confirm-deploy"
                    onClick={handleDeploy}
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '15px', justifyContent: 'center' }}>
                    {loading ? 'Deploying…' : '🚀 Deploy Workload'}
                </button>
            </Card>
        </div>
    );
};

/* ─── YAML Apply Modal ───────────────────────────────────────────────── */
const YamlModal = ({ onClose }) => {
    const [yaml, setYaml] = useState(
        `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: default
spec:
  replicas: 2
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: nginx:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"`
    );
    const [ns, setNs] = useState('default');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleApply = async () => {
        setLoading(true);
        try {
            const r = await applyK8sYaml(yaml, ns);
            setResult({ ok: true, msg: r?.message || 'YAML applied successfully!' });
        } catch { setResult({ ok: false, msg: 'Failed to apply YAML' }); }
        setLoading(false);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'
        }}>
            <Card style={{ width: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', position: 'relative', padding: '32px' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '32px', right: '32px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px' }}>
                        <FileCode size={24} color="var(--primary)" /> Apply Kubernetes YAML
                    </h3>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Namespace:</span>
                        <input value={ns} onChange={e => setNs(e.target.value)}
                            className="form-input" style={{ width: '150px' }} />
                    </div>
                </div>
                <textarea
                    id="yaml-editor"
                    value={yaml}
                    onChange={e => setYaml(e.target.value)}
                    style={{
                        flex: 1, minHeight: '400px', padding: '24px', borderRadius: '12px',
                        background: '#0a0a0f', border: '1px solid var(--border)',
                        color: '#a5b4fc', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.8',
                        resize: 'vertical', outline: 'none'
                    }}
                />
                {result && (
                    <div style={{
                        marginTop: '16px', padding: '12px 16px', borderRadius: '8px', fontSize: '14px',
                        background: result.ok ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                        color: result.ok ? '#4ade80' : '#f87171'
                    }}>
                        {result.msg}
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button
                        id="btn-apply-yaml"
                        onClick={handleApply}
                        disabled={loading}
                        className="btn-primary"
                        style={{ padding: '12px 32px', fontSize: '15px' }}>
                        {loading ? 'Applying…' : '▶ kubectl apply'}
                    </button>
                </div>
            </Card>
        </div>
    );
};

/* ─── Pod Logs Modal ─────────────────────────────────────────────────── */
const LogsModal = ({ pod, onClose }) => {
    const [logs, setLogs] = useState('Loading logs…');
    useEffect(() => {
        getK8sPodLogs(pod.id).then(r => setLogs(r?.logs || 'No logs available.')).catch(() => setLogs('Failed to fetch logs.'));
    }, [pod.id]);
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <Card style={{ width: '800px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', position: 'relative', padding: '32px' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px' }}>
                    <Terminal size={24} color="var(--primary)" /> Pod Logs
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>{pod.name} <span style={{ color: 'var(--primary)', opacity: 0.5 }}>·</span> {pod.namespace}</p>
                <pre className="terminal-log" style={{ flex: 1, overflowY: 'auto', background: '#0a0a0f', padding: '24px', borderRadius: '12px', fontSize: '13px', lineHeight: '1.8', color: '#a5b4fc', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: '300px', border: '1px solid var(--border)' }}>
                    {logs}
                </pre>
            </Card>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════
   Main Kubernetes Component
═══════════════════════════════════════════════════════════════════════ */
const Kubernetes = () => {
    const [tab, setTab] = useState('clusters'); // clusters | workloads | pods | events
    const [clusters, setClusters] = useState([]);
    const [namespaces, setNamespaces] = useState([]);
    const [workloads, setWorkloads] = useState([]);
    const [pods, setPods] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [nsFilter, setNsFilter] = useState('');
    const [search, setSearch] = useState('');
    const [scaleTarget, setScaleTarget] = useState(null);
    const [showDeploy, setShowDeploy] = useState(false);
    const [showYaml, setShowYaml] = useState(false);
    const [logPod, setLogPod] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const fc = await getK8sFleet();
            const fw = await getK8sWorkloads();
            const fp = await getK8sPods();
            const fe = await getK8sEvents();

            setClusters(Array.isArray(fc) ? fc : []);
            if (Array.isArray(fc) && fc.length && !selectedCluster) setSelectedCluster(fc[0].id);
            setWorkloads(Array.isArray(fw) ? fw : []);
            setPods(Array.isArray(fp) ? fp : []);
            setEvents(Array.isArray(fe) ? fe : []);
        } catch (e) { console.error(e); }
        setLoading(false);
    }, []);

    const fetchNamespaces = useCallback(async (cId) => {
        try {
            const r = await getK8sNamespaces(cId);
            setNamespaces(r || []);
        } catch { }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);
    useEffect(() => { if (selectedCluster) fetchNamespaces(selectedCluster); }, [selectedCluster, fetchNamespaces]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this workload? This cannot be undone.')) return;
        setDeleting(id);
        await deleteK8sWorkload(id);
        setDeleting(null);
        fetchAll();
    };

    const filteredWorkloads = workloads.filter(w =>
        (!nsFilter || w.namespace === nsFilter) &&
        (!search || w.name.toLowerCase().includes(search.toLowerCase()) || w.image.toLowerCase().includes(search.toLowerCase()))
    );
    const filteredPods = pods.filter(p =>
        (!nsFilter || p.namespace === nsFilter) &&
        (!search || p.name.toLowerCase().includes(search.toLowerCase()))
    );

    const totalNodes = (Array.isArray(clusters) ? clusters : []).reduce((a, c) => a + (Number(c.nodes) || 0), 0);
    const totalPods = (Array.isArray(clusters) ? clusters : []).reduce((a, c) => a + (Number(c.pods) || 0), 0);
    const avgHealth = (Array.isArray(clusters) && clusters.length > 0) ? Math.round(clusters.reduce((a, c) => a + (Number(c.health_score) || 0), 0) / clusters.length) : 0;
    const runningWorkloads = (Array.isArray(workloads) ? workloads : []).filter(w => w.status === 'Running').length;

    return (
        <div className="fade-in" style={{ color: 'white' }}>
            {/* ── Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.02em' }}>
                        <Cpu size={32} color="var(--primary)" /> Kubernetes Control Plane
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>
                        Manage clusters, workloads, pods, and deployments in real-time.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button id="btn-k8s-refresh" onClick={fetchAll} className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}>
                        <RefreshCw size={18} /> Refresh
                    </button>
                    <button id="btn-apply-yaml-open" onClick={() => setShowYaml(true)} className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}>
                        <FileCode size={18} /> Apply YAML
                    </button>
                    <button id="btn-deploy-open" onClick={() => setShowDeploy(true)} className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '10px', fontSize: '14px' }}>
                        <Plus size={18} /> Deploy Workload
                    </button>
                </div>
            </div>

            {/* ── Summary KPIs ── */}
            <div className="grid-4" style={{ gap: '20px', marginBottom: '32px' }}>
                {[
                    { label: 'Clusters', value: clusters.length, icon: <Cloud size={24} />, color: '#3A86FF' },
                    { label: 'Worker Nodes', value: totalNodes, icon: <Server size={24} />, color: '#8338EC' },
                    { label: 'Running Pods', value: totalPods, icon: <Box size={24} />, color: '#4ade80' },
                    { label: 'Fleet Health', value: `${avgHealth}%`, icon: <Activity size={24} />, color: avgHealth > 90 ? '#4ade80' : '#FFBE0B' },
                ].map(k => (
                    <Card key={k.label} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `${k.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color, flexShrink: 0, border: `1px solid ${k.color}30` }}>
                            {k.icon}
                        </div>
                        <div>
                            <div className="stat-card-value" style={{ fontSize: '28px' }}>{k.value}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>{k.label}</div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* ── Tabs ── */}
            <div className="tabs" style={{ marginBottom: '32px' }}>
                {[
                    { id: 'clusters', label: 'Clusters', icon: <Cloud size={16} /> },
                    { id: 'workloads', label: 'Workloads', icon: <Layers size={16} /> },
                    { id: 'pods', label: 'Pods', icon: <Box size={16} /> },
                    { id: 'events', label: 'Events', icon: <Zap size={16} /> },
                ].map(t => (
                    <button key={t.id} id={`tab-k8s-${t.id}`} onClick={() => setTab(t.id)} className={`tab ${tab === t.id ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {t.icon} {t.label}
                        {t.id === 'workloads' && <span className="badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>{workloads.length}</span>}
                        {t.id === 'pods' && <span className="badge" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>{pods.length}</span>}
                    </button>
                ))}
            </div>

            {loading ? <Spinner /> : (
                <>
                    {/* ── Filter bar (workloads/pods) ── */}
                    {(tab === 'workloads' || tab === 'pods') && (
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
                            <div className="search-bar" style={{ flex: 1 }}>
                                <Search size={18} className="search-icon" />
                                <input
                                    id="k8s-search"
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder={`Search ${tab}…`}
                                    className="search-input"
                                />
                            </div>
                            <select id="k8s-ns-filter" value={nsFilter} onChange={e => setNsFilter(e.target.value)}
                                className="form-input" style={{ width: 'auto', minWidth: '200px' }}>
                                <option value="">All Namespaces</option>
                                {[...new Set(namespaces.map(n => n.name))].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    )}

                    {/* ── Clusters Tab ── */}
                    {tab === 'clusters' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                            {clusters.map(c => (
                                <ClusterCard key={c.id} cluster={c} selected={selectedCluster === c.id} onClick={() => setSelectedCluster(c.id)} />
                            ))}
                            {!clusters.length && (
                                <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
                                    <Server size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                                    <p>No clusters found. Connect a Kubernetes cluster to get started.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Workloads Tab ── */}
                    {tab === 'workloads' && (
                        <Card style={{ padding: '0', overflow: 'hidden' }}>
                            <table className="devops-table">
                                <thead>
                                    <tr>
                                        {['Name', 'Kind', 'Namespace', 'Image', 'Replicas', 'Status', 'Resources', 'Actions'].map(h => (
                                            <th key={h}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredWorkloads.map((w, i) => (
                                        <tr key={w.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: w.status === 'Running' ? '#4ade80' : w.status === 'Pending' ? '#FFBE0B' : '#f87171' }} />
                                                    {w.name}
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>{w.kind}</span>
                                            </td>
                                            <td style={{ color: '#3A86FF' }}>{w.namespace}</td>
                                            <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.image}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ color: w.ready_replicas < w.replicas ? '#FFBE0B' : '#4ade80', fontWeight: '700' }}>{w.ready_replicas}</span>
                                                    <span style={{ color: 'var(--text-muted)' }}>/ {w.replicas}</span>
                                                </div>
                                            </td>
                                            <td><StatusBadge status={w.status} /></td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                                <div>CPU: {w.cpu_request}</div>
                                                <div>MEM: {w.mem_request}</div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        id={`btn-scale-${w.id}`}
                                                        onClick={() => setScaleTarget(w)}
                                                        title="Scale"
                                                        style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', cursor: 'pointer' }}>
                                                        <Scale size={16} />
                                                    </button>
                                                    <button
                                                        id={`btn-delete-${w.id}`}
                                                        onClick={() => handleDelete(w.id)}
                                                        disabled={deleting === w.id}
                                                        title="Delete"
                                                        style={{ padding: '8px', borderRadius: '8px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', cursor: 'pointer' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {!filteredWorkloads.length && (
                                        <tr><td colSpan={8} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No workloads found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </Card>
                    )}

                    {/* ── Pods Tab ── */}
                    {tab === 'pods' && (
                        <Card style={{ padding: '0', overflow: 'hidden' }}>
                            <table className="devops-table">
                                <thead>
                                    <tr>
                                        {['Pod Name', 'Namespace', 'Node', 'Workload', 'Status', 'Restarts', 'CPU', 'Mem', 'Logs'].map(h => (
                                            <th key={h}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPods.map((p, i) => (
                                        <tr key={p.id}>
                                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</td>
                                            <td style={{ color: '#3A86FF' }}>{p.namespace}</td>
                                            <td style={{ color: 'var(--text-muted)' }}>{p.node}</td>
                                            <td>{p.workload}</td>
                                            <td><StatusBadge status={p.status} /></td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span style={{ color: p.restarts > 3 ? '#f87171' : p.restarts > 0 ? '#FFBE0B' : '#4ade80', fontWeight: '700' }}>{p.restarts}</span>
                                            </td>
                                            <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{p.cpu_usage}</td>
                                            <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{p.mem_usage}</td>
                                            <td>
                                                <button
                                                    id={`btn-logs-${p.id}`}
                                                    onClick={() => setLogPod(p)}
                                                    className="btn-secondary"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', fontSize: '12px' }}>
                                                    <Eye size={14} /> Logs
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!filteredPods.length && (
                                        <tr><td colSpan={9} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No pods found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </Card>
                    )}

                    {/* ── Events Tab ── */}
                    {tab === 'events' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {events.map((ev, i) => (
                                <Card key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '24px' }}>
                                    <div style={{ flexShrink: 0, marginTop: '2px', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: ev.type === 'Warning' ? 'rgba(251,191,36,0.1)' : 'rgba(74,222,128,0.1)' }}>
                                        {ev.type === 'Warning'
                                            ? <AlertTriangle size={20} color="#FFBE0B" />
                                            : <CheckCircle size={20} color="#4ade80" />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: '600', fontSize: '15px' }}>{ev.reason}</span>
                                            <span style={{
                                                fontSize: '12px', padding: '4px 10px', borderRadius: '12px', fontWeight: '600',
                                                background: ev.type === 'Warning' ? 'rgba(251,191,36,0.15)' : 'rgba(74,222,128,0.15)',
                                                color: ev.type === 'Warning' ? '#FFBE0B' : '#4ade80'
                                            }}>{ev.type}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>{ev.message}</p>
                                        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#3A86FF', fontFamily: 'var(--font-mono)' }}>{ev.object}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px', flexShrink: 0, background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px' }}>
                                        <Clock size={14} /> {ev.age}
                                    </div>
                                </Card>
                            ))}
                            {!events.length && (
                                <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>No cluster events.</div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* ── Modals ── */}
            {scaleTarget && <ScaleModal workload={scaleTarget} onClose={() => setScaleTarget(null)} onScaled={fetchAll} />}
            {showDeploy && <DeployModal onClose={() => setShowDeploy(false)} onDeployed={fetchAll} />}
            {showYaml && <YamlModal onClose={() => setShowYaml(false)} />}
            {logPod && <LogsModal pod={logPod} onClose={() => setLogPod(null)} />}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .fade-in { animation: fadeIn 0.4s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                tr:hover { background: rgba(255,255,255,0.03) !important; }
            `}</style>
        </div>
    );
};

export default Kubernetes;
