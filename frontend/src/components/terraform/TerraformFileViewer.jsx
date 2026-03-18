import React from 'react';
import { FileCode, Download } from 'lucide-react';

const TerraformFileViewer = ({ tfFiles, activeTfFile, setActiveTfFile }) => {
    return (
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', border: '1px solid rgba(0,210,255,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h4 style={{ margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileCode size={20} color="var(--primary)" /> Live Terraform Directory — <code style={{ fontSize: '14px', color: 'var(--primary)' }}>devops/terraform/</code>
                    </h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>These files are the actual IaC configuration stored on disk, integrated directly into your website.</p>
                </div>
                <a href="https://app.terraform.io" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                    <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Download size={14} /> Open Terraform Cloud
                    </button>
                </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>
                {/* File Tree */}
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
                    <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>📁 terraform/</p>
                    {Object.keys(tfFiles).map(f => (
                        <button key={f} onClick={() => setActiveTfFile(f)} style={{
                            display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px',
                            background: activeTfFile === f ? 'rgba(0,210,255,0.15)' : 'transparent',
                            border: activeTfFile === f ? '1px solid rgba(0,210,255,0.4)' : '1px solid transparent',
                            color: activeTfFile === f ? 'var(--primary)' : 'var(--text-muted)',
                            cursor: 'pointer', fontSize: '13px', marginBottom: '4px',
                            fontFamily: 'monospace'
                        }}>
                            📄 {f}
                        </button>
                    ))}
                    <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'var(--text-muted)' }}>QUICK COMMANDS</p>
                        {['terraform init', 'terraform plan', 'terraform apply', 'terraform destroy'].map((cmd, i) => (
                            <div key={i} style={{ padding: '6px 8px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', marginBottom: '4px' }}>
                                <code style={{ fontSize: '10px', color: '#4FC3F7' }}>{cmd}</code>
                            </div>
                        ))}
                    </div>
                </div>

                {/* File Content */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <code style={{ fontSize: '13px', color: 'var(--primary)' }}>terraform/{activeTfFile}</code>
                        <span style={{ fontSize: '11px', color: '#9D4EDD', background: 'rgba(157,78,221,0.1)', padding: '2px 10px', borderRadius: '10px' }}>● Live File</span>
                    </div>
                    <pre style={{
                        background: '#0A0A0F',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        padding: '20px',
                        fontSize: '12px',
                        fontFamily: '"Fira Code", "Courier New", monospace',
                        color: '#a8d8a8',
                        overflowX: 'auto',
                        lineHeight: '1.7',
                        maxHeight: '380px',
                        overflowY: 'auto',
                        margin: 0
                    }}>
                        {tfFiles[activeTfFile] || 'Select a file to view its content.'}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default TerraformFileViewer;
