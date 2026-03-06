import React from 'react';
import { CreditCard, CheckCircle, Zap, Shield, Crown, ArrowUpRight } from 'lucide-react';

const Billing = () => {
    const plans = [
        { name: 'Starter', price: '$0', desc: 'Perfect for individual developers and small side projects.', features: ['1 Repository', '100 Build Analyses / mo', 'Basic AI Explanations', 'Community Slack Support'], current: false },
        { name: 'Growth', price: '$49', desc: 'The best value for growing teams who want faster debugging.', features: ['10 Repositories', '5,000 Build Analyses / mo', 'AI Failure Clustering', 'Custom Webhook Rules'], current: true },
        { name: 'Enterprise', price: '$199', desc: 'Compliance, security, and dedicated support for large orgs.', features: ['Unlimited Repositories', 'Unlimited AI Analysis', 'SSO & Role Based Access', 'Dedicated Account Manager'], current: false },
    ];

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Billing & Usage</h2>
                <p style={{ color: 'var(--text-muted)' }}>Manage your subscription plan, payment methods, and usage limits.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Current Plan</p>
                    <h4 style={{ margin: 0, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>Growth <Crown size={18} /></h4>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Analysis Units</p>
                    <h4 style={{ margin: 0 }}>1,245 / 5,000</h4>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Next Billing Date</p>
                    <h4 style={{ margin: 0 }}>March 20, 2026</h4>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Connected Repos</p>
                    <h4 style={{ margin: 0 }}>4 / 10</h4>
                </div>
            </div>

            <h4 style={{ marginBottom: '24px' }}>Available Plans</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {plans.map((plan, i) => (
                    <div key={i} className="glass-card" style={{
                        padding: '32px',
                        border: plan.current ? '2px solid var(--secondary)' : '1px solid var(--glass-border)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {plan.current && (
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                right: '-30px',
                                background: 'var(--secondary)',
                                color: 'white',
                                padding: '4px 35px',
                                fontSize: '11px',
                                fontWeight: '700',
                                transform: 'rotate(45deg)'
                            }}>CURRENT</div>
                        )}
                        <h3 style={{ marginBottom: '8px' }}>{plan.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '32px', fontWeight: '800' }}>{plan.price}</span>
                            <span style={{ color: 'var(--text-muted)' }}>/mo</span>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>{plan.desc}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                            {plan.features.map((feat, j) => (
                                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                                    <CheckCircle size={14} color="#4ade80" /> {feat}
                                </div>
                            ))}
                        </div>

                        <button className={plan.current ? "btn-secondary" : "btn-primary"} style={{ width: '100%', padding: '12px' }}>
                            {plan.current ? 'Manage Plan' : 'Upgrade Now'} <ArrowUpRight size={16} style={{ marginLeft: '8px' }} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Billing;
