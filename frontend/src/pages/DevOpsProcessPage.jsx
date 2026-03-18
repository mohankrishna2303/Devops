import React, { useState, useEffect } from 'react';
import { GitBranch, Package, Rocket, Monitor, Settings, ArrowRight, Play, Server, Activity, AlertCircle, CheckCircle, Shield, RefreshCw, Zap } from 'lucide-react';
import api from '../services/apiService';

const DevOpsProcessPage = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    fetchDataForStage(activeStage);
  }, [activeStage]);

  const fetchDataForStage = async (stageIndex) => {
    setLoading(true);
    try {
      // Mocked endpoint switches based on the DevOps Stage
      let result = null;
      if (stageIndex === 0) { // Code
        // result = await api.get('/analytics/dora/');
        result = { deployment_frequency: "High", lead_time: "Low", mttr: "Under 2h" };
      } else if (stageIndex === 1) { // Build
        // result = await api.get('/sync/github/');
        result = { latest_run: "Success", run_time: "5m 23s", artifacts: 2 };
      }
      setData(result || {});
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => setLoading(false), 500);
  };

  const stages = [
    {
      name: 'Code & Plan',
      icon: GitBranch,
      description: 'Develop and version control your code with AI Assistance.',
      tools: ['GitHub', 'GitLab', 'Jira'],
      status: 'active',
      metrics: { commits: 156, branches: 12, Prs: 8, leadTime: '4 hrs' },
      actions: ['Analyze DORA Metrics', 'Generate Config via AI']
    },
    {
      name: 'Build & CI',
      icon: Package,
      description: 'Compile, build, and package applications as immutable artifacts.',
      tools: ['Jenkins', 'GitHub Actions', 'Docker'],
      status: 'active',
      metrics: { builds: 89, successRate: '94%', avgTime: '3.2m', fails: 5 },
      actions: ['Trigger Manual Build', 'Auto-Heal Failed Pipeline']
    },
    {
      name: 'Test & Sec',
      icon: Shield,
      description: 'Automated testing and DevSecOps vulnerability scanning.',
      tools: ['Selenium', 'SonarQube', 'Trivy'],
      status: 'active',
      metrics: { coverage: '87%', vulns: 2, critical: 0, testTime: '2.1m' },
      actions: ['Run Security Audit', 'Scan Cloud Resources']
    },
    {
      name: 'Deploy (IaC)',
      icon: Rocket,
      description: 'Provision infrastructure & deploy workloads automatically.',
      tools: ['Kubernetes', 'Terraform', 'ArgoCD'],
      status: 'active',
      metrics: { deployments: 45, rollbackRate: '2%', k8sPods: 12 },
      actions: ['Apply Terraform Plan', 'Scale Kubernetes Fleet']
    },
    {
      name: 'Operate & Monitor',
      icon: Activity,
      description: 'Observe applications, auto-scale, and optimize cloud costs.',
      tools: ['Grafana', 'Prometheus', 'Splunk'],
      status: 'active',
      metrics: { uptime: '99.99%', alerts: 0, responseTime: '245ms', costSavings: '$320' },
      actions: ['View Telemetry', 'Apply Cost Recommendations']
    }
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text gradient-text">End-to-End DevOps Lifecycle</h1>
        <p className="text-muted mt-2">Interact with your entire CI/CD and Infrastructure pipeline from a single view.</p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="glass-card p-8 mb-8">
        <div className="flex justify-between items-center relative overflow-x-auto pb-4">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-[rgba(255,255,255,0.1)] -z-10 transform -translate-y-1/2 rounded" />
          
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = activeStage === index;
            const isPast = activeStage > index;
            
            return (
              <div key={index} className="flex-1 text-center relative z-10 px-2 min-w-[120px]">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setActiveStage(index)}
                    className={`p-4 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] scale-110' 
                        : isPast
                        ? 'bg-green-500 text-white'
                        : 'bg-[rgba(255,255,255,0.05)] text-gray-400 hover:bg-[rgba(255,255,255,0.1)] hover:text-white'
                    }`}
                  >
                    <Icon className="h-7 w-7" />
                  </button>
                  <h3 className={`mt-4 font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>{stage.name}</h3>
                  {isActive && (
                    <div className="mt-2 status-online shadow-[0_0_8px_#22c55e]"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Stage Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 slide-up">
        {/* Stage Overview */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="p-2 bg-[rgba(255,255,255,0.1)] rounded-lg">
                {React.createElement(stages[activeStage].icon, { className: 'h-6 w-6 text-blue-400' })}
              </span>
              {stages[activeStage].name}
            </h2>
            <span className="badge badge-success">Operational</span>
          </div>
          
          <p className="text-muted text-lg mb-6">{stages[activeStage].description}</p>
          
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Toolchain Integations</h3>
            <div className="flex flex-wrap gap-3">
              {stages[activeStage].tools.map((tool, index) => (
                <span key={index} className="px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white rounded-lg text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-gray-400" />
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div>
             <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Pipeline Actions</h3>
             <div className="flex flex-wrap gap-4">
               {stages[activeStage].actions.map((action, i) => (
                 <button key={i} className={i % 2 === 0 ? "btn-primary" : "btn-secondary"}>
                   {i % 2 === 0 ? <Play className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                   {action}
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Live Metrics Sidebar */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Live Metrics</h2>
            {loading ? <RefreshCw className="w-5 h-5 animate-spin text-blue-400" /> : <Activity className="w-5 h-5 text-blue-400" />}
          </div>
          
          <div className="space-y-4">
            {Object.entries(stages[activeStage].metrics).map(([key, value]) => (
              <div key={key} className="bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.05)] p-4 rounded-xl flex justify-between items-center transition-all hover:bg-[rgba(255,255,255,0.05)]">
                <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-xl font-bold text-white">{value}</span>
              </div>
            ))}
          </div>

          {activeStage === 1 && stages[activeStage].metrics.fails > 0 && (
             <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
               <div className="flex items-center gap-2 text-red-400 mb-2">
                 <AlertCircle className="w-5 h-5" />
                 <span className="font-semibold">Pipeline Alert</span>
               </div>
               <p className="text-sm text-gray-300 mb-3">There are 5 failed builds. AI Auto-heal is recommended to instantly analyze and patch the underlying code.</p>
               <button className="w-full text-center py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                 Deep Dive Failures
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevOpsProcessPage;
