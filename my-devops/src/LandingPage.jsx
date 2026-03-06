import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Rocket,
  Activity,
  Search,
  ShieldAlert,
  Lightbulb,
  Github,
  Gitlab,
  Cpu,
  BarChart3,
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-sectioncontainer" style={{ padding: '120px 20px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 61, 0, 0.1)', padding: '6px 16px', borderRadius: '100px', marginBottom: '24px', border: '1px solid rgba(255, 61, 0, 0.2)' }}>
            <Zap size={16} className="gradient-text" style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--primary)' }}>Next-Gen DevOps Intelligence</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: '24px', lineHeight: 1.1 }}>
            Stop Debugging Logs. <br />
            <span className="gradient-text">Start Shipping Faster.</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 40px' }}>
            AI-powered CI/CD failure intelligence for modern DevOps teams.
            We analyze your pipeline failures so you don't have to.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">
                Start Free Trial <ArrowRight size={18} />
              </button>
            </Link>
            <button className="btn-secondary">Book Demo</button>
          </div>

          <div style={{ marginTop: '60px', opacity: 0.6 }}>
            <p style={{ fontSize: '14px', marginBottom: '20px' }}>TRUSTED BY TEAMS USING</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Github size={24} /> <span>GitHub</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Gitlab size={24} /> <span>GitLab</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Cpu size={24} /> <span>Jenkins</span></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* What is DevOps Intelligence Tool? */}
      <section className="container" style={{ padding: '80px 20px' }}>
        <div className="glass-card" style={{ padding: '60px', borderRadius: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>What Is a DevOps Intelligence Tool?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>It’s smarter than simple monitoring. It's a platform that:</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { icon: <Activity className="gradient-text" />, text: "Monitors CI/CD pipelines" },
              { icon: <Rocket className="gradient-text" />, text: "Analyzes deployments" },
              { icon: <ShieldAlert className="gradient-text" />, text: "Detects failures" },
              { icon: <Search className="gradient-text" />, text: "Predicts infrastructure risks" },
              { icon: <Lightbulb className="gradient-text" />, text: "Gives AI-based recommendations" }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                style={{ padding: '20px', textAlign: 'center', borderRight: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              >
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                <p style={{ fontWeight: '500' }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. AI CI/CD Failure Analyzer */}
      <section className="container" style={{ padding: '80px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '2px' }}>CORE SOLUTION</span>
            <h2 style={{ fontSize: '2.8rem', margin: '16px 0 24px' }}>AI CI/CD Failure Analyzer</h2>
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Problem:</h4>
              <p style={{ color: 'var(--text-muted)' }}>Pipelines fail frequently in GitHub, GitLab, and Jenkins. Engineers waste hours debugging logs.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                "Monitors pipeline runs automatically",
                "Detects failure patterns in real-time",
                "Groups similar errors using AI",
                "Suggests likely root cause and fixes",
                "Predicts flaky tests before they break"
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--primary)' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card" style={{ padding: '40px', height: '400px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', background: '#1a1a24', border: '1px solid #333', borderRadius: '8px', padding: '15px' }}>
              <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }}></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }}></div>
              </div>
              <code style={{ fontSize: '12px', color: '#ffbdbd' }}>Error: Command "npm run build" failed with exit code 1...</code>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', background: 'rgba(255, 61, 0, 0.1)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '20px', backdropFilter: 'blur(10px)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Lightbulb size={20} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: '600' }}>AI Insight</span>
              </div>
              <p style={{ fontSize: '14px' }}>The failure is caused by a missing dependency 'axios' in package.json. Run 'npm install axios' to fix.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Other Features */}
      <section className="container" style={{ padding: '80px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem' }}>Complete Intelligence Suite</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div className="glass-card" style={{ padding: '30px' }}>
            <ShieldAlert style={{ color: 'var(--primary)', marginBottom: '20px' }} size={32} />
            <h3>Deployment Risk Scoring</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Analyzes code change size and historical failure patterns to score risks before release.</p>
          </div>
          <div className="glass-card" style={{ padding: '30px' }}>
            <BarChart3 style={{ color: 'var(--primary)', marginBottom: '20px' }} size={32} />
            <h3>DORA Intelligence</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Tracks deployment frequency, lead time, and failure rate for CTOs and Leads.</p>
          </div>
          <div className="glass-card" style={{ padding: '30px' }}>
            <Search style={{ color: 'var(--primary)', marginBottom: '20px' }} size={32} />
            <h3>Infrastructure Drift</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Detects unauthorized changes and configuration drift in AWS and Azure.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '60px' }}>Simple, Scalable Pricing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '40px' }}>
            <h3>Starter</h3>
            <div style={{ fontSize: '3rem', fontWeight: '700', margin: '20px 0' }}>$49<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span></div>
            <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '30px', color: 'var(--text-muted)' }}>
              <li style={{ marginBottom: '10px' }}><CheckCircle2 size={16} /> 1 Repository</li>
              <li style={{ marginBottom: '10px' }}><CheckCircle2 size={16} /> 1,000 Builds/mo</li>
              <li style={{ marginBottom: '10px' }}><CheckCircle2 size={16} /> Basic AI Analysis</li>
            </ul>
            <button className="btn-secondary" style={{ width: '100%' }}>Choose Plan</button>
          </div>
          <div className="glass-card" style={{ padding: '40px', border: '2px solid var(--primary)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '700' }}>MOST POPULAR</div>
            <h3>Growth</h3>
            <div style={{ fontSize: '3rem', fontWeight: '700', margin: '20px 0' }}>$149<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span></div>
            <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '30px', color: 'var(--text-muted)' }}>
              <li style={{ marginBottom: '10px' }}><CheckCircle2 size={16} /> 5 Repositories</li>
              <li style={{ marginBottom: '10px' }}><CheckCircle2 size={16} /> 10,000 Builds/mo</li>
              <li style={{ marginBottom: '10px' }}><CheckCircle2 size={16} /> Advanced AI Engine</li>
              <li style={{ marginBottom: '10px' }}><CheckCircle2 size={16} /> Slack Integration</li>
            </ul>
            <button className="btn-primary" style={{ width: '100%' }}>Choose Plan</button>
          </div>
          <div className="glass-card" style={{ padding: '40px' }}>
            <h3>Enterprise</h3>
            <div style={{ fontSize: '3rem', fontWeight: '700', margin: '20px 0' }}>Custom</div>
            <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '30px', color: 'var(--text-muted)' }}>
              <li style={{ marginBottom: '10px' }}><CheckCircle2 size={16} /> Unlimited Repos</li>
              <li style={{ marginBottom: '10px' }}><CheckCircle2 size={16} /> Custom Builds</li>
              <li style={{ marginBottom: '10px' }}><CheckCircle2 size={16} /> Priority Support</li>
              <li style={{ marginBottom: '10px' }}><CheckCircle2 size={16} /> SSO & Dedicated SLA</li>
            </ul>
            <button className="btn-secondary" style={{ width: '100%' }}>Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 20px', marginTop: '100px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>BrainDevOps</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>Smarter CI/CD failure intelligence for the modern engineering team.</p>
          </div>
          <div style={{ display: 'flex', gap: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ marginBottom: '8px' }}>Product</h4>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Features</a>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Pricing</a>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>API</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ marginBottom: '8px' }}>Legal</h4>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</a>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms</a>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Security</a>
            </div>
          </div>
        </div>
        <div className="container" style={{ marginTop: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
          © 2026 BrainDevOps Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
