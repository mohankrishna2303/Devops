import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Cpu,
    Link as LinkIcon,
    Share2,
    CheckCircle,
    Activity,
    ShieldCheck,
    Cloud,
    Terminal,
    Settings,
    Box,
    GitBranch,
    MessageSquare,
    Zap,
    Repeat,
    ArrowRight
} from 'lucide-react';

const API = axios.create({ baseURL: 'http://localhost:8000/api' });

const Ecosystem = () => {
    const [activeNode, setActiveNode] = useState(null);
    const [tools, setTools] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const defaultTools = [
        { id: 'github', name: 'GitHub', category: 'SCM', icon: <GitBranch size={20} />, status: 'Connected', connections: ['jenkins', 'sonarqube', 'slack'] },
        { id: 'jenkins', name: 'Jenkins', category: 'CI/CD', icon: <Settings size={20} />, status: 'Running', connections: ['sonarqube', 'docker', 'nexus'] },
        { id: 'sonarqube', name: 'SonarQube', category: 'Quality', icon: <ShieldCheck size={20} />, status: 'Active', connections: ['snyk', 'jenkins'] },
        { id: 'snyk', name: 'Snyk', category: 'Security', icon: <ShieldCheck size={20} />, status: 'Scanning', connections: ['docker', 'github'] },
        { id: 'docker', name: 'Docker', category: 'Containers', icon: <Box size={20} />, status: 'Active', connections: ['k8s', 'nexus'] },
        { id: 'nexus', name: 'Nexus', category: 'Artifacts', icon: <Repeat size={20} />, status: 'Online', connections: ['docker', 'jenkins'] },
        { id: 'k8s', name: 'Kubernetes', category: 'Orchestration', icon: <Cpu size={20} />, status: 'Healthy', connections: ['prometheus', 'aws', 'splunk'] },
        { id: 'prometheus', name: 'Prometheus', category: 'Monitoring', icon: <Activity size={20} />, status: 'Collecting', connections: ['grafana', 'k8s'] },
        { id: 'grafana', name: 'Grafana', category: 'Viz', icon: <Zap size={20} />, status: 'Active', connections: ['slack', 'prometheus'] },
        { id: 'splunk', name: 'Splunk', category: 'Logging', icon: <Terminal size={20} />, status: 'Indexing', connections: ['k8s', 'slack'] },
        { id: 'ansible', name: 'Ansible', category: 'Config', icon: <Terminal size={20} />, status: 'Idle', connections: ['aws', 'terraform'] },
        { id: 'terraform', name: 'Terraform', category: 'IaC', icon: <Cloud size={20} />, status: 'Applied', connections: ['aws', 'azure', 'gcp', 'ansible'] },
        { id: 'aws', name: 'AWS', category: 'Cloud', icon: <Cloud size={20} />, status: 'Production', connections: ['k8s', 'terraform'] },
        { id: 'slack', name: 'Slack', category: 'Comms', icon: <MessageSquare size={20} />, status: 'Alerting', connections: ['grafana', 'splunk', 'github'] },
        { id: 'jira', name: 'Jira', category: 'Project', icon: <Share2 size={20} />, status: 'Synced', connections: ['github', 'slack'] },
    ];

    useEffect(() => {
        const fetchIntegrations = async () => {
            try {
                const res = await API.get('/integrations/all/');
                const apiIntegrations = res.data.integrations || [];
                const mergedTools = defaultTools.map(t => {
                    const apiMatch = apiIntegrations.find(apiT => apiT.name.toLowerCase() === t.name.toLowerCase());
                    return apiMatch ? { ...t, status: apiMatch.status === 'connected' ? 'Connected' : 'Disconnected' } : t;
                });
                setTools(mergedTools);
            } catch (error) {
                console.error('Failed to fetch integrations', error);
                setTools(defaultTools);
            } finally {
                setIsLoading(false);
            }
        };
        fetchIntegrations();
    }, []);

    const getConnectionsFor = (toolId) => {
        return tools.find(t => t.id === toolId)?.connections || [];
    };

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2rem', margin: '0 0 10px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Share2 color="var(--primary)" size={32} /> Global DevOps Ecosystem
                </h2>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>15 critical tools interlinked through Aether Intelligence for a unified delivery loop.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden', minHeight: '600px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h4 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}><Activity size={20} color="var(--primary)" /> Interlink Map</h4>
                        <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600', background: 'var(--primary-glow)', padding: '6px 12px', borderRadius: '20px' }}>Click a tool to visualize dependencies</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {tools.map((tool) => (
                            <div
                                key={tool.id}
                                onClick={() => setActiveNode(tool.id)}
                                onMouseEnter={() => setActiveNode(tool.id)}
                                style={{
                                    padding: '20px',
                                    borderRadius: '12px',
                                    background: activeNode === tool.id ? 'var(--primary-glow)' : 'rgba(255,255,255,0.03)',
                                    border: activeNode === tool.id ? '1px solid rgba(0,210,255,0.5)' : '1px solid rgba(255,255,255,0.07)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    transform: activeNode === tool.id ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
                                    position: 'relative',
                                    zIndex: activeNode === tool.id ? 10 : 1,
                                    boxShadow: activeNode === tool.id ? '0 10px 30px rgba(0,210,255,0.15)' : 'none'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                    <div style={{ color: activeNode === tool.id ? 'var(--primary)' : 'var(--text-muted)' }}>
                                        {tool.icon}
                                    </div>
                                    <div>
                                        <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>{tool.name}</h5>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tool.category}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: '500' }}>● {tool.status}</span>
                                    <LinkIcon size={14} style={{ color: 'var(--text-muted)', opacity: activeNode === tool.id ? 1 : 0.5 }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SVG Connections Overlay - Simple mock arrows for the active node */}
                    {activeNode && (
                        <div className="fade-in" style={{ marginTop: '40px', padding: '24px', background: '#0a0a0f', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h5 style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Terminal size={16} /> ACTIVE DATA FLOW: {activeNode.toUpperCase()}
                            </h5>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                <div style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: '600', fontSize: '13px', boxShadow: '0 4px 15px rgba(0,210,255,0.3)' }}>{activeNode}</div>
                                <ArrowRight size={20} color="var(--primary)" style={{ opacity: 0.8 }} />
                                {getConnectionsFor(activeNode).map(conn => (
                                    <div key={conn} className="fade-in" style={{ padding: '10px 20px', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '8px', fontSize: '13px', fontWeight: '600', background: 'var(--primary-glow)' }}>{conn.toUpperCase()}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
                        <h4 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
                            <Zap size={20} color="var(--primary)" /> Sync Intelligence
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Active Data Streams</span>
                                <span style={{ fontWeight: '600', color: 'white' }}>42 active / 15 nodes</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Interlink Integrity</span>
                                <span style={{ fontWeight: '600', color: '#4ade80' }}>99.8% Latency Free</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Sync Frequency</span>
                                <span style={{ fontWeight: '600', color: 'white' }}>Every 5 seconds</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', flex: 1 }}>
                        <h4 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
                            <Activity size={20} color="#3A86FF" /> Interlink Log
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { time: '1m ago', msg: 'GitHub -> SonarQube quality gate passed.', icon: <CheckCircle size={16} color="#4ade80" /> },
                                { time: '4m ago', msg: 'Terraform synchronized AWS us-east-1 VPC.', icon: <CheckCircle size={16} color="#4ade80" /> },
                                { time: '12m ago', msg: 'Kubernetes scaling event reported to Splunk.', icon: <CheckCircle size={16} color="#4ade80" /> },
                                { time: '18m ago', msg: 'Snyk detected 0 vulnerabilities in Docker tag:v2.1', icon: <CheckCircle size={16} color="#4ade80" /> },
                                { time: '22m ago', msg: 'Grafana alert pushed to Slack #prod-alerts.', icon: <CheckCircle size={16} color="#4ade80" /> },
                            ].map((log, i) => (
                                <div key={i} style={{ display: 'flex', gap: '16px', fontSize: '13px', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                    <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', width: '60px' }}>{log.time}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0' }}>{log.icon} {log.msg}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ecosystem;
