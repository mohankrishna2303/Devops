import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2 } from 'lucide-react';

const TerraformActionLog = ({ actionLog, setActionLog }) => {
    const logEndRef = useRef(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [actionLog]);

    return (
        <div className="glass-card" style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                    <Terminal size={20} color="var(--primary)" /> Action Log (Terminal)
                </h4>
                <button onClick={() => setActionLog([])} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trash2 size={12} /> Clear
                </button>
            </div>
            <div style={{
                flex: 1,
                background: '#0A0A0F',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '12px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                minHeight: '200px'
            }}>
                {actionLog.length === 0 ? (
                    <p style={{ color: '#555', margin: 0 }}>Waiting for terraform actions...</p>
                ) : (
                    actionLog.map((log, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', animation: 'fadeIn 0.3s ease-out' }}>
                            <span style={{ color: '#555', flexShrink: 0 }}>[{log.time}]</span>
                            <span style={{ color: log.color || '#fff', lineBreak: 'anywhere' }}>{log.msg}</span>
                        </div>
                    ))
                )}
                <div ref={logEndRef} />
            </div>
        </div>
    );
};

export default TerraformActionLog;
