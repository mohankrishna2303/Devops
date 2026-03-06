import React, { useState, useEffect } from 'react';
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

const Ecosystem = () => {
    const [activeNode, setActiveNode] = useState(null);

    const tools = [
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

    const getConnectionsFor = (toolId) => {
        return tools.find(t => t.id === toolId)?.connections || [];
    };

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Global DevOps Ecosystem</h2>
                <p style={{ color: 'var(--text-muted)' }}>15 critical tools interlinked through Aether Intelligence for a unified delivery loop.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                <div className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden', minHeight: '600px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h4 style={{ margin: 0 }}>Interlink Map</h4>
                        <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>Click a tool to visualize dependencies</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {tools.map((tool) => (
                            <div
                                key={tool.id}
                                onClick={() => setActiveNode(tool.id)}
                                onMouseEnter={() => setActiveNode(tool.id)}
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: activeNode === tool.id ? 'rgba(255, 61, 0, 0.15)' : 'rgba(255,255,255,0.02)',
                                    border: activeNode === tool.id ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    transform: activeNode === tool.id ? 'scale(1.05)' : 'scale(1)',
                                    position: 'relative',
                                    zIndex: activeNode === tool.id ? 10 : 1
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <div style={{ color: activeNode === tool.id ? 'var(--primary)' : 'var(--text-muted)' }}>
                                        {tool.icon}
                                    </div>
                                    <div>
                                        <h5 style={{ margin: 0, fontSize: '14px' }}>{tool.name}</h5>
                                        <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{tool.category}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '10px', color: '#4ade80' }}>● {tool.status}</span>
                                    <LinkIcon size={12} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SVG Connections Overlay - Simple mock arrows for the active node */}
                    {activeNode && (
                        <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px dashed var(--primary)' }}>
                            <h5 style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--primary)' }}>ACTIVE DATA FLOW: {activeNode.toUpperCase()}</h5>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                <div style={{ padding: '8px 16px', background: 'var(--primary)', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>{activeNode}</div>
                                <ArrowRight size={16} color="var(--primary)" />
                                {getConnectionsFor(activeNode).map(conn => (
                                    <div key={conn} style={{ padding: '8px 16px', border: '1px solid var(--primary)', borderRadius: '4px', fontSize: '12px' }}>{conn.toUpperCase()}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Zap size={20} color="var(--primary)" /> Sync Intelligence
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Active Data Streams</span>
                                <span style={{ fontWeight: 'bold' }}>42 active / 15 nodes</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Interlink Integrity</span>
                                <span style={{ fontWeight: 'bold', color: '#4ade80' }}>99.8% Latency Free</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Sync Frequency</span>
                                <span style={{ fontWeight: 'bold' }}>Every 5 seconds</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '24px', flex: 1 }}>
                        <h4 style={{ marginBottom: '20px' }}>Interlink Log</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { time: '1m ago', msg: 'GitHub -> SonarQube quality gate passed.', icon: <CheckCircle size={14} color="#4ade80" /> },
                                { time: '4m ago', msg: 'Terraform synchronized AWS us-east-1 VPC.', icon: <CheckCircle size={14} color="#4ade80" /> },
                                { time: '12m ago', msg: 'Kubernetes scaling event reported to Splunk.', icon: <CheckCircle size={14} color="#4ade80" /> },
                                { time: '18m ago', msg: 'Snyk detected 0 vulnerabilities in Docker tag:v2.1', icon: <CheckCircle size={14} color="#4ade80" /> },
                                { time: '22m ago', msg: 'Grafana alert pushed to Slack #prod-alerts.', icon: <CheckCircle size={14} color="#4ade80" /> },
                            ].map((log, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                                    <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{log.time}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{log.icon} {log.msg}</span>
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
