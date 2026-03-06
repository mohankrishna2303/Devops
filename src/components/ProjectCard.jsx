import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Settings, Trash2, Activity, Calendar } from 'lucide-react';

export default function ProjectCard({ project, onRefresh }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const statusColor = project.status === 'active' ? '#4ade80' : '#fbbf24';
  const statusText = project.status === 'active' ? 'Active' : 'Inactive';

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
      onClick={handleClick}
      onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
      onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(255, 61, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Layers size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{project.name}</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              {project.description}
            </p>
          </div>
        </div>
        <span style={{
          padding: '4px 8px',
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 600,
          background: `${statusColor}20`,
          color: statusColor
        }}>
          {statusText}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8 }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Success Rate</p>
          <p style={{ fontSize: 16, fontWeight: 600 }}>{project.success_rate || 0}%</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8 }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Last Deploy</p>
          <p style={{ fontSize: 12, fontWeight: 600 }}>
            {new Date(project.last_deploy || project.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'var(--text-muted)' }}>
        <Activity size={14} />
        <span>Last updated {new Date(project.last_deploy || project.created_at).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
