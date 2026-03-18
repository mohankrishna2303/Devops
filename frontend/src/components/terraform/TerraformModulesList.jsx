import React from 'react';
import { Box, Play, Trash2, Cpu, ArrowRight } from 'lucide-react';

const TerraformModulesList = ({ modules, loading, onApply, onScale, onDestroy, onInit, onPlan }) => {
    return (
        <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                    <Cpu size={20} color="var(--primary)" /> Terraform IaC Modules
                </h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" onClick={onInit} style={{ padding: '6px 12px', fontSize: '11px' }}>Init</button>
                    <button className="btn-secondary" onClick={onPlan} style={{ padding: '6px 12px', fontSize: '11px' }}>Plan</button>
                </div>
            </div>

            {loading ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Fetching configuration state...</p>
            ) : modules.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {modules.map((plan) => (
                        <div key={plan.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <h5 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{plan.plan_name}</h5>
                                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                        <span>{plan.provider} • v{plan.version}</span>
                                        <span style={{ color: plan.status === 'Applied' ? '#9D4EDD' : 'var(--primary)' }}>● {plan.status}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => onApply(plan.plan_name)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Play size={12} /> Apply
                                    </button>
                                    <button onClick={() => onScale(plan.id, plan.plan_name)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Box size={12} /> Scale
                                    </button>
                                    <button onClick={() => onDestroy(plan.id, plan.plan_name)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Trash2 size={12} /> Destroy
                                    </button>
                                </div>
                            </div>

                            {plan.resources && plan.resources.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                    {plan.resources.map((res, j) => (
                                        <div key={j} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '10px', color: 'var(--text-muted)' }}>{res.resource_type}</p>
                                            <p style={{ margin: '0', fontSize: '12px', fontWeight: '600' }}>{res.name}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                                <span style={{ fontSize: '10px', color: res.status === 'Healthy' ? '#9D4EDD' : 'var(--primary)' }}>● {res.status}</span>
                                                <ArrowRight size={10} color="#333" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No active Terraform modules found.</p>
                    <button className="btn-primary" onClick={onInit}>Initialize First Module</button>
                </div>
            )}
        </div>
    );
};

export default TerraformModulesList;
