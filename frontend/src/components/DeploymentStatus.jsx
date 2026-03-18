import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

const statusConfig = {
  Success: { icon: CheckCircle, color: '#4ade80', label: 'Success' },
  Failed: { icon: AlertCircle, color: 'var(--primary)', label: 'Failed' },
  Pending: { icon: Clock, color: 'var(--text-muted)', label: 'Pending' },
};

export default function DeploymentStatus({ deployment }) {
  if (!deployment) return null;
  const status = deployment.status || 'Pending';
  const cfg = statusConfig[status] || statusConfig.Pending;
  const Icon = cfg.icon;

  return (
    <div
      className="glass-card"
      style={{
        padding: 16,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: `${cfg.color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: cfg.color,
        }}
      >
        <Icon size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{cfg.label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {deployment.deployed_at
            ? new Date(deployment.deployed_at).toLocaleString()
            : '—'}
        </div>
        {deployment.logs && (
          <pre
            style={{
              marginTop: 8,
              fontSize: 11,
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              color: 'var(--text-muted)',
              maxHeight: 120,
              overflow: 'auto',
            }}
          >
            {deployment.logs}
          </pre>
        )}
      </div>
    </div>
  );
}
