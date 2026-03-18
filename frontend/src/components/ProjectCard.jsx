import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Activity, Calendar, GitBranch, Box, Code, Cpu } from 'lucide-react';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/projects/${project.id}`);

  // Generate some premium-looking metadata based on the project state
  const isHealthy = (project.success_rate || 100) > 85;
  const statusBadge = isHealthy ? 'badge-success' : 'badge-warning';
  const statusText = isHealthy ? 'HEALTHY' : 'DEGRADED';

  // Icon based on language/framework (simulated)
  const getIcon = () => {
    const l = (project.language || '').toLowerCase();
    if (l.includes('node') || l.includes('js')) return <Box size={22} />;
    if (l.includes('python')) return <Code size={22} />;
    return <Cpu size={22} />;
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={handleClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            {getIcon()}
          </div>
          <div>
            <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '600' }}>{project.name}</h4>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              {project.provider === 'GitHub' ? <GitBranch size={14} /> : <Layers size={14} />}
              <span>{project.repo_name || `${project.language || 'Code'} • ${project.framework || 'App'}`}</span>
            </div>
          </div>
        </div>
        <span className={`badge ${statusBadge}`} style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '20px' }}>{statusText}</span>
      </div>

      {/* Grid Stats */}
      <div className="grid-2" style={{ gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Success Rate</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '20px', fontWeight: '700', color: isHealthy ? '#4ade80' : '#FFBE0B' }}>{project.success_rate || 100}%</span>
          </div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Last Deploy</p>
          <p style={{ fontSize: '15px', fontWeight: '600', color: 'white', margin: 0 }}>
            {new Date(project.last_deploy || project.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <Activity size={14} color="var(--primary)" />
          <span>Active CI/CD pipeline</span>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>Manage <span style={{ fontSize: '14px' }}>→</span></span>
      </div>
    </div>
  );
}
