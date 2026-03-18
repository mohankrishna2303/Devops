import React, { useState, useEffect } from 'react';
import Terminal from './Terminal';
import {
    LayoutDashboard, Layers, GitBranch, AlertCircle, BarChart2,
    Bell, Settings, CreditCard, LogOut, Search, Activity, Box,
    Share2, Cpu, Bot, Zap, Code, RefreshCw, Globe, PieChart,
    Shield, Server, Terminal as TerminalIcon, ChevronDown,
    User, Sparkles, Menu, X, ExternalLink, Circle
} from 'lucide-react';

/* ── Sidebar config ─────────────────────────────────────── */
const NAV_SECTIONS = [
    {
        label: 'OVERVIEW',
        items: [
            { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
            { id: 'analytics', icon: <BarChart2 size={18} />, label: 'Analytics' },
            { id: 'alerts', icon: <Bell size={18} />, label: 'Alerts', badge: '4' },
        ]
    },
    {
        label: 'DEVOPS CORE',
        items: [
            { id: 'projects', icon: <Layers size={18} />, label: 'Projects' },
            { id: 'pipelines', icon: <GitBranch size={18} />, label: 'Pipelines' },
            { id: 'failures', icon: <AlertCircle size={18} />, label: 'Failures', badge: '3', badgeColor: '#f87171' },
            { id: 'environments', icon: <Server size={18} />, label: 'Environments' },
        ]
    },
    {
        label: 'INFRASTRUCTURE',
        items: [
            { id: 'terraform', icon: <Code size={18} />, label: 'Terraform' },
            { id: 'kubernetes', icon: <Cpu size={18} />, label: 'Kubernetes' },
            { id: 'registry', icon: <Box size={18} />, label: 'Registry' },
        ]
    },
    {
        label: 'OBSERVABILITY',
        items: [
            { id: 'observability', icon: <Activity size={18} />, label: 'Observability' },
            { id: 'splunk', icon: <PieChart size={18} />, label: 'Splunk Logs' },
        ]
    },
    {
        label: 'AI & AUTOMATION',
        items: [
            { id: 'ai-assistant', icon: <Bot size={18} />, label: 'AI Assistant', badge: 'AI' },
            { id: 'auto-integration', icon: <Zap size={18} />, label: 'Auto Integration' },
        ]
    },
    {
        label: 'PLATFORM',
        items: [
            { id: 'devops-process', icon: <RefreshCw size={18} />, label: 'DevOps Process' },
            { id: 'ecosystem', icon: <Share2 size={18} />, label: 'Ecosystem' },
            { id: 'toolbox', icon: <TerminalIcon size={18} />, label: 'Toolbox' },
            { id: 'roles', icon: <User size={18} />, label: 'DevOps Roles' },
            { id: 'security', icon: <Shield size={18} />, label: 'Security' },
        ]
    },
];

const BOTTOM_ITEMS = [
    { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
    { id: 'billing', icon: <CreditCard size={18} />, label: 'Billing' },
];

/* ── Live status indicator ──────────────────────────────── */
const LiveBadge = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(157,78,221,0.10)', border: '1px solid rgba(157,78,221,0.20)' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9D4EDD', boxShadow: '0 0 6px rgba(157,78,221,0.8)', animation: 'pulse-soft 2s infinite' }} />
        <span style={{ fontSize: '10px', color: '#9D4EDD', fontWeight: '600', letterSpacing: '0.05em' }}>LIVE</span>
    </div>
);

/* ── Main Sidebar ───────────────────────────────────────── */
const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
    const w = collapsed ? '68px' : '250px';

    return (
        <div style={{
            width: w, minWidth: w, height: '100vh',
            background: 'linear-gradient(180deg, #0A0A16 0%, #06060F 100%)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column',
            position: 'fixed', top: 0, left: 0, zIndex: 100,
            transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
            overflowX: 'hidden',
        }}>
            {/* Logo */}
            <div style={{ padding: '20px 14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
                    {!collapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg,#00D2FF,#4facfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,210,255,0.4)', flexShrink: 0 }}>
                                <Sparkles size={16} color="white" />
                            </div>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(135deg,#00D2FF,#4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    BrainDevOps
                                </div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '500', letterSpacing: '0.05em' }}>AGENTIC PLATFORM</div>
                            </div>
                        </div>
                    )}
                    {collapsed && (
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg,#00D2FF,#4facfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,210,255,0.4)' }}>
                            <Sparkles size={16} color="white" />
                        </div>
                    )}
                    {!collapsed && (
                        <button onClick={() => setCollapsed(true)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}>
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="sidebar-nav-scroll" style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
                {NAV_SECTIONS.map((section, si) => (
                    <div key={si} style={{ marginBottom: '20px' }}>
                        {!collapsed && (
                            <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', padding: '4px 10px 8px', userSelect: 'none' }}>
                                {section.label}
                            </div>
                        )}
                        {section.items.map(item => {
                            const isActive = activeTab === item.id;
                            return (
                                <div key={item.id} className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                                    onClick={() => setActiveTab(item.id)}
                                    title={collapsed ? item.label : ''}
                                    style={{ justifyContent: collapsed ? 'center' : 'flex-start', paddingLeft: collapsed ? '0' : '12px' }}>
                                    <span style={{ color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.45)', flexShrink: 0 }}>{item.icon}</span>
                                    {!collapsed && (
                                        <>
                                            <span style={{ flex: 1 }}>{item.label}</span>
                                            {item.badge && (
                                                <span style={{
                                                    fontSize: '10px', fontWeight: '700',
                                                    padding: '1px 7px', borderRadius: '999px',
                                                    background: item.badgeColor ? item.badgeColor + '20' : 'rgba(0,210,255,0.15)',
                                                    color: item.badgeColor || 'var(--primary)',
                                                    border: `1px solid ${item.badgeColor ? item.badgeColor + '40' : 'rgba(0,210,255,0.3)'}`,
                                                }}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Bottom items */}
            <div style={{ padding: '8px 8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                {BOTTOM_ITEMS.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                        <div key={item.id} className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                            title={collapsed ? item.label : ''}
                            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
                            <span style={{ color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.45)' }}>{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </div>
                    );
                })}

                {/* User avatar */}
                {!collapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 10px', marginTop: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#8338EC,#3A86FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>D</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dave Mohan</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── Topbar ─────────────────────────────────────────────── */
const Topbar = ({ activeTab, collapsed, setCollapsed }) => {
    const [time, setTime] = useState(new Date());
    const [showTerm, setShowTerm] = useState(false);

    useEffect(() => {
        const iv = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(iv);
    }, []);

    const tabLabel = (() => {
        for (const s of NAV_SECTIONS) {
            const found = s.items.find(i => i.id === activeTab);
            if (found) return found.label;
        }
        const b = BOTTOM_ITEMS.find(i => i.id === activeTab);
        return b?.label || 'Dashboard';
    })();

    const TOOL_LINKS = [
        { name: 'GitHub', url: 'https://github.com', color: '#24292e' },
        { name: 'Jenkins', url: 'http://localhost:8080', color: '#D24939' },
        { name: 'Grafana', url: 'http://localhost:3000', color: '#F46800' },
        { name: 'AWS', url: 'https://console.aws.amazon.com', color: '#FF9900' },
    ];

    return (
        <>
            <div style={{
                height: '64px',
                background: 'rgba(8,8,18,0.80)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 28px',
                position: 'fixed', top: 0,
                left: collapsed ? '68px' : '250px',
                right: 0, zIndex: 99,
                transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
            }}>
                {/* Left */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => setCollapsed(c => !c)}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
                        <Menu size={17} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>Platform</span>
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{tabLabel}</span>
                    </div>
                </div>

                {/* Center — search */}
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input className="topbar-search" type="text" placeholder="Search pipelines, projects, alerts…" />
                </div>

                {/* Right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Live clock */}
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>
                        {time.toLocaleTimeString('en-IN', { hour12: false })}
                    </div>

                    {/* Tool quick launch */}
                    {TOOL_LINKS.map(t => (
                        <a key={t.name} href={t.url} target="_blank" rel="noreferrer" title={`Open ${t.name}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 11px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)', fontSize: '12px', fontWeight: '500', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = t.color + '18'; e.currentTarget.style.borderColor = t.color + '44'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}>
                            {t.name} <ExternalLink size={10} />
                        </a>
                    ))}

                    <LiveBadge />

                    {/* Terminal toggle */}
                    <button onClick={() => setShowTerm(s => !s)}
                        title="Toggle Terminal"
                        style={{ background: showTerm ? 'rgba(0,210,255,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${showTerm ? 'rgba(0,210,255,0.35)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: showTerm ? 'var(--primary)' : 'rgba(255,255,255,0.55)', transition: 'all 0.2s' }}>
                        <TerminalIcon size={16} />
                    </button>

                    {/* Bell */}
                    <div style={{ position: 'relative', cursor: 'pointer' }}>
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 8px', color: 'rgba(255,255,255,0.55)' }}>
                            <Bell size={16} />
                        </div>
                        <div style={{ position: 'absolute', top: '5px', right: '5px', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 6px rgba(0,210,255,0.8)' }} />
                    </div>

                    {/* Avatar */}
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#8338EC,#3A86FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', cursor: 'pointer', flexShrink: 0 }}>D</div>
                </div>
            </div>

            {/* Inline terminal drawer */}
            {showTerm && (
                <div style={{
                    position: 'fixed', bottom: 0,
                    left: collapsed ? '68px' : '250px', right: 0,
                    height: '260px', zIndex: 98,
                    background: '#09090f',
                    borderTop: '1px solid rgba(0,210,255,0.25)',
                    transition: 'left 0.25s',
                }}>
                    <div style={{ padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                            <TerminalIcon size={14} />  BrainDevOps Terminal
                        </div>
                        <button onClick={() => setShowTerm(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}>
                            <X size={16} />
                        </button>
                    </div>
                    <div style={{ height: 'calc(100% - 41px)' }}>
                        <Terminal />
                    </div>
                </div>
            )}
        </>
    );
};

/* ── Main Layout wrapper ────────────────────────────────── */
const DashboardLayout = ({ activeTab, setActiveTab, children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const sideW = collapsed ? 68 : 250;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main area */}
            <div style={{
                marginLeft: sideW,
                marginTop: 64,
                flex: 1, minWidth: 0,
                transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
                background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,210,255,0.06) 0%, transparent 60%), var(--bg-base)',
            }}>
                <Topbar activeTab={activeTab} collapsed={collapsed} setCollapsed={setCollapsed} />

                {/* Content */}
                <div style={{
                    padding: '32px 36px',
                    minHeight: 'calc(100vh - 64px)',
                }}>
                    {children}
                </div>
            </div>

            <style>{`
                @keyframes pulse-soft { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
                .topbar-search { outline: none; }
                .topbar-search:focus { outline: none; }
            `}</style>
        </div>
    );
};

export default DashboardLayout;
