import React from 'react';
import { motion } from 'framer-motion';
import {
    ClipboardList,
    Code2,
    Package,
    TestTube2,
    Rocket,
    Cloud,
    Settings,
    Activity
} from 'lucide-react';

const steps = [
    {
        icon: <ClipboardList size={32} />,
        title: "Plan",
        description: "Defining project goals and tracking requirements using agile methodologies.",
        color: "#6366f1"
    },
    {
        icon: <Code2 size={32} />,
        title: "Code",
        description: "Writing high-quality code and managing versions with Git for collaboration.",
        color: "#ec4899"
    },
    {
        icon: <Package size={32} />,
        title: "Build",
        description: "Automated compilation and containerization using Docker for consistency.",
        color: "#3b82f6"
    },
    {
        icon: <TestTube2 size={32} />,
        title: "Test",
        description: "Running automated suites to ensure reliability and catch bugs early.",
        color: "#10b981"
    },
    {
        icon: <Rocket size={32} />,
        title: "Release",
        description: "Continuous integration pipelines that prepare code for production.",
        color: "#f59e0b"
    },
    {
        icon: <Cloud size={32} />,
        title: "Deploy",
        description: "Infrastructure as Code (Terraform) to provision environments automatically.",
        color: "#ef4444"
    },
    {
        icon: <Settings size={32} />,
        title: "Operate",
        description: "Managing live environments and ensuring high availability.",
        color: "#8b5cf6"
    },
    {
        icon: <Activity size={32} />,
        title: "Monitor",
        description: "Real-time logging and performance tracking to drive future improvements.",
        color: "#06b6d4"
    }
];

const DevOpsFlow = () => {
    return (
        <section className="container" style={{ padding: '100px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>The DevOps Lifecycle</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
                    We follow the industry-standard DevOps cycle to ensure your software is reliable, scalable, and delivered at high speed.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '30px'
            }}>
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="glass-card"
                        style={{
                            padding: '40px',
                            position: 'relative',
                            overflow: 'hidden',
                            border: `1px solid ${step.color}22`
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            background: step.color
                        }} />

                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: `${step.color}11`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '24px',
                            color: step.color
                        }}>
                            {step.icon}
                        </div>

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{step.title}</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{step.description}</p>

                        <div style={{
                            position: 'absolute',
                            right: '-10px',
                            bottom: '-10px',
                            opacity: 0.05,
                            color: step.color
                        }}>
                            {React.cloneElement(step.icon, { size: 100 })}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default DevOpsFlow;
