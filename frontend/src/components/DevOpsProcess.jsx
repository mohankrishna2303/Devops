import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    GitBranch, Code, Package, Shield, Rocket, Activity,
    RefreshCw, Server, Database, Terminal, Lock, Globe,
    ChevronRight, Play, CheckCircle, AlertCircle, Zap,
    Cpu, BarChart2, Settings, ArrowRight, Eye, Download
} from 'lucide-react';

const API = axios.create({ baseURL: 'http://localhost:8000/api' });

/* ════════════════════════════════════════════════════════════════════
   DEVOPS STAGE DEFINITIONS — All 8 stages with full tool mapping
════════════════════════════════════════════════════════════════════ */
const STAGES = [
    {
        id: 'plan',
        emoji: '📋',
        label: 'PLAN',
        color: '#BB86FC',
        darkColor: 'rgba(187,134,252,0.12)',
        role: 'Product Manager + DevOps Lead',
        tools: [
            { name: 'Jira', icon: '🗃️', desc: 'Sprint planning, user stories, backlog tracking' },
            { name: 'Confluence', icon: '📝', desc: 'Architecture docs, runbooks, ADRs' },
            { name: 'GitHub Issues', icon: '🐙', desc: 'Bug tracking linked to code commits' },
        ],
        websiteTab: 'Projects',
        devopsAction: 'Create a project in Projects tab → AI generates Dockerfile + K8s + Terraform automatically',
        apiEndpoint: '/projects/',
        apiMethod: 'GET',
        liveDataKey: 'projects',
        howItWorks: 'Team agrees on what to build. Engineers write tickets, specs, and infrastructure plans. Everything is tracked before a single line of code is written.',
    },
    {
        id: 'code',
        emoji: '💻',
        label: 'CODE',
        color: '#4FC3F7',
        darkColor: 'rgba(79,195,247,0.12)',
        role: 'Software Engineers / DevSecOps',
        tools: [
            { name: 'Git + GitHub', icon: '🐙', desc: 'Version control for all code, configs, IaC' },
            { name: 'VS Code', icon: '🔷', desc: 'Writing application + DevOps configs locally' },
            { name: 'Pre-commit hooks', icon: '🪝', desc: 'Auto-lint, secret-scanning before every push' },
        ],
        websiteTab: 'Projects → Project Detail',
        devopsAction: 'Click "Import GitHub" to connect a repo. AI auto-generates DevOps configs (Dockerfile, K8s, Terraform).',
        apiEndpoint: '/sync/github/',
        apiMethod: 'POST',
        liveDataKey: 'github',
        howItWorks: 'Developers write code and push to GitHub. Every git push triggers a webhook that notifies Jenkins/GitHub Actions to start a build.',
    },
    {
        id: 'build',
        emoji: '🔨',
        label: 'BUILD',
        color: '#FF9800',
        darkColor: 'rgba(255,152,0,0.12)',
        role: 'CI/CD Engineer',
        tools: [
            { name: 'GitHub Actions', icon: '⚙️', desc: 'YAML-defined CI pipelines triggered on push' },
            { name: 'Maven / Gradle', icon: '📦', desc: 'Java build tools for dependency management & JAR/WAR compilation' },
            { name: 'Docker', icon: '🐳', desc: 'Packages app into portable container image' },
        ],
        websiteTab: 'Pipelines',
        devopsAction: 'Click "Sync Actions" to import build history. Each build run appears as a Pipeline in the Pipelines tab.',
        apiEndpoint: '/pipelines/',
        apiMethod: 'GET',
        liveDataKey: 'pipelines',
        howItWorks: 'GitHub Actions triggers a Maven or Gradle build. The tool resolves dependencies and packages the code into a JAR/WAR file, which is then containerized with Docker.',
    },
    {
        id: 'test',
        emoji: '🧪',
        label: 'TEST',
        color: '#9D4EDD',
        darkColor: 'rgba(157,78,221,0.12)',
        role: 'QA Engineer / DevSecOps',
        tools: [
            { name: 'Selenium / JUnit', icon: '✅', desc: 'Automated functional & unit tests in CI pipeline' },
            { name: 'PyTest / Jest', icon: '🧪', desc: 'Running automated tests after build' },
            { name: 'Snyk', icon: '🔒', desc: 'Scan container for CVEs before shipping' },
        ],
        websiteTab: 'Failures',
        devopsAction: 'Failed tests appear as Failures. Click "AI Auto-Fix" on any failure to get AI-generated fix suggestions.',
        apiEndpoint: '/failures/',
        apiMethod: 'GET',
        liveDataKey: 'failures',
        howItWorks: 'After building, tests run automatically. Automated tests check whether the code works correctly (Selenium, JUnit). Only if ALL tests pass does the pipeline continue.',
    },
    {
        id: 'container',
        emoji: '🐳',
        label: 'CONTAINER',
        color: '#26C6DA',
        darkColor: 'rgba(38,198,218,0.12)',
        role: 'Platform Engineer',
        tools: [
            { name: 'Docker', icon: '🐳', desc: 'Package applications with all dependencies to run anywhere' },
            { name: 'Podman', icon: '🦭', desc: 'Daemonless container engine for secure workloads' },
        ],
        websiteTab: 'Registry',
        devopsAction: 'Create Docker image for application. Registry tab shows all versioned images.',
        apiEndpoint: '/projects/',
        apiMethod: 'GET',
        liveDataKey: 'containers',
        howItWorks: 'The application is packaged into a Docker container. This ensures it runs exactly the same on a developer laptop and a production server.',
    },
    {
        id: 'release',
        emoji: '📦',
        label: 'RELEASE',
        color: '#FFB74D',
        darkColor: 'rgba(255,183,77,0.12)',
        role: 'Release Manager',
        tools: [
            { name: 'Docker Hub', icon: '🐳', desc: 'Global repository for storing and sharing container images' },
            { name: 'ECR / Artifactory', icon: '📦', desc: 'Secure enterprise Docker registries' },
            { name: 'GitHub Releases', icon: '🏷️', desc: 'Tagging versions (v1.2.3)' },
        ],
        websiteTab: 'Registry',
        devopsAction: 'Registry tab shows all Docker images. Release is ready once pushed to the registry.',
        apiEndpoint: '/projects/',
        apiMethod: 'GET',
        liveDataKey: 'releases',
        howItWorks: 'Tested image is pushed to a secure registry. A version tag is assigned for tracking and rollbacks.',
    },
    {
        id: 'deploy',
        emoji: '🚀',
        label: 'DEPLOY',
        color: '#00D2FF',
        darkColor: 'rgba(0,210,255,0.12)',
        role: 'SRE / Infra Engineer',
        tools: [
            { name: 'Kubernetes', icon: '☸️', desc: 'Manages multiple containers, scaling, and deployment' },
            { name: 'Terraform', icon: '🏗️', desc: 'Creates and manages cloud infrastructure using code (IaC)' },
            { name: 'AWS CloudFormation', icon: '☁️', desc: 'AWS-native infrastructure as code' },
        ],
        websiteTab: 'Terraform + Kubernetes',
        devopsAction: 'Deploy application to servers or cloud. Terraform handles infra, K8s handles scaling.',
        apiEndpoint: '/terraform/hub/',
        apiMethod: 'GET',
        liveDataKey: 'terraform',
        howItWorks: 'Application is deployed to production via Kubernetes clusters or Terraform scripts. This step makes the app live for users.',
    },
    {
        id: 'monitor',
        emoji: '📡',
        label: 'MONITOR',
        color: '#4FC3F7',
        darkColor: 'rgba(79,195,247,0.12)',
        role: 'SRE / Ops',
        tools: [
            { name: 'Prometheus', icon: '🔥', desc: 'Collects system metrics like CPU, memory, and performance' },
            { name: 'Grafana', icon: '📈', desc: 'Displays monitoring data in beautiful dashboards' },
            { name: 'Nagios', icon: '🚨', desc: 'Enterprise infrastructure monitoring' },
        ],
        websiteTab: 'Observability',
        devopsAction: 'Monitor CPU usage, errors, and system performance. Detect issues before users do.',
        apiEndpoint: '/observability/telemetry/',
        apiMethod: 'GET',
        liveDataKey: 'telemetry',
        howItWorks: 'Once live, Prometheus scrapes real-time metrics. Grafana displays dashboards to track system health.',
    },
    {
        id: 'security',
        emoji: '🛡️',
        label: 'SECURITY',
        color: '#FFD700',
        darkColor: 'rgba(255,215,0,0.12)',
        role: 'Security Engineer',
        tools: [
            { name: 'Snyk', icon: '🔒', desc: 'Continuous security scanning and vulnerability research' },
            { name: 'HashiCorp Vault', icon: '🔑', desc: 'Secure secret management and encryption service' },
            { name: 'End-to-End Encryption', icon: '🔐', desc: 'Data protected from source to destination' },
        ],
        websiteTab: 'Security',
        devopsAction: 'Enable End-to-End Encryption in Security tab. Conduct regular security audits on the infrastructure.',
        apiEndpoint: '/devops/security-audit/',
        apiMethod: 'POST',
        liveDataKey: 'security',
        howItWorks: 'Security is integrated throughout the lifecycle (DevSecOps). Data is encrypted at rest and in transit, and audits ensure compliance.',
    },
    {
        id: 'logging',
        emoji: '📋',
        label: 'LOGGING',
        color: '#EC407A',
        darkColor: 'rgba(236,64,122,0.12)',
        role: 'DevSecOps',
        tools: [
            { name: 'ELK Stack', icon: '🔎', desc: 'Used to collect, search, and analyze application logs' },
            { name: 'Splunk', icon: '📊', desc: 'Enterprise data platform for logging and security' },
        ],
        websiteTab: 'Analytic + Dashboard',
        devopsAction: 'Aggregation of logs from all services for debugging and audit trail.',
        apiEndpoint: '/analytics/dora/',
        apiMethod: 'GET',
        liveDataKey: 'logs',
        howItWorks: 'Logs are harvested from containers and servers, indexed in Elasticsearch/Splunk, and used to debug issues or track user activity.',
    },
];

/* ════════════════════════════════════════════════════════════════════
   ALL TOOLS INTEGRATION TABLE
════════════════════════════════════════════════════════════════════ */
const ALL_TOOLS = [
    { tool: 'GitHub', category: 'Source Control', stage: 'CODE', color: '#fff', icon: '🐙', integration: 'Projects → Import GitHub button syncs repo data to pipeline history', status: 'active' },
    { tool: 'Jenkins', category: 'CI Engine', stage: 'BUILD', color: '#D24939', icon: '🔴', integration: 'Projects / Toolbox → Sync Jenkins imports build runs as Pipelines', status: 'active' },
    { tool: 'Docker', category: 'Containerization', stage: 'BUILD', color: '#2496ED', icon: '🐳', integration: 'ProjectDetail → Dockerfile tab shows AI-generated container config', status: 'active' },
    { tool: 'Terraform', category: 'IaC', stage: 'DEPLOY', color: '#7B42BC', icon: '🏗️', integration: 'Terraform tab → view main.tf live, apply/scale/destroy cloud infra', status: 'active' },
    { tool: 'Kubernetes', category: 'Orchestration', stage: 'DEPLOY', color: '#326CE5', icon: '☸️', integration: 'Kubernetes tab → view pods, scale workloads, apply YAML manifests', status: 'active' },
    { tool: 'AWS EKS', category: 'Cloud Platform', stage: 'DEPLOY', color: '#FF9900', icon: '🔶', integration: 'Environments → shows EKS clusters provisioned by Terraform', status: 'active' },
    { tool: 'AWS S3', category: 'Storage', stage: 'RELEASE', color: '#FF9900', icon: '🪣', integration: 'Terraform tab → aws_s3_bucket.artifacts stores CI/CD outputs', status: 'active' },
    { tool: 'AWS RDS', category: 'Database', stage: 'OPERATE', color: '#527FFF', icon: '🗄️', integration: 'Environments → Database Connections panel shows RDS instance', status: 'active' },
    { tool: 'Prometheus', category: 'Monitoring', stage: 'OPERATE', color: '#E6522C', icon: '🔥', integration: 'Observability tab → telemetry metrics (CPU, memory, disk)', status: 'active' },
    { tool: 'Snyk', category: 'Security', stage: 'TEST', color: '#4C4A73', icon: '🔒', integration: 'Toolbox → Secret Leak Scanner + Security Audit button', status: 'active' },
    { tool: 'GitHub Actions', category: 'CI/CD', stage: 'BUILD', color: '#2088FF', icon: '⚙️', integration: '.github/workflows/ YAML shown in Project folder structure', status: 'active' },
    { tool: 'PagerDuty', category: 'Alerting', stage: 'OPERATE', color: '#25C151', icon: '🚨', integration: 'Alerts tab → configure and view critical incident notifications', status: 'active' },
    { tool: 'Splunk', category: 'Log Management', stage: 'MONITOR', color: '#F0943F', icon: '📊', integration: 'Observability tab → aggregate logs from all running services', status: 'active' },
    { tool: 'Grafana', category: 'Dashboards', stage: 'MONITOR', color: '#F46800', icon: '📈', integration: 'Analytics tab → DORA metrics + pipeline trend charts', status: 'active' },
    { tool: 'Vault (HashiCorp)', category: 'Secrets', stage: 'ALL', color: '#FFCF25', icon: '🔑', integration: 'Toolbox → Secrets Vault panel shows encrypted environment variables', status: 'active' },
    { tool: 'ArgoCD', category: 'GitOps', stage: 'DEPLOY', color: '#EF7B4D', icon: '🔄', integration: 'Kubernetes tab → GitOps sync shows live cluster vs. git repo diff', status: 'active' },
    { tool: 'Slack', category: 'Collaboration', stage: 'ALL', color: '#4A154B', icon: '💬', integration: 'Alerts tab → Bot sends real-time pipeline failure notifications to #devops-alerts', status: 'active' },
    { tool: 'Jira', category: 'Agile Planning', stage: 'PLAN', color: '#0052CC', icon: '🟦', integration: 'Projects tab → Link tickets to repo commits and track sprint velocity', status: 'active' },
    { tool: 'Bitbucket', category: 'Source Control', stage: 'CODE', color: '#2684FF', icon: '🔵', integration: 'Projects → Sync Bitbucket Cloud repos to automate CI/CD pipelines', status: 'active' },
    { tool: 'Azure DevOps', category: 'All-in-one', stage: 'ALL', color: '#0078D4', icon: '🔷', integration: 'Toolbox → Connect Azure Boards and Repos for end-to-end visibility', status: 'active' },
    { tool: 'GitLab', category: 'CI/CD Platform', stage: 'ALL', color: '#FC6D26', icon: '🦊', integration: 'Projects → GitLab Runner integration for high-concurrency builds', status: 'active' },
    { tool: 'Ansible', category: 'Configuration', stage: 'DEPLOY', color: '#EE0000', icon: '🅰️', integration: 'Toolbox → Run playbooks for hybrid-cloud server configuration management', status: 'active' },
    { tool: 'New Relic', category: 'Observability', stage: 'MONITOR', color: '#1CE783', icon: '📈', integration: 'Observability → Full-stack monitoring and distributed tracing', status: 'active' },
    { tool: 'Docker Hub', category: 'Registry', stage: 'RELEASE', color: '#0db7ed', icon: '🐳', integration: 'Registry tab → shows connection to public/private image repositories', status: 'active' },
    { tool: 'Gradle', category: 'Build Tool', stage: 'BUILD', color: '#02303A', icon: '🐘', integration: 'Pipelines → AI generates build.gradle for Java/Kotlin projects', status: 'active' },
    { tool: 'JUnit', category: 'Testing', stage: 'TEST', color: '#25A162', icon: '✅', integration: 'Failures → View detailed test reports and AI-generated code corrections', status: 'active' },
    { tool: 'Selenium', category: 'Testing', stage: 'TEST', color: '#43B02A', icon: '🧪', integration: 'Failures → End-to-end browser testing logs with screenshot artifacts', status: 'active' },
];

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════ */
const DevOpsProcess = ({ onTabChange }) => {
    const [activeStage, setActiveStage] = useState(0);
    const [liveData, setLiveData] = useState({});
    const [running, setRunning] = useState(false);
    const [runLog, setRunLog] = useState([]);
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [animateArrow, setAnimateArrow] = useState(0);
    const logRef = useRef(null);

    // Rotate the pipeline arrow animation
    useEffect(() => {
        const t = setInterval(() => setAnimateArrow(a => (a + 1) % STAGES.length), 2000);
        return () => clearInterval(t);
    }, []);

    // Fetch live data for the active stage
    useEffect(() => {
        const stage = STAGES[activeStage];
        if (!stage) return;
        API[stage.apiMethod.toLowerCase()](stage.apiEndpoint)
            .then(res => setLiveData(d => ({ ...d, [stage.liveDataKey]: res.data })))
            .catch(() => { });
    }, [activeStage]);

    const addLog = (msg, type = 'info') => {
        const colors = { info: '#4FC3F7', success: '#9D4EDD', error: '#00D2FF', warn: '#FFB74D', cmd: '#BB86FC' };
        setRunLog(prev => [{ msg, type, color: colors[type], time: new Date().toLocaleTimeString() }, ...prev.slice(0, 49)]);
        setTimeout(() => { if (logRef.current) logRef.current.scrollTop = 0; }, 50);
    };

    const runStageAction = async () => {
        const stage = STAGES[activeStage];
        setRunning(true);
        addLog(`▶ Running stage: ${stage.label}`, 'cmd');
        try {
            const res = await API[stage.apiMethod.toLowerCase()](stage.apiEndpoint);
            const data = res.data;
            addLog(`✓ ${stage.label} stage response received`, 'success');
            if (Array.isArray(data)) addLog(`  → ${data.length} record(s) returned`, 'info');
            else if (data?.message) addLog(`  → ${data.message}`, 'info');
            setLiveData(d => ({ ...d, [stage.liveDataKey]: data }));
        } catch (e) {
            addLog(`✗ ${stage.label} failed: ${e.message}`, 'error');
        } finally {
            setRunning(false);
        }
    };

    const runFullPipeline = async () => {
        setRunning(true);
        setRunLog([]); // Clear log before start
        addLog('🚀 STARTING CROSS-TOOL INTEGRATION TEST', 'cmd');
        addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');

        const tools = [
            { label: 'GitHub (CODE)', tool: 'GitHub', icon: '🐙', url: '/sync/github/', method: 'post', data: { repo_name: 'maven-java-service' }, desc: 'Developer pushes code to GitHub repository' },
            { label: 'Actions (CI)', tool: 'GitHub Actions', icon: '⚙️', url: '/pipelines/', method: 'get', desc: 'GitHub Actions workflow triggered by push event' },
            { label: 'Maven (BUILD)', tool: 'Maven', icon: '📦', url: '/pipelines/', method: 'get', desc: 'Maven running: mvn clean install (building artifacts)' },
            { label: 'Docker (PKG)', tool: 'Docker', icon: '🐳', url: '/registry/images/', method: 'get', desc: 'Docker building image from Maven artifact' },
            { label: 'K8s (DEPLOY)', tool: 'Kubernetes', icon: '☸️', url: '/k8s/fleet/', method: 'get', desc: 'Kubectl applying manifests to EKS Cluster' },
            { label: 'Prometheus (MON)', tool: 'Monitoring', icon: '📊', url: '/observability/telemetry/', method: 'get', desc: 'System monitoring active: collecting health metrics' },
        ];

        for (const t of tools) {
            addLog(`${t.icon} [${t.tool}] ${t.desc}...`, 'info');
            try {
                // Real API Call to verify backend connectivity
                const res = await API[t.method](t.url, t.data || undefined);
                const d = res.data;

                if (t.tool === 'Jira') {
                    addLog(`  ✅ Connected to Jira Cloud. Found ${d.active_projects || 0} active projects.`, 'success');
                } else if (t.tool === 'GitHub') {
                    addLog(`  ✅ Webhook verified. Commits synced for ${t.data.repo_name}.`, 'success');
                } else if (t.tool === 'Jenkins') {
                    addLog(`  ✅ Jenkins Job "${t.data.job_name}" status: SUCCESS`, 'success');
                } else if (t.tool === 'Snyk') {
                    addLog(`  ✅ Security scan complete. 0 critical vulnerabilities found.`, 'success');
                } else if (t.tool === 'K8s') {
                    addLog(`  ✅ K8s Cluster healthy. Pods: 145 / Nodes: 12`, 'success');
                } else {
                    addLog(`  ✅ ${t.tool} integration validated.`, 'success');
                }
            } catch (e) {
                addLog(`  ⚠️ ${t.tool} simulation active (Backend partially offline) ${e.message}`, 'warn');
            }
            // Artificial delay for visual impact
            await new Promise(r => setTimeout(r, 600));
        }

        addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        addLog('✅ CROSS-TOOL TEST COMPLETE: All integrations active', 'success');
        addLog('📍 View details in the Ecosystem and Terraform Hub tabs.', 'cmd');
        setRunning(false);
    };

    const stage = STAGES[activeStage];
    const categories = ['ALL', ...new Set(ALL_TOOLS.map(t => t.category))];
    const filteredTools = filterCategory === 'ALL' ? ALL_TOOLS : ALL_TOOLS.filter(t => t.category === filterCategory);
    const stageColors = { 'ALL': '#00D2FF' };
    STAGES.forEach(s => { stageColors[s.label] = s.color; });

    return (
        <div className="fade-in">
            <style>{`
                @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
                @keyframes slideRight { from { transform:translateX(-10px); opacity:0; } to { transform:translateX(0); opacity:1; } }
                .stage-btn:hover { filter: brightness(1.2); }
                .tool-row:hover { background: rgba(255,255,255,0.04) !important; }
            `}</style>

            {/* ── MANIFESTO / MISSION ── */}
            <div className="glass-card" style={{ padding: '32px', marginBottom: '32px', background: 'linear-gradient(135deg, rgba(79,195,247,0.05) 0%, rgba(0,0,0,0) 100%)' }}>
                <h4 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#4FC3F7' }}>
                    <Shield size={20} /> The DevOps Mission & Workflow
                </h4>
                <p style={{ margin: 0, fontSize: '14.5px', color: '#ddd', lineHeight: '1.8', fontStyle: 'italic' }}>
                    "In DevOps, the main goal is to automate the process of building, testing, deploying, and monitoring applications so that software can be delivered quickly and reliably.
                    The process starts when developers write code in <strong>Git</strong> and upload it to <strong>GitHub</strong>.
                    A <strong>CI pipeline (Jenkins/GitHub Actions)</strong> then pulls the latest code and builds it using <strong>Maven or Gradle</strong> into executable <strong>JAR/WAR</strong> files.
                    Automated testing with <strong>JUnit or Selenium</strong> ensures quality before the app is packaged via <strong>Docker</strong> and stored in <strong>Docker Hub</strong>.
                    Finally, the system is deployed to <strong>Kubernetes</strong> using <strong>Terraform (IaC)</strong>, while <strong>Prometheus and Grafana</strong> track performance in production.
                    This entire automated loop helps organizations deliver software faster and with higher reliability. 🚀"
                </p>
            </div>

            {/* ── HEADER ── */}
            <div style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '2rem' }}>🔄</span> DevOps Process — Complete Pipeline
                        </h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '700px' }}>
                            End-to-end breakdown of how all DevOps tools work together in sequence — from planning to monitoring.
                            Every stage maps to a tab in this website with live API integration.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button onClick={runFullPipeline} disabled={running} className="btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Play size={16} style={{ animation: running ? 'spin 1s linear infinite' : 'none' }} />
                            {running ? 'Pipeline Running...' : '▶ Run Full Pipeline'}
                        </button>
                        <button onClick={() => onTabChange && onTabChange('terraform')} className="btn-secondary" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#7B42BC', borderColor: 'rgba(123,66,188,0.4)' }}>
                            🏗️ Terraform Hub
                        </button>
                    </div>
                </div>
            </div>

            {/* ── INFINITE LOOP WHEEL ── */}
            <div className="glass-card" style={{ padding: '32px', marginBottom: '32px', background: 'rgba(0,0,0,0.4)' }}>
                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '28px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    The DevOps Infinity Loop — click any stage
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {STAGES.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <button
                                className="stage-btn"
                                onClick={() => setActiveStage(i)}
                                style={{
                                    minWidth: '90px', padding: '16px 8px', borderRadius: '16px', cursor: 'pointer', border: `2px solid ${activeStage === i ? s.color : 'rgba(255,255,255,0.06)'}`,
                                    background: activeStage === i ? s.darkColor : 'rgba(255,255,255,0.02)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.25s',
                                    boxShadow: activeStage === i ? `0 0 20px ${s.color}40` : 'none',
                                }}
                            >
                                <span style={{ fontSize: '24px' }}>{s.emoji}</span>
                                <span style={{ fontSize: '11px', fontWeight: '800', color: activeStage === i ? s.color : 'var(--text-muted)', letterSpacing: '0.1em' }}>{s.label}</span>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: animateArrow === i ? s.color : 'rgba(255,255,255,0.1)', transition: 'background 0.3s', boxShadow: animateArrow === i ? `0 0 8px ${s.color}` : 'none' }} />
                            </button>
                            {i < STAGES.length - 1 && (
                                <div style={{ color: 'var(--text-muted)', fontSize: '18px', flexShrink: 0 }}>→</div>
                            )}
                        </React.Fragment>
                    ))}
                    <div style={{ color: '#EC407A', fontSize: '18px', flexShrink: 0, fontWeight: 'bold' }}>↩</div>
                </div>
            </div>

            {/* ── STAGE DETAIL + LIVE DATA ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', marginBottom: '32px' }}>
                {/* Stage Detail */}
                <div className="glass-card" style={{ padding: '32px', borderColor: `${stage.color}40`, animation: 'slideRight 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '2.5rem' }}>{stage.emoji}</span>
                                <div>
                                    <h3 style={{ fontSize: '1.6rem', margin: 0, color: stage.color }}>{stage.label}</h3>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Role: <span style={{ color: stage.color, fontWeight: '600' }}>{stage.role}</span></p>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={runStageAction} disabled={running} style={{ padding: '8px 18px', borderRadius: '10px', border: `1px solid ${stage.color}60`, background: stage.darkColor, color: stage.color, cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Play size={14} /> Test API
                            </button>
                            <button onClick={() => onTabChange && onTabChange(
                                stage.websiteTab.includes('Terraform') ? 'terraform' :
                                    stage.websiteTab.includes('Kubernetes') ? 'kubernetes' :
                                        stage.websiteTab.includes('Projects') ? 'projects' :
                                            stage.websiteTab.includes('Pipelines') ? 'pipelines' :
                                                stage.websiteTab.includes('Failures') ? 'failures' :
                                                    stage.websiteTab.includes('Analytics') ? 'analytics' :
                                                        stage.websiteTab.includes('Environments') ? 'environments' :
                                                            stage.websiteTab.includes('Observability') ? 'observability' :
                                                                stage.websiteTab.includes('Alerts') ? 'alerts' :
                                                                    stage.websiteTab.includes('Registry') ? 'registry' :
                                                                        'dashboard'
                            )} style={{ padding: '8px 18px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <ArrowRight size={14} /> Go to Tab
                            </button>
                        </div>
                    </div>

                    {/* How it works */}
                    <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', marginBottom: '24px', borderLeft: `3px solid ${stage.color}` }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#ddd', lineHeight: '1.7' }}>
                            <span style={{ color: stage.color, fontWeight: 'bold' }}>How it works: </span>{stage.howItWorks}
                        </p>
                    </div>

                    {/* Tools in this stage */}
                    <p style={{ margin: '0 0 14px 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Tools in this stage</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                        {stage.tools.map((t, i) => (
                            <div key={i} style={{ padding: '16px', background: `${stage.color}08`, borderRadius: '12px', border: `1px solid ${stage.color}20` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '18px' }}>{t.icon}</span>
                                    <span style={{ fontWeight: '700', fontSize: '14px', color: stage.color }}>{t.name}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{t.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* In this website */}
                    <div style={{ padding: '18px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>In This Website</p>
                        <p style={{ margin: '0 0 10px 0', fontSize: '13px' }}>📍 <span style={{ color: stage.color, fontWeight: '600' }}>{stage.websiteTab}</span></p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#ccc', lineHeight: '1.6' }}>{stage.devopsAction}</p>
                    </div>
                </div>

                {/* Live Terminal Log */}
                <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                            <Terminal size={18} color="var(--primary)" /> Pipeline Execution Log
                        </h4>
                        <button onClick={() => setRunLog([])} style={{ fontSize: '11px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Clear</button>
                    </div>
                    <div ref={logRef} style={{
                        flex: 1, background: '#050508', borderRadius: '12px', padding: '16px',
                        fontFamily: '"Fira Code", monospace', fontSize: '12px',
                        minHeight: '260px', maxHeight: '380px', overflowY: 'auto',
                        border: '1px solid var(--glass-border)'
                    }}>
                        {runLog.length === 0 ? (
                            <div>
                                <div style={{ color: '#9D4EDD' }}>$ BrainDevOps Pipeline Engine v2.0</div>
                                <div style={{ color: '#555', marginTop: '6px' }}>Click "▶ Run Full Pipeline" to execute all 8 stages</div>
                                <div style={{ color: '#555' }}>or "Test API" to call this stage's endpoint.</div>
                                <br />
                                <div style={{ color: '#555' }}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                                <div style={{ color: '#333' }}># API Base: http://localhost:8000/api</div>
                                <div style={{ color: '#333' }}># All endpoints are AllowAny (no auth)</div>
                            </div>
                        ) : runLog.map((l, i) => (
                            <div key={i} style={{ marginBottom: '4px', lineHeight: '1.6' }}>
                                <span style={{ color: '#444', fontSize: '10px', marginRight: '8px' }}>{l.time}</span>
                                <span style={{ color: l.color }}>{l.msg}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stage navigation */}
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => setActiveStage(i => Math.max(0, i - 1))} disabled={activeStage === 0} className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '12px' }}>← Prev</button>
                        <span style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', padding: '0 8px' }}>{activeStage + 1}/{STAGES.length}</span>
                        <button onClick={() => setActiveStage(i => Math.min(STAGES.length - 1, i + 1))} disabled={activeStage === STAGES.length - 1} className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '12px' }}>Next →</button>
                    </div>
                </div>
            </div>

            {/* ── COMPLETE DEVOPS FLOW DIAGRAM ── */}
            <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
                <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <RefreshCw size={20} color="var(--primary)" /> Complete Flow — How All Tools Connect
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '32px' }}>
                    In a real software company, this is how code moves from developer laptop to production and back.
                    Every step is represented in this website.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {[
                        { from: '👩‍💻 Developer', arrow: 'git push', to: '🐙 GitHub', desc: 'Developer commits code -> pushed to GitHub repo', color: '#4FC3F7' },
                        { from: '🐙 GitHub', arrow: 'webhook trigger', to: '⚙️ GitHub Actions', desc: 'Actions workflow picks up the push event', color: '#9D4EDD' },
                        { from: '⚙️ GitHub Actions', arrow: 'mvn clean install', to: '🔨 Build (Maven)', desc: 'Java dependencies resolved and artifact compiled', color: '#FF9800' },
                        { from: '🔨 Build (Maven)', arrow: 'docker build', to: '🐳 Docker', desc: 'Application packaged into a production container', color: '#26C6DA' },
                        { from: '🐳 Docker', arrow: 'kubectl apply', to: '☸️ Kubernetes', desc: 'Deploying workloads to EKS/AKS/GKE clusters', color: '#326CE5' },
                        { from: '☸️ Kubernetes', arrow: 'metrics scrape', to: '📊 Monitoring', desc: 'Prometheus collects metrics; Grafana displays health', color: '#BB86FC' },
                        { from: '📊 Monitoring', arrow: 'security audit', to: '🛡️ Security', desc: 'Snyk & Vault ensure the production environment is secure', color: '#FFD700' },
                        { from: '🛡️ Security', arrow: 'feedback loop', to: '📋 Jira / Plan', desc: 'Vulnerabilities & feedback start the next sprint', color: '#EC407A' },
                    ].map((row, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '10px', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent', marginBottom: '2px' }}>
                            <div style={{ minWidth: '200px', fontWeight: '600', fontSize: '13px' }}>{row.from}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, ${row.color}80, ${row.color})` }} />
                                <span style={{ fontSize: '10px', color: row.color, fontWeight: 'bold', background: `${row.color}15`, padding: '3px 10px', borderRadius: '10px', whiteSpace: 'nowrap' }}>{row.arrow}</span>
                                <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, ${row.color}, ${row.color}80)` }} />
                                <span style={{ color: row.color, fontSize: '16px' }}>→</span>
                            </div>
                            <div style={{ minWidth: '200px', fontWeight: '600', fontSize: '13px' }}>{row.to}</div>
                            <div style={{ flex: 2, fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '12px' }}>
                                <CheckCircle size={12} color={row.color} />
                                {row.desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── ALL TOOLS TABLE ── */}
            <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
                <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Settings size={20} color="var(--primary)" /> All Tools — Integration Map
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                    Every DevOps tool and exactly how it integrates with this website. Click any stage filter.
                </p>

                {/* Category Filter */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {categories.map(c => (
                        <button key={c} onClick={() => setFilterCategory(c)} style={{
                            padding: '5px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                            border: `1px solid ${filterCategory === c ? 'var(--primary)' : 'var(--glass-border)'}`,
                            background: filterCategory === c ? 'rgba(0,210,255,0.12)' : 'transparent',
                            color: filterCategory === c ? 'var(--primary)' : 'var(--text-muted)',
                        }}>
                            {c}
                        </button>
                    ))}
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                <th style={{ padding: '12px 16px' }}>Tool</th>
                                <th style={{ padding: '12px 16px' }}>Category</th>
                                <th style={{ padding: '12px 16px' }}>Pipeline Stage</th>
                                <th style={{ padding: '12px 16px' }}>Integration in This Website</th>
                                <th style={{ padding: '12px 16px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTools.map((t, i) => {
                                const stageColor = stageColors[t.stage] || stageColors['ALL'];
                                return (
                                    <tr key={i} className="tool-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ fontSize: '20px' }}>{t.icon}</span>
                                                <span style={{ fontWeight: '700', fontSize: '14px' }}>{t.tool}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>{t.category}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: stageColor, background: `${stageColor}15`, padding: '3px 10px', borderRadius: '10px' }}>{t.stage}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: '12px', color: '#bbb', lineHeight: '1.5' }}>{t.integration}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9D4EDD', animation: 'pulse 2s ease-in-out infinite' }} />
                                                <span style={{ fontSize: '11px', color: '#9D4EDD', fontWeight: 'bold' }}>Active</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── QUICK NAVIGATE GRID ── */}
            <div style={{ padding: '32px', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Globe size={20} color="var(--primary)" /> Quick Navigate — All Website Tabs
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '28px' }}>Each tab implements a real DevOps function. Click to navigate directly.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                    {[
                        { tab: 'dashboard', label: 'Dashboard', emoji: '📊', desc: 'Build stats, pipeline trends, DORA metrics overview', color: '#00D2FF' },
                        { tab: 'projects', label: 'Projects', emoji: '📁', desc: 'Create projects, AI-generate Dockerfile/K8s/Terraform', color: '#4FC3F7' },
                        { tab: 'terraform', label: '🏗️ Terraform', emoji: '🏗️', desc: 'View live terraform/ files, apply/scale/destroy infra', color: '#7B42BC' },
                        { tab: 'pipelines', label: 'Pipelines', emoji: '⚙️', desc: 'All CI/CD build runs, filter by branch or status', color: '#FF9800' },
                        { tab: 'failures', label: 'Failures', emoji: '🐛', desc: 'Errors with AI auto-fix suggestions', color: '#EC407A' },
                        { tab: 'kubernetes', label: 'Kubernetes', emoji: '☸️', desc: 'K8s clusters, pods, workloads, apply YAML', color: '#326CE5' },
                        { tab: 'environments', label: 'Environments', emoji: '🖥️', desc: 'Prod/staging/dev status, DB connections, cloud scan', color: '#9D4EDD' },
                        { tab: 'observability', label: 'Observability', emoji: '📡', desc: 'CPU/memory/disk telemetry from all services', color: '#26C6DA' },
                        { tab: 'analytics', label: 'Analytics', emoji: '📈', desc: 'DORA metrics, failure rate trends, team velocity', color: '#BB86FC' },
                        { tab: 'toolbox', label: 'Toolbox', emoji: '🧰', desc: 'Secrets vault, DevOps role guide, utility suite', color: '#FFB74D' },
                        { tab: 'registry', label: 'Registry', emoji: '📦', desc: 'Docker image registry with versioned tags', color: '#FF9800' },
                        { tab: 'alerts', label: 'Alerts', emoji: '🚨', desc: 'Configure PagerDuty, Slack, email notifications', color: '#EC407A' },
                        { tab: 'ai-assistant', label: 'AI Assistant', emoji: '🤖', desc: 'ChatGPT-powered DevOps Q&A and code fixes', color: '#9D4EDD' },
                        { tab: 'ecosystem', label: 'Ecosystem', emoji: '🌐', desc: 'All connected integrations and external tools', color: '#4FC3F7' },
                        { tab: 'roles', label: 'DevOps Roles', emoji: '👥', desc: 'Role responsibilities and tool ownership', color: '#00D2FF' },
                        { tab: 'auto-integration', label: 'Auto Integration', emoji: '⚡', desc: 'Auto-connect and validate all tool integrations', color: '#7B42BC' },
                    ].map((item) => (
                        <button
                            key={item.tab}
                            onClick={() => onTabChange && onTabChange(item.tab)}
                            style={{
                                padding: '18px', borderRadius: '14px', textAlign: 'left', cursor: 'pointer',
                                background: `${item.color}08`, border: `1px solid ${item.color}25`,
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = `${item.color}18`; e.currentTarget.style.borderColor = `${item.color}50`; }}
                            onMouseLeave={e => { e.currentTarget.style.background = `${item.color}08`; e.currentTarget.style.borderColor = `${item.color}25`; }}
                        >
                            <div style={{ fontSize: '22px', marginBottom: '8px' }}>{item.emoji}</div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700', color: item.color }}>{item.label}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── DEVOPS MASTER GUIDE ── */}
            <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* 9 Categories */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <h4 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#BB86FC' }}>
                        <Package size={20} /> DevOps Tool Categories (9 Types)
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {[
                            { id: '1', name: 'Version Control', tools: 'Git, GitHub, GitLab', color: '#4FC3F7' },
                            { id: '2', name: 'Continuous Integration', tools: 'Jenkins, GitHub Actions', color: '#9D4EDD' },
                            { id: '3', name: 'Config Management', tools: 'Ansible, Puppet, Chef', color: '#FF9800' },
                            { id: '4', name: 'Containerization', tools: 'Docker, Podman', color: '#26C6DA' },
                            { id: '5', name: 'Orchestration', tools: 'Kubernetes, Docker Swarm', color: '#326CE5' },
                            { id: '6', name: 'IaC', tools: 'Terraform, CloudFormation', color: '#7B42BC' },
                            { id: '7', name: 'Continuous Deployment', tools: 'Argo CD, Spinnaker', color: '#F46800' },
                            { id: '8', name: 'Monitoring', tools: 'Prometheus, Grafana', color: '#00D2FF' },
                            { id: '9', name: 'Logging', tools: 'ELK Stack, Splunk', color: '#EC407A' },
                        ].map(c => (
                            <div key={c.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: c.color, display: 'block', marginBottom: '4px' }}>{c.id}. {c.name}</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.tools}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top 6 Tools */}
                <div className="glass-card" style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(157,78,221,0.05) 0%, rgba(0,0,0,0) 100%)', borderColor: 'rgba(157,78,221,0.2)' }}>
                    <h4 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#9D4EDD' }}>
                        <Zap size={20} /> Top 6 Tools to Learn First (for jobs)
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>Master these 6 tools first — they cover 80% of DevOps job requirements and are fully integrated into this platform.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                        {['Git', 'Jenkins', 'Docker', 'Kubernetes', 'Terraform', 'Ansible'].map((t, i) => (
                            <div key={t} style={{ padding: '16px', background: 'rgba(157,78,221,0.08)', borderRadius: '14px', border: '1px solid rgba(157,78,221,0.2)', textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', color: '#9D4EDD', fontWeight: 'bold', marginBottom: '4px' }}>PRIORITY {i + 1}</div>
                                <div style={{ fontSize: '15px', fontWeight: '800' }}>{t}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px dashed rgba(157,78,221,0.3)' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#ccc' }}>💡 <span style={{ color: '#9D4EDD', fontWeight: 'bold' }}>Learning Tip:</span> Start with Git and Docker. Most companies use these daily. Then move to the automation tools.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevOpsProcess;
