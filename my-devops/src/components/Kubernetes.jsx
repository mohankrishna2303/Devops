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
        Pending: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
        Warning: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
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

const MetricBar = ({ value, color = '#ff3d00' }) => (
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
    const cpuColor = cluster.cpu_usage > 80 ? '#f87171' : cluster.cpu_usage > 60 ? '#fbbf24' : '#4ade80';
    const memColor = cluster.mem_usage > 80 ? '#f87171' : cluster.mem_usage > 60 ? '#fbbf24' : '#4ade80';
    return (
        <div
            onClick={onClick}
            id={`cluster-card-${cluster.id}`}
            style={{
                padding: '20px', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s',
                background: selected ? 'rgba(255,61,0,0.1)' : 'rgba(255,255,255,0.03)',
                border: selected ? '1px solid #ff3d00' : '1px solid rgba(255,255,255,0.07)',
                transform: selected ? 'scale(1.02)' : 'scale(1)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{cluster.name}</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {cluster.provider} · {cluster.region} · v{cluster.version}
                    </p>
                </div>
                <StatusBadge status={cluster.status} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[
                    { label: 'Nodes', value: cluster.nodes, icon: <Server size={14} /> },
                    { label: 'Pods', value: cluster.pods, icon: <Box size={14} /> },
                    { label: 'Workloads', value: cluster.workload_count, icon: <Layers size={14} /> },
                    { label: 'Namespaces', value: cluster.namespace_count, icon: <GitBranch size={14} /> },
                ].map(m => (
                    <div key={m.label} style={{ textAlign: 'center', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            {m.icon} <span style={{ fontSize: '11px' }}>{m.label}</span>
                        </div>
                        <span style={{ fontSize: '20px', fontWeight: '700' }}>{m.value}</span>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>CPU</span>
                        <span style={{ color: cpuColor, fontWeight: '600' }}>{cluster.cpu_usage}%</span>
                    </div>
                    <MetricBar value={cluster.cpu_usage} color={cpuColor} />
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
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
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
            <Card style={{ width: '420px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
                <h3 style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Scale size={20} color="#ff3d00" /> Scale Workload
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>{workload.kind}/{workload.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center', marginBottom: '24px' }}>
                    <button onClick={() => setReplicas(r => Math.max(0, r - 1))}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: '22px' }}>
                        <Minus size={18} />
                    </button>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '40px', fontWeight: '700', color: '#ff3d00' }}>{replicas}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>replicas</div>
                    </div>
                    <button onClick={() => setReplicas(r => r + 1)}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: '22px' }}>
                        <Plus size={18} />
                    </button>
                </div>
                {msg && <p style={{ color: '#4ade80', fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>{msg}</p>}
                <button
                    id="btn-confirm-scale"
                    onClick={handleScale}
                    disabled={loading}
                    style={{
                        width: '100%', padding: '12px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #ff3d00, #ff7043)',
                        border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '14px'
                    }}>
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

    const inputStyle = {
        width: '100%', padding: '10px 14px', borderRadius: '8px',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
    };
    const labelStyle = { fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
            <Card style={{ width: '520px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Plus size={20} color="#ff3d00" /> Deploy New Workload
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label style={labelStyle}>Workload Name *</label>
                        <input id="deploy-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="my-app" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Kind</label>
                        <select id="deploy-kind" value={form.kind} onChange={e => set('kind', e.target.value)} style={inputStyle}>
                            {['Deployment', 'StatefulSet', 'DaemonSet', 'Job', 'CronJob'].map(k => <option key={k}>{k}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Container Image *</label>
                        <input id="deploy-image" value={form.image} onChange={e => set('image', e.target.value)} placeholder="nginx:latest" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Namespace</label>
                        <input id="deploy-namespace" value={form.namespace} onChange={e => set('namespace', e.target.value)} placeholder="default" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Replicas</label>
                        <input id="deploy-replicas" type="number" min="0" max="50" value={form.replicas} onChange={e => set('replicas', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>CPU Request</label>
                        <input id="deploy-cpu" value={form.cpu_request} onChange={e => set('cpu_request', e.target.value)} placeholder="100m" style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={labelStyle}>Memory Request</label>
                        <input id="deploy-mem" value={form.mem_request} onChange={e => set('mem_request', e.target.value)} placeholder="128Mi" style={inputStyle} />
                    </div>
                </div>
                {msg && <p style={{ color: msg.startsWith('✓') ? '#4ade80' : '#f87171', fontSize: '13px', marginBottom: '12px' }}>{msg}</p>}
                <button
                    id="btn-confirm-deploy"
                    onClick={handleDeploy}
                    disabled={loading}
                    style={{
                        width: '100%', padding: '12px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #ff3d00, #ff7043)',
                        border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '14px'
                    }}>
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
            setResult({ ok: true, msg: r.data?.message || 'YAML applied successfully!' });
        } catch { setResult({ ok: false, msg: 'Failed to apply YAML' }); }
        setLoading(false);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
            <Card style={{ width: '700px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
                <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileCode size={20} color="#ff3d00" /> Apply Kubernetes YAML
                </h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Namespace:</span>
                    <input value={ns} onChange={e => setNs(e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '13px' }} />
                </div>
                <textarea
                    id="yaml-editor"
                    value={yaml}
                    onChange={e => setYaml(e.target.value)}
                    style={{
                        flex: 1, minHeight: '380px', padding: '16px', borderRadius: '8px',
                        background: '#0d0d14', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#4ade80', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.6',
                        resize: 'vertical', outline: 'none'
                    }}
                />
                {result && (
                    <div style={{
                        marginTop: '12px', padding: '10px 16px', borderRadius: '8px', fontSize: '13px',
                        background: result.ok ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                        color: result.ok ? '#4ade80' : '#f87171'
                    }}>
                        {result.msg}
                    </div>
                )}
                <button
                    id="btn-apply-yaml"
                    onClick={handleApply}
                    disabled={loading}
                    style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #ff3d00, #ff7043)', border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                    {loading ? 'Applying…' : '▶ kubectl apply'}
                </button>
            </Card>
        </div>
    );
};

/* ─── Pod Logs Modal ─────────────────────────────────────────────────── */
const LogsModal = ({ pod, onClose }) => {
    const [logs, setLogs] = useState('Loading logs…');
    useEffect(() => {
        getK8sPodLogs(pod.id).then(r => setLogs(r.data?.logs || 'No logs available.')).catch(() => setLogs('Failed to fetch logs.'));
    }, [pod.id]);
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            <Card style={{ width: '720px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                <h3 style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}><Terminal size={18} color="#ff3d00" /> Pod Logs</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>{pod.name} · {pod.namespace}</p>
                <pre style={{ flex: 1, overflowY: 'auto', background: '#0d0d14', padding: '20px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.8', color: '#4ade80', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: '300px' }}>
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
            const [fc, fw, fp, fe] = await Promise.all([
                getK8sFleet(), getK8sWorkloads(), getK8sPods(), getK8sEvents()
            ]);
            const c = fc.data; setClusters(c);
            if (c.length && !selectedCluster) setSelectedCluster(c[0].id);
            setWorkloads(fw.data);
            setPods(fp.data);
            setEvents(fe.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    }, []);

    const fetchNamespaces = useCallback(async (cId) => {
        try {
            const r = await getK8sNamespaces(cId);
            setNamespaces(r.data);
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

    const tabStyle = (id) => ({
        padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
        fontWeight: tab === id ? '600' : '400',
        background: tab === id ? 'rgba(255,61,0,0.15)' : 'transparent',
        color: tab === id ? '#ff3d00' : 'var(--text-muted)',
        border: tab === id ? '1px solid rgba(255,61,0,0.3)' : '1px solid transparent',
        transition: 'all 0.2s',
    });

    const totalNodes = clusters.reduce((a, c) => a + c.nodes, 0);
    const totalPods = clusters.reduce((a, c) => a + c.pods, 0);
    const avgHealth = clusters.length ? Math.round(clusters.reduce((a, c) => a + c.health_score, 0) / clusters.length) : 0;
    const runningWorkloads = workloads.filter(w => w.status === 'Running').length;

    return (
        <div className="fade-in" style={{ color: 'white' }}>
            {/* ── Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Cpu size={28} color="#ff3d00" /> Kubernetes Control Plane
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
                        Manage clusters, workloads, pods, and deployments in real-time.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button id="btn-k8s-refresh" onClick={fetchAll}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '13px' }}>
                        <RefreshCw size={15} /> Refresh
                    </button>
                    <button id="btn-apply-yaml-open" onClick={() => setShowYaml(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '13px' }}>
                        <FileCode size={15} /> Apply YAML
                    </button>
                    <button id="btn-deploy-open" onClick={() => setShowDeploy(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #ff3d00, #ff7043)', border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                        <Plus size={15} /> Deploy Workload
                    </button>
                </div>
            </div>

            {/* ── Summary KPIs ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
                {[
                    { label: 'Clusters', value: clusters.length, icon: <Cloud size={20} />, color: '#60a5fa' },
                    { label: 'Worker Nodes', value: totalNodes, icon: <Server size={20} />, color: '#a78bfa' },
                    { label: 'Running Pods', value: totalPods, icon: <Box size={20} />, color: '#4ade80' },
                    { label: 'Fleet Health', value: `${avgHealth}%`, icon: <Activity size={20} />, color: avgHealth > 90 ? '#4ade80' : '#fbbf24' },
                ].map(k => (
                    <Card key={k.label} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${k.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color, flexShrink: 0 }}>
                            {k.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: '700' }}>{k.value}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{k.label}</div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* ── Tabs ── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {[
                    { id: 'clusters', label: 'Clusters', icon: <Cloud size={15} /> },
                    { id: 'workloads', label: 'Workloads', icon: <Layers size={15} /> },
                    { id: 'pods', label: 'Pods', icon: <Box size={15} /> },
                    { id: 'events', label: 'Events', icon: <Zap size={15} /> },
                ].map(t => (
                    <button key={t.id} id={`tab-k8s-${t.id}`} onClick={() => setTab(t.id)} style={{ ...tabStyle(t.id), display: 'flex', alignItems: 'center', gap: '7px' }}>
                        {t.icon} {t.label}
                        {t.id === 'workloads' && <span style={{ background: '#ff3d0033', color: '#ff3d00', borderRadius: '10px', padding: '0 6px', fontSize: '11px' }}>{workloads.length}</span>}
                        {t.id === 'pods' && <span style={{ background: '#4ade8033', color: '#4ade80', borderRadius: '10px', padding: '0 6px', fontSize: '11px' }}>{pods.length}</span>}
                    </button>
                ))}
            </div>

            {loading ? <Spinner /> : (
                <>
                    {/* ── Filter bar (workloads/pods) ── */}
                    {(tab === 'workloads' || tab === 'pods') && (
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    id="k8s-search"
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder={`Search ${tab}…`}
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                            <select id="k8s-ns-filter" value={nsFilter} onChange={e => setNsFilter(e.target.value)}
                                style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', cursor: 'pointer', minWidth: '160px' }}>
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
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
                                        {['Name', 'Kind', 'Namespace', 'Image', 'Replicas', 'Status', 'Resources', 'Actions'].map(h => (
                                            <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredWorkloads.map((w, i) => (
                                        <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '14px 16px', fontWeight: '600', fontSize: '13px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: w.status === 'Running' ? '#4ade80' : w.status === 'Pending' ? '#fbbf24' : '#f87171' }} />
                                                    {w.name}
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', fontSize: '11px', fontFamily: 'monospace' }}>{w.kind}</span>
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: '12px', color: '#60a5fa' }}>{w.namespace}</td>
                                            <td style={{ padding: '14px 16px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.image}</td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ color: w.ready_replicas < w.replicas ? '#fbbf24' : '#4ade80', fontWeight: '700' }}>{w.ready_replicas}</span>
                                                    <span style={{ color: 'var(--text-muted)' }}>/ {w.replicas}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}><StatusBadge status={w.status} /></td>
                                            <td style={{ padding: '14px 16px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                                <div>CPU: {w.cpu_request}</div>
                                                <div>MEM: {w.mem_request}</div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        id={`btn-scale-${w.id}`}
                                                        onClick={() => setScaleTarget(w)}
                                                        title="Scale"
                                                        style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>
                                                        <Scale size={14} />
                                                    </button>
                                                    <button
                                                        id={`btn-delete-${w.id}`}
                                                        onClick={() => handleDelete(w.id)}
                                                        disabled={deleting === w.id}
                                                        title="Delete"
                                                        style={{ padding: '6px', borderRadius: '6px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', cursor: 'pointer' }}>
                                                        <Trash2 size={14} />
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
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
                                        {['Pod Name', 'Namespace', 'Node', 'Workload', 'Status', 'Restarts', 'CPU', 'Mem', 'Logs'].map(h => (
                                            <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPods.map((p, i) => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                            <td style={{ padding: '12px 16px', fontSize: '12px', fontFamily: 'monospace', fontWeight: '600', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '12px', color: '#60a5fa' }}>{p.namespace}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>{p.node}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '12px' }}>{p.workload}</td>
                                            <td style={{ padding: '12px 16px' }}><StatusBadge status={p.status} /></td>
                                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                <span style={{ color: p.restarts > 3 ? '#f87171' : p.restarts > 0 ? '#fbbf24' : '#4ade80', fontWeight: '700' }}>{p.restarts}</span>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.cpu_usage}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.mem_usage}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <button
                                                    id={`btn-logs-${p.id}`}
                                                    onClick={() => setLogPod(p)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '11px' }}>
                                                    <Eye size={12} /> Logs
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {events.map((ev, i) => (
                                <Card key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px 20px' }}>
                                    <div style={{ flexShrink: 0, marginTop: '2px' }}>
                                        {ev.type === 'Warning'
                                            ? <AlertTriangle size={18} color="#fbbf24" />
                                            : <CheckCircle size={18} color="#4ade80" />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: '600', fontSize: '13px' }}>{ev.reason}</span>
                                            <span style={{
                                                fontSize: '11px', padding: '2px 8px', borderRadius: '10px',
                                                background: ev.type === 'Warning' ? 'rgba(251,191,36,0.1)' : 'rgba(74,222,128,0.1)',
                                                color: ev.type === 'Warning' ? '#fbbf24' : '#4ade80'
                                            }}>{ev.type}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>{ev.message}</p>
                                        <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#60a5fa', fontFamily: 'monospace' }}>{ev.object}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '12px', flexShrink: 0 }}>
                                        <Clock size={12} /> {ev.age}
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
