import React from 'react';
import { RefreshCcw, Plus, Activity, Server, Box } from 'lucide-react';

const TerraformHeader = ({ onRefresh, onProvision, stats }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
                <h2 style={{ fontSize: '2.4rem', margin: '0 0 10px 0', letterSpacing: '-0.02em', fontWeight: '800' }}>
                    Infrastructure Hub <span style={{ color: 'var(--primary)' }}>(Terraform)</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>
                    Automate your multi-cloud infrastructure with IaC. Manage modules, view live state, and verify architecture.
                </p>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ 
                    display: 'flex', gap: '20px', padding: '10px 25px', 
                    background: 'rgba(255,255,255,0.03)', borderRadius: '15px', 
                    border: '1px solid var(--glass-border)', marginRight: '10px' 
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Modules</p>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{stats.modules || 0}</p>
                    </div>
                    <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resources</p>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.resources || 0}</p>
                    </div>
                </div>
                <button className="btn-secondary" onClick={onRefresh} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <RefreshCcw size={18} /> Sync State
                </button>
                <button className="btn-primary" onClick={onProvision} style={{ padding: '12px 25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Plus size={18} /> Provision Resource
                </button>
            </div>
        </div>
    );
};

export default TerraformHeader;
