import React from 'react';
import { Globe } from 'lucide-react';

const TerraformArchitecture = () => {
    const ARCH_RESOURCES = [
        { label: 'VPC', sub: '10.0.0.0/16', color: '#00D2FF', icon: '🌐', desc: 'Network isolation for all services' },
        { label: 'EKS Cluster', sub: 'braindevops-cluster', color: '#9D4EDD', icon: '☸️', desc: 'Hosts Django + React containers' },
        { label: 'Node Group', sub: '3× t3.medium', color: '#4FC3F7', icon: '🖥️', desc: 'Worker nodes for the K8s cluster' },
        { label: 'S3 Bucket', sub: 'Pipeline Artifacts', color: '#FF9800', icon: '🪣', desc: 'Stores build outputs from CI/CD' },
        { label: 'RDS Database', sub: 'PostgreSQL Prod', color: '#00BCD4', icon: '🗄️', desc: 'Django backend database (prod)' },
    ];

    return (
        <div style={{ padding: '40px 32px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', border: '1px solid var(--glass-border)', marginBottom: '40px' }}>
            <h4 style={{ margin: '0 0 32px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
                <Globe size={20} color="var(--primary)" /> Cloud Architecture (Provisioned by Terraform)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
                {ARCH_RESOURCES.map((r, i) => (
                    <div key={i} style={{ padding: '24px', background: `${r.color}08`, borderRadius: '18px', border: `1px solid ${r.color}20`, textAlign: 'center', transition: 'all 0.3s ease' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = `${r.color}15`;
                            e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = `${r.color}08`;
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>{r.icon}</div>
                        <h5 style={{ margin: '0 0 4px 0', color: r.color, fontSize: '15px' }}>{r.label}</h5>
                        <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: 'var(--text-muted)' }}>{r.sub}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#aaa', lineHeight: '1.4' }}>{r.desc}</p>
                        <div style={{ marginTop: '14px', padding: '4px 10px', background: 'rgba(157,78,221,0.15)', borderRadius: '10px', display: 'inline-block' }}>
                            <span style={{ fontSize: '10px', color: '#9D4EDD', fontWeight: 'bold' }}>● Managed</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TerraformArchitecture;
