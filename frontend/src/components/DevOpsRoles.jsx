import React from 'react';
import {
    Zap,
    Shield,
    BarChart,
    Terminal,
    Box,
    Activity,
    Lock,
    RefreshCw,
    Cpu,
    GitBranch
} from 'lucide-react';
import { motion } from 'framer-motion';

const RoleCard = ({ title, icon, color, description, tasks }) => (
    <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: `${color}15`,
            color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>{description}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasks.map((task, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{task}</span>
                </div>
            ))}
        </div>
    </div>
);

const DevOpsRoles = () => {
    const roles = [
        {
            title: "Infrastructure as Code (IaC)",
            icon: <Terminal size={28} />,
            color: "#00D2FF",
            description: "Automate infrastructure provisioning and management using AI-generated Terraform and CloudFormation templates.",
            tasks: [
                "Automated Cloud Provisioning",
                "Environment Standardization",
                "State Management & Drift Detection",
                "Cost Optimization Recommendations"
            ]
        },
        {
            title: "CI/CD Pipeline Manager",
            icon: <Zap size={28} />,
            color: "#9D4EDD",
            description: "Deep integration with GitHub Actions and Jenkins for seamless code-to-cloud delivery pipelines.",
            tasks: [
                "Automated Build Validation",
                "Multi-stage Pipeline Orchestration",
                "Artifact Versioning & Tracking",
                "One-click Cloud Deployments"
            ]
        },
        {
            title: "Site Reliability Engineer (SRE)",
            icon: <Activity size={28} />,
            color: "#03A9F4",
            description: "Monitor system health in real-time and use predictive analytics to prevent downtime before it happens.",
            tasks: [
                "DORA Metrics Tracking",
                "Error Clustering & Root Cause Analysis",
                "Performance Bottleneck Detection",
                "Automated Incident Response"
            ]
        },
        {
            title: "Security & Compliance (DevSecOps)",
            icon: <Shield size={28} />,
            color: "#FFD600",
            description: "Integrated security scanning and automated compliance audits for every deployment cycle.",
            tasks: [
                "Vulnerability Scanning",
                "End-to-End Encryption Setup",
                "IAM Policy Generation",
                "Secret Management Audits",
                "Compliance Report Generation"
            ]
        },
        {
            title: "Kubernetes Orchestrator",
            icon: <Cpu size={28} />,
            color: "#326CE5",
            description: "Visual control plane for managing K8s clusters, workloads, pods, and service discovery.",
            tasks: [
                "Pod Scaling & Load Balancing",
                "Resource Usage Monitoring",
                "Log Streaming & Diagnostic",
                "Zero-downtime Rollouts"
            ]
        },
        {
            title: "Developer Productivity",
            icon: <Box size={28} />,
            color: "#9C27B0",
            description: "Empower developers with self-service tools and AI-assisted troubleshooting to reduce mean time to recovery.",
            tasks: [
                "AI-Generated Configuration Patches",
                "Simplified Dependency Management",
                "Automated Stress Testing",
                "Cross-team Collaboration Tools"
            ]
        }
    ];

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>DevOps Intelligence Roles</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '800px' }}>
                    BrainDevOps transforms traditional manual DevOps roles into automated, AI-augmented intelligence streams.
                    Explore how our platform maps onto your engineering workflow.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {roles.map((role, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <RoleCard {...role} />
                    </motion.div>
                ))}
            </div>

            <div className="glass-card" style={{ marginTop: '48px', padding: '40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,210,255, 0.05), rgba(3, 169, 244, 0.05))' }}>
                <h3 style={{ marginBottom: '16px' }}>Ready to automate your DevOps lifecycle?</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Our AI engine performs over 85% of standard DevOps tasks automatically.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <button className="btn-primary" style={{ padding: '12px 32px' }}>Deploy First Project</button>
                    <button className="btn-secondary" style={{ padding: '12px 32px' }}>View Integration Map</button>
                </div>
            </div>
        </div>
    );
};

export default DevOpsRoles;
