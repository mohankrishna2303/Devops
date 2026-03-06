import React, { useState } from 'react';
import {
    LayoutDashboard,
    Layers,
    GitBranch,
    AlertCircle,
    BarChart,
    Bell,
    Settings,
    CreditCard,
    LogOut,
    Search,
    ChevronRight,
    User,
    Server,
    Terminal,
    Activity,
    Box,
    Share2,
    Cpu,
    Bot,
    Zap,
    Code,
    RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { id: 'projects', icon: <Layers size={20} />, label: 'Projects' },
        { id: 'pipelines', icon: <GitBranch size={20} />, label: 'Pipelines' },
        { id: 'failures', icon: <AlertCircle size={20} />, label: 'Failures' },
        { id: 'analytics', icon: <BarChart size={20} />, label: 'Analytics' },
        { id: 'terraform', icon: <Code size={20} />, label: '🏗️ Terraform' },
        { id: 'devops-process', icon: <RefreshCw size={20} />, label: '🔄 DevOps Process' },
        { id: 'ecosystem', icon: <Share2 size={20} />, label: 'Ecosystem' },
        { id: 'kubernetes', icon: <Cpu size={20} />, label: 'Kubernetes' },
        { id: 'observability', icon: <Activity size={20} />, label: 'Observability' },
        { id: 'environments', icon: <Server size={20} />, label: 'Environments' },
        { id: 'toolbox', icon: <Terminal size={20} />, label: 'Toolbox' },
        { id: 'registry', icon: <Box size={20} />, label: 'Registry' },
        { id: 'alerts', icon: <Bell size={20} />, label: 'Alerts' },
        { id: 'ai-assistant', icon: <Bot size={20} />, label: 'AI Assistant' },
        { id: 'roles', icon: <User size={20} />, label: 'DevOps Roles' },
        { id: 'auto-integration', icon: <Zap size={20} />, label: 'Auto Integration' },
    ];

    const bottomItems = [
        { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
        { id: 'billing', icon: <CreditCard size={20} />, label: 'Billing' },
    ];

    const handleToolClick = (tool) => {
        const toolUrls = {
            'Docker': 'https://hub.docker.com',
            'K8s': 'https://kubernetes.io',
            'AWS': 'https://aws.amazon.com/console',
            'Terraform': 'https://app.terraform.io',
            'Snyk': 'https://snyk.io',
            'Jenkins': 'http://localhost:8080',
            'Splunk': 'https://www.splunk.com',
            'Slk': 'https://slack.com'
        };

        const url = toolUrls[tool.name];
        if (url) {
            window.open(url, '_blank');
        }
    };

    return (
        <div style={{
            width: '260px',
            height: '100vh',
            background: '#0D0D14',
            borderRight: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 16px',
            position: 'fixed',
            overflowY: 'auto',
            overflowX: 'hidden'
        }}>
            <div style={{ marginBottom: '40px', padding: '0 12px' }}>
                <h2 className="gradient-text" style={{ fontSize: '1.5rem' }}>BrainDevOps</h2>
            </div>

            <nav style={{ flex: 1 }}>
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            marginBottom: '4px',
                            color: (activeTab === item.id || (activeTab === 'project-detail' && item.id === 'projects') || (activeTab === 'pipeline-detail' && item.id === 'pipelines')) ? 'white' : 'var(--text-muted)',
                            background: (activeTab === item.id || (activeTab === 'project-detail' && item.id === 'projects') || (activeTab === 'pipeline-detail' && item.id === 'pipelines')) ? 'rgba(255, 61, 0, 0.1)' : 'transparent',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ color: (activeTab === item.id || (activeTab === 'project-detail' && item.id === 'projects') || (activeTab === 'pipeline-detail' && item.id === 'pipelines')) ? 'var(--primary)' : 'inherit' }}>{item.icon}</span>
                        <span style={{ fontWeight: (activeTab === item.id || (activeTab === 'project-detail' && item.id === 'projects') || (activeTab === 'pipeline-detail' && item.id === 'pipelines')) ? '600' : '400' }}>{item.label}</span>
                        {(activeTab === item.id || (activeTab === 'project-detail' && item.id === 'projects') || (activeTab === 'pipeline-detail' && item.id === 'pipelines')) && <ChevronRight size={16} style={{ marginLeft: 'auto', color: 'var(--primary)' }} />}
                    </div>
                ))}
            </nav>

            <div style={{ marginTop: '32px', padding: '0 12px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Integrations</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {[
                        { name: 'Docker', color: '#2496ED', status: 'active' },
                        { name: 'K8s', color: '#326CE5', status: 'active' },
                        { name: 'AWS', color: '#FF9900', status: 'active' },
                        { name: 'Terraform', color: '#7B42BC', status: 'active' },
                        { name: 'Snyk', color: '#4C4A73', status: 'active' },
                        { name: 'Jenkins', color: '#D24939', status: 'active' },
                        { name: 'Splunk', color: '#000000', status: 'active' },
                        { name: 'Slk', color: '#4A154B', status: 'active' },
                    ].map((tool, i) => (
                        <div
                            key={i}
                            title={`${tool.name}: ${tool.status}`}
                            onClick={() => handleToolClick(tool)}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                background: 'rgba(255,255,255,0.03)',
                                border: `1px solid ${tool.status === 'active' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 183, 77, 0.2)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                color: tool.color,
                                cursor: 'pointer'
                            }}>
                            {tool.name[0]}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                {bottomItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            marginBottom: '4px',
                            color: activeTab === item.id ? 'white' : 'var(--text-muted)',
                            background: activeTab === item.id ? 'rgba(255, 61, 0, 0.1)' : 'transparent',
                        }}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Topbar = () => {
    return (
        <div style={{
            height: '70px',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 32px',
            justifyContent: 'space-between',
            background: 'rgba(10, 10, 15, 0.8)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <div style={{ position: 'relative', width: '400px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    placeholder="Search pipelines, projects, or errors..."
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '10px 10px 10px 40px',
                        color: 'white',
                        outline: 'none'
                    }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div className="glass-card" style={{ padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
                    <Bell size={20} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '14px', fontWeight: '600' }}>Dave Harrison</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pro Plan</p>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F' }}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div style={{ flex: 1, marginLeft: '260px' }}>
                <Topbar />
                <main style={{ padding: '32px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
