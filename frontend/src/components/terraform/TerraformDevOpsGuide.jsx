import React, { useState } from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

const TerraformDevOpsGuide = () => {
    const [activeRoleTab, setActiveRoleTab] = useState(0);

    const DEVOPS_ROLES = [
        {
            title: 'Infrastructure Engineer (IaC)',
            color: '#00D2FF',
            icon: '🏗️',
            tools: ['Terraform', 'AWS', 'Ansible'],
            tasks: [
                'Write terraform/ modules for VPC, EKS, S3',
                'Run terraform plan → apply in the Hub',
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
                'Sync Jenkins jobs via integration sync',
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
                'Run incident response drills via terminal',
            ]
        },
        {
            title: 'DevSecOps Engineer',
            color: '#BB86FC',
            icon: '🔒',
            tools: ['Snyk', 'OWASP', 'Vault'],
            tasks: [
                'Scan repos for secrets and vulnerabilities',
                'Run SAST/DAST in CI pipeline before deploy',
                'Rotate credentials stored in Secrets Vault',
                'Run Security Audit from overview dashboard',
            ]
        },
    ];

    const TIER_COLORS = {
        'Essential': '#9D4EDD',
        'Popular': '#4FC3F7',
        'Enterprise': '#FF9800',
        'Modern': '#BB86FC',
        'Traditional': '#00D2FF',
        'Cloud': '#7B42BC',
        'Advanced': '#FF5722',
        'Alternative': '#607D8B',
        'Integrated': '#00BCD4',
        'Microsoft': '#0078D4',
        'Atlassian': '#0052CC',
        'AWS': '#FF9900',
        'Azure': '#0078D4',
        'GCP': '#4285F4',
        'HashiCorp': '#7B42BC',
        'Commercial': '#F44336',
        'Open Source': '#4CAF50',
        'Security': '#E91E63',
        'JavaScript': '#F7DF1E',
        'Java': '#007396',
        'Python': '#3776AB',
        'SQL': '#336791',
        'NoSQL': '#4DB33D',
        'ELK': '#005571',
        'Local': '#9E9E9E',
        'Legacy': '#757575',
        'Programming': '#FF6B6B',
        'Simple': '#4ECDC4',
        'Lightweight': '#95E1D3',
        'Distributed': '#F38181',
        'Vulnerability': '#AA4465',
        'Web': '#61DAFB',
        'Streaming': '#231F20',
        'Queue': '#FF6600',
        'S3 Compatible': '#C6193F',
        'Cache': '#DC382D',
        'Package Manager': '#CB3837',
        'Repository': '#24B8A3',
        'API Gateway': '#6DB33F',
        'Proxy': '#0066CC',
        'Load Balancer': '#003366',
        'Web Server': '#009639',
        'Service Discovery': '#E6522C',
        'Scheduler': '#3C4C5C',
        'Messaging': '#FF6B35',
        'Log Collector': '#DE3C4B',
        'Log Processing': '#FEC514',
        'Log Visualization': '#005571',
        'APM': '#4158D0',
        'Tracing': '#FF6B6B',
        'Visualization': '#F46E25',
        'Monitoring': '#E6522C',
        'Container Security': '#FF6B6B',
        'Secrets': '#FF9900',
        'Code Quality': '#F16421',
        'API Testing': '#FF6C37',
        'Testing': '#C21325',
        'Build Tool': '#000000',
        'Development': '#007ACC',
        'IaC': '#7B42BC',
        'Config Management': '#EE0000',
        'Orchestration': '#326CE5',
        'Containerization': '#2496ED',
        'CI/CD': '#205F97',
        'Code Repository': '#181717',
        'Version Control': '#F05032',
        'Communication': '#4A154B',
        'Project Management': '#0052CC',
        'Documentation': '#172B4D',
        'Collaboration': '#026AA7',
        'Database': '#336791',
        'Storage': '#C6193F',
        'Cloud': '#FF9900'
    };

    return (
        <div className="glass-card" style={{ padding: '32px' }}>
            <h4 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={20} color="var(--primary)" /> DevOps Mastery Guide & Tools Directory
            </h4>

            {/* Role Tab Switcher */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
                {DEVOPS_ROLES.map((role, i) => (
                    <button key={i} onClick={() => setActiveRoleTab(i)} style={{
                        padding: '10px 20px', borderRadius: '25px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
                <div>
                    <h5 style={{ margin: '0 0 16px 0', color: DEVOPS_ROLES[activeRoleTab].color }}>{DEVOPS_ROLES[activeRoleTab].icon} {DEVOPS_ROLES[activeRoleTab].title}</h5>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                        {DEVOPS_ROLES[activeRoleTab].tools.map((t, i) => (
                            <span key={i} style={{ padding: '4px 12px', background: `${DEVOPS_ROLES[activeRoleTab].color}15`, border: `1px solid ${DEVOPS_ROLES[activeRoleTab].color}40`, borderRadius: '12px', fontSize: '12px', color: DEVOPS_ROLES[activeRoleTab].color }}>{t}</span>
                        ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {DEVOPS_ROLES[activeRoleTab].tasks.map((task, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `${DEVOPS_ROLES[activeRoleTab].color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                    <span style={{ fontSize: '10px', color: DEVOPS_ROLES[activeRoleTab].color, fontWeight: 'bold' }}>{i + 1}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#ddd' }}>{task}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '20px', padding: '24px', border: '1px solid var(--glass-border)' }}>
                    <p style={{ margin: '0 0 16px 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Core Workflow Integration</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {[
                            { step: 'Plan', desc: `Architect infra or pipelines (e.g. Terraform HCL scripts)`, color: DEVOPS_ROLES[activeRoleTab].color },
                            { step: 'Execute', desc: `Apply changes via Hub controls or CLI triggers`, color: '#4FC3F7' },
                            { step: 'Monitor', desc: `Verify health on Dashboard and K8s tabs`, color: '#9D4EDD' },
                            { step: 'Patch', desc: `Use AI tools for auto-remediation of errors`, color: '#BB86FC' },
                        ].map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: s.color, background: `${s.color}15`, padding: '3px 10px', borderRadius: '8px', flexShrink: 0 }}>{s.step}</span>
                                <p style={{ margin: 0, fontSize: '13px', color: '#aaa', lineHeight: '1.4' }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top 10 Tools Table */}
            <div style={{ marginBottom: '40px' }}>
                <h5 style={{ margin: '0 0 20px 0', color: '#4FC3F7', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🏆 Priority Tools for Industry Placement
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                    {[
                        { tool: 'Git', cat: 'VCS', icon: '📦' },
                        { tool: 'Jenkins', cat: 'CI/CD', icon: '🔧' },
                        { tool: 'Docker', cat: 'Cont.', icon: '🐳' },
                        { tool: 'Kubernetes', cat: 'Orch.', icon: '☸️' },
                        { tool: 'Terraform', cat: 'IaC', icon: '🏗️' },
                        { tool: 'AWS', cat: 'Cloud', icon: '☁️' },
                        { tool: 'Ansible', cat: 'Config', icon: '📜' },
                        { tool: 'Linux', cat: 'OS', icon: '🐧' },
                        { tool: 'Prometheus', cat: 'Mon.', icon: '📡' },
                        { tool: 'Grafana', cat: 'Vis.', icon: '📊' }
                    ].map((item, i) => (
                        <div key={i} style={{ padding: '16px', background: 'rgba(79,195,247,0.05)', borderRadius: '12px', border: '1px solid rgba(79,195,247,0.15)', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', marginBottom: '8px' }}>{item.icon}</div>
                            <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '600', color: '#4FC3F7' }}>{item.tool}</p>
                            <p style={{ margin: 0, fontSize: '10px', color: '#aaa' }}>{item.cat}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Massive Tools Directory */}
            <div style={{ marginBottom: '40px' }}>
                <h5 style={{ margin: '0 0 20px 0', color: '#00D2FF', fontSize: '16px' }}>🛠️ Global DevOps Ecosystem (40+ Professional Tools)</h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                    {[
                        { tool: 'Git', tier: 'Essential' }, { tool: 'GitHub', tier: 'Essential' }, { tool: 'GitLab', tier: 'Popular' }, { tool: 'Jenkins', tier: 'Essential' }, { tool: 'Docker', tier: 'Essential' }, { tool: 'Kubernetes', tier: 'Essential' },
                        { tool: 'Terraform', tier: 'Essential' }, { tool: 'Ansible', tier: 'Essential' }, { tool: 'AWS', tier: 'Essential' }, { tool: 'Azure', tier: 'Essential' }, { tool: 'PostgreSQL', tier: 'Essential' }, { tool: 'Redis', tier: 'Essential' },
                        { tool: 'Snyk', tier: 'Security' }, { tool: 'SonarQube', tier: 'Security' }, { tool: 'Vault', tier: 'Secrets' }, { tool: 'Helm', tier: 'Essential' }, { tool: 'Istio', tier: 'Advanced' }, { tool: 'Prometheus', tier: 'Essential' },
                        { tool: 'Grafana', tier: 'Essential' }, { tool: 'ELK Stack', tier: 'Essential' }, { tool: 'Splunk', tier: 'Commercial' }, { tool: 'Postman', tier: 'API Testing' }, { tool: 'Jira', tier: 'Essential' }, { tool: 'Slack', tier: 'Essential' }
                    ].map((tool, i) => (
                        <div key={i} style={{
                            padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: `1px solid ${TIER_COLORS[tool.tier] || '#333'}25`, textAlign: 'center', transition: 'all 0.2s'
                        }} onMouseEnter={e => e.currentTarget.style.borderColor = TIER_COLORS[tool.tier]}>
                            <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: '600', color: TIER_COLORS[tool.tier] || '#fff' }}>{tool.tool}</p>
                            <p style={{ margin: 0, fontSize: '9px', color: '#666' }}>{tool.tier}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Resources Grid */}
            <div>
                <h5 style={{ margin: '0 0 20px 0', color: '#9D4EDD', fontSize: '16px' }}>📚 Learning Paths & Resources</h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {[
                        { title: 'DevOps Roadmap 2026', icon: '📈', desc: 'Step-by-step career path' },
                        { title: 'Project: EKS Auto-Scaling', icon: '🔥', desc: 'Real-world infra automation' },
                        { title: 'Interview Mastery', icon: '🎯', desc: 'Questions from top tech firms' }
                    ].map((res, i) => (
                        <div key={i} style={{ padding: '20px', background: 'rgba(157,78,221,0.06)', borderRadius: '14px', border: '1px solid rgba(157,78,221,0.2)', textAlign: 'center', cursor: 'pointer' }}>
                            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{res.icon}</div>
                            <h6 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#9D4EDD' }}>{res.title}</h6>
                            <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>{res.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TerraformDevOpsGuide;
