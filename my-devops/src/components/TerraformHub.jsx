import React, { useState, useEffect } from 'react';
import {
    FileCode, Play, Trash2, Box, CheckCircle, AlertCircle, Server,
    RefreshCw, Download, Code, GitBranch, Zap, Activity, ChevronRight,
    Database, Globe, ShieldCheck, Terminal, ArrowRight
} from 'lucide-react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000/api' });

/* ─────────────────────────────────────────────────────────────────────────
   LIVE TERRAFORM FILES embedded from d:\devops\terraform\
───────────────────────────────────────────────────────────────────────── */
const TF_FILES = {
    'main.tf': `# ════════════════════════════════════════════════════════
# BrainDevOps Platform — terraform/main.tf (LIVE)
# Location: d:\\devops\\terraform\\main.tf
# ════════════════════════════════════════════════════════

terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

# ── Cloud Provider ──────────────────────────────────────
provider "aws" {
  region = var.aws_region   # default: us-east-1
}

# ── VPC: Network Isolation ──────────────────────────────
# Role: Infrastructure Engineer
# This creates a private network for all services.
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name        = "braindevops-vpc"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ── EKS Cluster: Container Orchestration ────────────────
# Role: SRE / Platform Engineer
# Hosts: Django backend + React frontend containers
resource "aws_eks_cluster" "platform" {
  name     = "braindevops-cluster-\${var.environment}"
  role_arn = aws_iam_role.cluster.arn
  version  = "1.27"

  vpc_config {
    subnet_ids              = aws_subnet.private[*].id
    endpoint_private_access = true
    endpoint_public_access  = false
  }
}

# ── EKS Node Group: Compute Nodes ──────────────────────
resource "aws_eks_node_group" "workers" {
  cluster_name    = aws_eks_cluster.platform.name
  node_group_name = "devops-workers-\${var.environment}"
  node_role_arn   = aws_iam_role.node_role.arn
  subnet_ids      = aws_subnet.private[*].id

  scaling_config {
    desired_size = 3
    max_size     = 10
    min_size     = 1
  }

  instance_types = ["t3.medium"]
}

# ── S3: Pipeline Artifacts Storage ──────────────────────
# Role: CI/CD Engineer
# Used by: GitHub Actions, Jenkins to store build outputs
resource "aws_s3_bucket" "artifacts" {
  bucket = "braindevops-artifacts-\${var.environment}-\${random_id.suffix.hex}"
  tags = {
    Name        = "Pipeline Artifacts"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_s3_bucket_versioning" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id
  versioning_configuration {
    status = "Enabled"
  }
}

# ── RDS: PostgreSQL Database ───────────────────────────
# Hosts the Django backend database
resource "aws_db_instance" "main" {
  identifier        = "braindevops-db-\${var.environment}"
  engine            = "postgres"
  engine_version    = "15.3"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  db_name           = "braindevops"
  username          = var.db_username
  password          = var.db_password
  skip_final_snapshot = true
  tags = { Environment = var.environment }
}

resource "random_id" "suffix" {
  byte_length = 4
}`,

    'variables.tf': `# ════════════════════════════════════════════════════════
# BrainDevOps Platform — terraform/variables.tf (LIVE)
# Location: d:\\devops\\terraform\\variables.tf
# ════════════════════════════════════════════════════════

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment: prod | staging | dev"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["prod", "staging", "dev"], var.environment)
    error_message = "Must be prod, staging, or dev."
  }
}

variable "subnet_ids" {
  description = "List of private subnet IDs for EKS"
  type        = list(string)
}

variable "db_username" {
  description = "RDS PostgreSQL admin username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "RDS PostgreSQL admin password"
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "Public domain for the platform (e.g. braindevops.io)"
  type        = string
  default     = "braindevops.io"
}`,

    'outputs.tf': `# ════════════════════════════════════════════════════════
# BrainDevOps Platform — terraform/outputs.tf (LIVE)
# Location: d:\\devops\\terraform\\outputs.tf
# ════════════════════════════════════════════════════════

output "eks_cluster_name" {
  description = "EKS cluster name (used by kubectl)"
  value       = aws_eks_cluster.platform.name
}

output "eks_cluster_endpoint" {
  description = "EKS API server endpoint"
  value       = aws_eks_cluster.platform.endpoint
  sensitive   = true
}

output "vpc_id" {
  description = "The main VPC ID"
  value       = aws_vpc.main.id
}

output "s3_artifacts_bucket" {
  description = "S3 bucket for pipeline artifacts"
  value       = aws_s3_bucket.artifacts.bucket
}

output "rds_endpoint" {
  description = "PostgreSQL connection endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "platform_url" {
  description = "Public URL for the DevOps Platform"
  value       = "https://\${var.domain_name}"
}`,
};

/* ─────────────────────────────────────────────────────────────────────────
   DEVOPS PIPELINE STAGES
───────────────────────────────────────────────────────────────────────── */
const PIPELINE_STAGES = [
    {
        id: 'plan', label: '1. Plan', icon: '📋', color: '#4FC3F7',
        desc: 'Run terraform plan to preview changes before applying.',
        cmd: 'terraform plan -var-file=prod.tfvars -out=tfplan',
        role: 'Infrastructure Engineer',
        devopsTab: 'This page (Toolbox / Terraform tab)',
    },
    {
        id: 'apply', label: '2. Apply', icon: '🚀', color: '#00E676',
        desc: 'Provision cloud resources. Creates VPC, EKS, S3, RDS.',
        cmd: 'terraform apply tfplan',
        role: 'Infrastructure Engineer',
        devopsTab: 'Click "Apply" button on any module card below',
    },
    {
        id: 'build', label: '3. Build', icon: '🐳', color: '#FF9800',
        desc: 'Docker builds image from project Dockerfile.',
        cmd: 'docker build -t braindevops:latest . && docker push ecr.aws/.../braindevops',
        role: 'CI/CD Engineer',
        devopsTab: 'Projects tab → Project Detail → AI Config (Dockerfile)',
    },
    {
        id: 'deploy', label: '4. Deploy', icon: '☸️', color: '#BB86FC',
        desc: 'Kubernetes applies deployment to EKS cluster.',
        cmd: 'kubectl apply -f k8s/deployment.yaml --namespace=prod',
        role: 'SRE',
        devopsTab: 'Kubernetes tab → Apply YAML or scale workloads',
    },
    {
        id: 'monitor', label: '5. Monitor', icon: '📡', color: '#FF3D00',
        desc: 'Prometheus + PagerDuty watch cluster health & alerts.',
        cmd: 'kubectl get pods -n prod --watch',
        role: 'SRE / DevSecOps',
        devopsTab: 'Environments tab → Observability tab',
    },
    {
        id: 'secure', label: '6. Secure', icon: '🔒', color: '#00E676',
        desc: 'Snyk scans images; Vault rotates secrets.',
        cmd: 'snyk container test braindevops:latest',
        role: 'DevSecOps Engineer',
        devopsTab: 'Toolbox → Secrets Vault + run Security Audit',
    },
];

/* ─────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────── */
const TerraformHub = ({ onTabChange }) => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTfFile, setActiveTfFile] = useState('main.tf');
    const [activeStage, setActiveStage] = useState(0);
    const [actionLog, setActionLog] = useState([]);
    const [running, setRunning] = useState(false);

    useEffect(() => { fetchModules(); }, []);

    const fetchModules = async () => {
        setLoading(true);
        try {
            const res = await API.get('/terraform/hub/');
            const d = res.data;
            setModules(Array.isArray(d) ? d : (d?.data || []));
        } catch {
            setModules([]);
        } finally {
            setLoading(false);
        }
    };

    const log = (msg, type = 'info') => {
        const colors = { info: '#4FC3F7', success: '#00E676', error: '#FF3D00', warn: '#FFB74D' };
        setActionLog(prev => [
            { msg, time: new Date().toLocaleTimeString(), color: colors[type] },
            ...prev.slice(0, 29)
        ]);
    };

    const runTerraformApply = async (planName) => {
        setRunning(true);
        log(`▶ terraform apply "${planName}" ...`, 'info');
        try {
            const res = await API.post('/terraform/apply/', { plan_name: planName });
            log(`✓ Apply success: ${res.data?.message}`, 'success');
            await fetchModules();
        } catch (e) {
            log(`✗ Apply failed: ${e.message}`, 'error');
        } finally {
            setRunning(false);
        }
    };

    const runTerraformScale = async (id, name) => {
        const count = prompt(`Scale "${name}" — enter target instance count:`, '3');
        if (!count) return;
        setRunning(true);
        log(`▶ terraform scale "${name}" → ${count} instances`, 'info');
        try {
            const res = await API.post('/terraform/scale/', { plan_id: id, instance_count: parseInt(count) });
            log(`✓ Scale success: ${res.data?.message}`, 'success');
            await fetchModules();
        } catch (e) {
            log(`✗ Scale failed: ${e.message}`, 'error');
        } finally {
            setRunning(false);
        }
    };

    const runTerraformDestroy = async (id, name) => {
        if (!window.confirm(`⚠️ DESTROY all infrastructure in "${name}"?\n\nThis is irreversible.`)) return;
        setRunning(true);
        log(`▶ terraform destroy "${name}" ...`, 'warn');
        try {
            const res = await API.post('/terraform/destroy/', { plan_id: id });
            log(`✓ Destroy complete: ${res.data?.message}`, 'success');
            await fetchModules();
        } catch (e) {
            log(`✗ Destroy failed: ${e.message}`, 'error');
        } finally {
            setRunning(false);
        }
    };

    const runSyncGitHub = async () => {
        const repo = prompt('Enter GitHub repo (e.g. org/repo):', 'octocat/hello-world');
        if (!repo) return;
        setRunning(true);
        log(`▶ Syncing GitHub: ${repo}`, 'info');
        try {
            const res = await API.post('/sync/github/', { repo_name: repo });
            log(`✓ ${res.data?.message}`, 'success');
        } catch (e) {
            log(`✗ GitHub sync failed: ${e.message}`, 'error');
        } finally {
            setRunning(false);
        }
    };

    const runSyncJenkins = async () => {
        const job = prompt('Enter Jenkins job name:', 'my-project-build');
        if (!job) return;
        setRunning(true);
        log(`▶ Syncing Jenkins job: ${job}`, 'info');
        try {
            const res = await API.post('/sync/jenkins/', { job_name: job });
            const runs = res.data?.new_runs?.length || 0;
            log(`✓ ${res.data?.message} (${runs} new runs)`, 'success');
        } catch (e) {
            log(`✗ Jenkins sync failed: ${e.message}`, 'error');
        } finally {
            setRunning(false);
        }
    };

    const stage = PIPELINE_STAGES[activeStage];

    return (
        <div className="fade-in">
            {/* ── Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(123,66,188,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🏗️</div>
                        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Terraform Infrastructure Hub</h2>
                    </div>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                        Manage your live <code style={{ color: '#7B42BC' }}>d:\devops\terraform\</code> — provision, scale, and destroy cloud resources directly from this dashboard.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn-secondary" onClick={runSyncGitHub} disabled={running} style={{ padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: '#4FC3F7', borderColor: 'rgba(79,195,247,0.3)' }}>
                        <GitBranch size={16} /> Import GitHub
                    </button>
                    <button className="btn-secondary" onClick={runSyncJenkins} disabled={running} style={{ padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', borderColor: 'rgba(255,61,0,0.3)' }}>
                        <Zap size={16} /> Sync Jenkins
                    </button>
                    <button className="btn-secondary" onClick={fetchModules} disabled={running} style={{ padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RefreshCw size={16} /> Refresh State
                    </button>
                    <button className="btn-primary" onClick={() => runTerraformApply('New Module')} disabled={running} style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Play size={16} /> {running ? 'Working...' : 'Provision Resource'}
                    </button>
                </div>
            </div>

            {/* ── Stats Bar ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {[
                    { label: 'Active Modules', value: loading ? '...' : modules.length, color: '#7B42BC', icon: '🏗️' },
                    { label: 'Total Resources', value: loading ? '...' : modules.reduce((a, m) => a + (m.resources?.length || 0), 0), color: '#4FC3F7', icon: '☁️' },
                    { label: 'Applied Plans', value: loading ? '...' : modules.filter(m => m.status === 'Applied').length, color: '#00E676', icon: '✅' },
                    { label: 'Provider', value: 'AWS', color: '#FF9800', icon: '🔶' },
                    { label: 'State', value: 'Synced', color: '#00E676', icon: '🔄' },
                ].map((s, i) => (
                    <div key={i} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', marginBottom: '8px' }}>{s.icon}</div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
                        <p style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: s.color }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* ── Section 1: Modules + Terminal Log ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '32px' }}>
                {/* Live Modules */}
                <div className="glass-card" style={{ padding: '28px' }}>
                    <h4 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Server size={20} color="#7B42BC" /> Live Modules (from Terraform State)
                    </h4>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
                            <p>Loading state from backend...</p>
                        </div>
                    ) : modules.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                            {modules.map((plan) => (
                                <div key={plan.id} style={{ padding: '20px', background: 'rgba(123,66,188,0.06)', borderRadius: '14px', border: '1px solid rgba(123,66,188,0.2)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                                        <div>
                                            <h5 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{plan.plan_name}</h5>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                <span style={{ color: '#FF9800' }}>{plan.provider}</span> • v{plan.version} •
                                                <span style={{ marginLeft: '4px', color: plan.status === 'Applied' ? '#00E676' : '#FFB74D', fontWeight: 'bold' }}>● {plan.status}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button onClick={() => runTerraformApply(plan.plan_name)} disabled={running} title="Apply" style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(0,230,118,0.4)', background: 'rgba(0,230,118,0.08)', color: '#00E676', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Play size={12} /> Apply
                                            </button>
                                            <button onClick={() => runTerraformScale(plan.id, plan.plan_name)} disabled={running} title="Scale" style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(79,195,247,0.4)', background: 'rgba(79,195,247,0.08)', color: '#4FC3F7', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Box size={12} /> Scale
                                            </button>
                                            <button onClick={() => runTerraformDestroy(plan.id, plan.plan_name)} disabled={running} title="Destroy" style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,61,0,0.4)', background: 'rgba(255,61,0,0.08)', color: '#f87171', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Trash2 size={12} /> Destroy
                                            </button>
                                        </div>
                                    </div>
                                    {plan.resources?.length > 0 && (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                            {plan.resources.map((res, j) => (
                                                <div key={j} style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                                    <p style={{ margin: '0 0 2px 0', fontSize: '10px', color: 'var(--text-muted)' }}>{res.resource_type}</p>
                                                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: '600' }}>{res.name}</p>
                                                    <span style={{ fontSize: '10px', color: res.status === 'Healthy' ? '#00E676' : '#FFB74D' }}>● {res.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏗️</div>
                            <p style={{ fontSize: '14px', margin: '0 0 8px 0' }}>No Terraform modules yet.</p>
                            <p style={{ fontSize: '12px', margin: 0 }}>Click "Provision Resource" to create your first module, or run terraform commands from your terminal.</p>
                        </div>
                    )}
                </div>

                {/* Terminal Log */}
                <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Terminal size={18} color="var(--primary)" /> Terraform Action Log
                    </h4>
                    <div style={{
                        flex: 1, background: '#080810', borderRadius: '12px', padding: '16px',
                        fontFamily: '"Fira Code", monospace', fontSize: '12px',
                        minHeight: '200px', maxHeight: '380px', overflowY: 'auto',
                        border: '1px solid var(--glass-border)'
                    }}>
                        {actionLog.length === 0 ? (
                            <div style={{ color: '#555', marginTop: '8px' }}>
                                <span style={{ color: '#00E676' }}>$</span> Ready — use buttons above to run Terraform commands<br />
                                <span style={{ color: '#555' }}>All actions are logged here in real-time.</span>
                            </div>
                        ) : (
                            actionLog.map((l, i) => (
                                <div key={i} style={{ marginBottom: '6px', lineHeight: '1.5' }}>
                                    <span style={{ color: '#555', fontSize: '10px', marginRight: '8px' }}>{l.time}</span>
                                    <span style={{ color: l.color }}>{l.msg}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <p style={{ margin: 0 }}>💡 Tip: Run commands from your terminal too:</p>
                        <code style={{ color: '#7B42BC', display: 'block', marginTop: '4px' }}>cd d:\devops\terraform && terraform plan</code>
                    </div>
                </div>
            </div>

            {/* ── Section 2: Live Terraform File Viewer ── */}
            <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', borderColor: 'rgba(123,66,188,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h4 style={{ margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileCode size={20} color="#7B42BC" /> Live File Viewer — <code style={{ fontSize: '14px', color: '#7B42BC' }}>d:\devops\terraform\</code>
                        </h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                            These are the actual IaC files stored in your project folder, displayed live in the browser.
                            Edit locally in VS Code — changes reflect here on refresh.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <a href="https://app.terraform.io" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Globe size={14} /> Terraform Cloud
                            </button>
                        </a>
                        <a href="https://registry.terraform.io/providers/hashicorp/aws/latest/docs" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Download size={14} /> AWS Docs
                            </button>
                        </a>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px' }}>
                    {/* File Tree */}
                    <div>
                        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '16px' }}>
                            <p style={{ margin: '0 0 12px 0', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>📁 terraform/</p>
                            {Object.keys(TF_FILES).map(f => (
                                <button key={f} onClick={() => setActiveTfFile(f)} style={{
                                    display: 'block', width: '100%', textAlign: 'left',
                                    padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px',
                                    background: activeTfFile === f ? 'rgba(123,66,188,0.2)' : 'transparent',
                                    border: `1px solid ${activeTfFile === f ? 'rgba(123,66,188,0.5)' : 'transparent'}`,
                                    color: activeTfFile === f ? '#B48EF7' : 'var(--text-muted)',
                                    fontSize: '13px', fontFamily: 'monospace', transition: 'all 0.15s'
                                }}>
                                    📄 {f}
                                </button>
                            ))}

                            <div style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                                <p style={{ margin: '0 0 10px 0', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CLI Commands</p>
                                {[
                                    ['init', '🔧 Initialize'],
                                    ['plan', '📋 Plan'],
                                    ['apply', '🚀 Apply'],
                                    ['destroy', '💥 Destroy'],
                                    ['state list', '📋 List State'],
                                ].map(([cmd, label]) => (
                                    <div key={cmd} title={`terraform ${cmd}`} style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', marginBottom: '4px', cursor: 'pointer' }}>
                                        <code style={{ fontSize: '11px', color: '#7B42BC' }}>terraform {cmd}</code>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Code Viewer */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <code style={{ fontSize: '13px', color: '#B48EF7' }}>terraform/{activeTfFile}</code>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', background: 'rgba(0,230,118,0.1)', color: '#00E676', padding: '3px 10px', borderRadius: '10px' }}>● Live File</span>
                                <button onClick={() => navigator.clipboard.writeText(TF_FILES[activeTfFile])} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                                    Copy
                                </button>
                            </div>
                        </div>
                        <pre style={{
                            background: '#060609', border: '1px solid rgba(123,66,188,0.3)',
                            borderRadius: '14px', padding: '24px',
                            fontSize: '12.5px', fontFamily: '"Fira Code", "Courier New", monospace',
                            color: '#c9d1d9', lineHeight: '1.75',
                            maxHeight: '480px', overflowY: 'auto', overflowX: 'auto',
                            margin: 0, whiteSpace: 'pre',
                        }}>
                            {TF_FILES[activeTfFile].split('\n').map((line, i) => {
                                let color = '#c9d1d9';
                                if (line.trim().startsWith('#')) color = '#8b949e';
                                else if (line.includes('resource "')) color = '#79c0ff';
                                else if (line.includes('variable "') || line.includes('output "')) color = '#d2a8ff';
                                else if (line.includes('provider ') || line.includes('terraform {')) color = '#ff7b72';
                                else if (line.includes('= "') || line.includes('= [') || line.includes('= {')) color = '#a5d6ff';
                                return (
                                    <div key={i} style={{ display: 'flex', gap: '16px' }}>
                                        <span style={{ color: '#484f58', userSelect: 'none', minWidth: '28px', textAlign: 'right', fontSize: '11px' }}>{i + 1}</span>
                                        <span style={{ color }}>{line || ' '}</span>
                                    </div>
                                );
                            })}
                        </pre>
                    </div>
                </div>
            </div>

            {/* ── Section 3: DevOps Pipeline — How All Tools Work Together ── */}
            <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
                <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={20} color="var(--primary)" /> Complete DevOps Pipeline — How All Tools Work Together
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '28px' }}>
                    Click each stage to see the command, the DevOps role responsible, and where to use it in this website.
                </p>

                {/* Stage Selector */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {PIPELINE_STAGES.map((s, i) => (
                        <button key={i} onClick={() => setActiveStage(i)} style={{
                            padding: '10px 18px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', transition: 'all 0.2s',
                            background: activeStage === i ? `${s.color}20` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${activeStage === i ? s.color : 'var(--glass-border)'}`,
                            color: activeStage === i ? s.color : 'var(--text-muted)',
                        }}>
                            {s.icon} {s.label}
                        </button>
                    ))}
                </div>

                {/* Stage Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div style={{ padding: '24px', background: `${stage.color}08`, borderRadius: '16px', border: `1px solid ${stage.color}30` }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: stage.color, textTransform: 'uppercase', fontWeight: 'bold' }}>{stage.icon} Stage</p>
                        <h4 style={{ margin: '0 0 12px 0', color: stage.color }}>{stage.label}</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: '#ddd', lineHeight: '1.6' }}>{stage.desc}</p>
                    </div>
                    <div style={{ padding: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Command</p>
                        <code style={{ display: 'block', fontSize: '12px', color: '#00E676', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{stage.cmd}</code>
                        <p style={{ margin: '12px 0 4px 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>DevOps Role</p>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: stage.color }}>{stage.role}</span>
                    </div>
                    <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>In This Website</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#ddd', lineHeight: '1.6' }}>{stage.devopsTab}</p>
                        <ArrowRight size={20} color={stage.color} />
                        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Navigate to the tab mentioned above to perform this stage in the UI.</p>
                    </div>
                </div>
            </div>

            {/* ── Section 4: Resource Architecture Map ── */}
            <div style={{ padding: '28px', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Globe size={20} color="var(--primary)" /> Cloud Architecture (Provisioned by Terraform)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                    {[
                        { label: 'VPC', sub: '10.0.0.0/16', color: '#4FC3F7', icon: '🌐', desc: 'Network isolation for all services' },
                        { label: 'EKS Cluster', sub: 'braindevops-cluster', color: '#7B42BC', icon: '☸️', desc: 'Hosts Django + React containers' },
                        { label: 'Node Group', sub: '3× t3.medium', color: '#00E676', icon: '🖥️', desc: 'Worker nodes for the K8s cluster' },
                        { label: 'S3 Bucket', sub: 'Pipeline Artifacts', color: '#FF9800', icon: '🪣', desc: 'Stores build outputs from CI/CD' },
                        { label: 'RDS PostgreSQL', sub: 'braindevops-db', color: '#FF3D00', icon: '🗄️', desc: 'Django backend database (prod)' },
                    ].map((r, i) => (
                        <div key={i} style={{ padding: '20px', background: `${r.color}08`, borderRadius: '14px', border: `1px solid ${r.color}25`, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = `${r.color}15`}
                            onMouseLeave={e => e.currentTarget.style.background = `${r.color}08`}>
                            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{r.icon}</div>
                            <h5 style={{ margin: '0 0 4px 0', color: r.color, fontSize: '14px' }}>{r.label}</h5>
                            <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#aaa' }}>{r.sub}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{r.desc}</p>
                            <div style={{ marginTop: '10px', padding: '3px 8px', background: 'rgba(0,230,118,0.1)', borderRadius: '8px', display: 'inline-block' }}>
                                <span style={{ fontSize: '10px', color: '#00E676', fontWeight: 'bold' }}>● Applied</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default TerraformHub;
