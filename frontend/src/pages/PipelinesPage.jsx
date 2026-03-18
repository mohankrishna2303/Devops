import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, Clock, CheckCircle, XCircle, AlertCircle, GitBranch, Terminal, RefreshCw } from 'lucide-react';
import api from '../services/apiService';

const PipelinesPage = () => {
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPipelines();
  }, []);

  const fetchPipelines = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pipelines/');
      setPipelines(res.data || []);
    } catch (err) {
      console.error('Failed to fetch pipelines', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'running' || s === 'in_progress') return <Clock className="h-5 w-5 text-blue-400 animate-spin" />;
    if (s === 'completed' || s === 'success') return <CheckCircle className="h-5 w-5 text-green-400" />;
    if (s === 'failed' || s === 'failure') return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertCircle className="h-5 w-5 text-gray-400" />;
  };

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed' || s === 'success') return '#22c55e';
    if (s === 'failed' || s === 'failure') return '#ef4444';
    if (s === 'running' || s === 'in_progress') return '#3b82f6';
    return '#9ca3af';
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text gradient-text">CI/CD Pipelines</h1>
          <p className="text-muted mt-2">Monitor and manage your end-to-end deployment pipelines</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={fetchPipelines} className="btn-secondary flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Play className="h-4 w-4" />
            Trigger Pipeline
          </button>
        </div>
      </div>

      {loading && pipelines.length === 0 ? (
        <div className="flex items-center justify-center h-64 glass-card">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="text-gray-400 font-medium">Fetching pipelines...</p>
          </div>
        </div>
      ) : pipelines.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-400">
          <Terminal className="h-16 w-16 mx-auto mb-4 opacity-50 text-blue-400" />
          <h3 className="text-xl font-semibold text-white mb-2">No Pipelines Found</h3>
          <p className="text-muted mb-6">Initialize a project or connect your GitHub repository to start seeing pipeline executions here.</p>
          <button className="btn-primary inline-flex items-center gap-2">
            <GitBranch className="h-4 w-4" /> Connect Repository
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 slide-up">
          {pipelines.map((pipeline) => {
            const statusColor = getStatusColor(pipeline.status);
            const progress = (pipeline.status === 'success' || pipeline.status === 'completed') ? 100 
                           : (pipeline.status === 'failure' || pipeline.status === 'failed') ? 40 : 65;
            
            return (
              <div key={pipeline.id} className="glass-card p-6 relative overflow-hidden group hover:border-[rgba(255,255,255,0.15)] transition-all flex flex-col h-full">
                {/* Top glow indicator */}
                <div 
                  className="absolute top-0 left-0 w-full h-1" 
                  style={{ backgroundColor: statusColor, boxShadow: `0 0 10px ${statusColor}` }}
                />

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-blue-400" />
                      #{pipeline.build_number || pipeline.id || Math.floor(Math.random() * 800 + 100)}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{pipeline.project_name || pipeline.repo_name || 'Generic Service Pipeline'}</p>
                  </div>
                  <div className="flex items-center bg-[rgba(255,255,255,0.05)] p-2 rounded-lg" title={pipeline.status}>
                    {getStatusIcon(pipeline.status)}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-400 mb-6 gap-2 bg-[rgba(0,0,0,0.2)] px-3 py-1.5 rounded-md w-max border border-[rgba(255,255,255,0.05)]">
                  <GitBranch className="h-3.5 w-3.5 text-gray-500" />
                  <span className="font-mono">{pipeline.branch || 'main'}</span>
                </div>

                <div className="mb-6 flex-grow">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span className="font-medium">Execution Progress</span>
                    <span className="font-mono">{progress}%</span>
                  </div>
                  <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-2 border border-[rgba(255,255,255,0.02)]">
                    <div
                      className="h-2 rounded-full transition-all duration-1000 shadow-[0_0_8px_currentColor]"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: statusColor,
                        color: statusColor
                      }}
                    ></div>
                  </div>
                </div>

                {/* Optional Failure Box */}
                {(pipeline.status === 'failure' || pipeline.status === 'failed') && (
                  <div className="mb-5 p-3 bg-red-900/10 border border-red-500/20 rounded-lg text-sm text-red-400/90 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Pipeline execution halted prematurely due to a failed stage.</span>
                  </div>
                )}

                <div className="flex justify-between items-end pt-4 border-t border-[rgba(255,255,255,0.1)] mt-auto">
                  <div className="text-xs text-gray-500 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-[9px] shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                        {(pipeline.triggered_by || 'A')[0].toUpperCase()}
                      </div>
                      <span className="text-gray-300 font-medium">{pipeline.triggered_by || 'Auto/Webhook'}</span>
                    </div>
                    <span className="text-[11px] opacity-70">
                      {pipeline.created_at ? new Date(pipeline.created_at).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      }) : 'Just now'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 text-sm hover:text-blue-400 hover:bg-[rgba(37,99,235,0.1)] rounded-lg transition-colors border border-transparent hover:border-[rgba(37,99,235,0.2)]" title="Re-run">
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    {(pipeline.status === 'running' || pipeline.status === 'in_progress') && (
                      <button className="p-2 text-gray-400 text-sm hover:text-red-400 hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-colors border border-transparent hover:border-[rgba(239,68,68,0.2)]" title="Stop">
                        <Square className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PipelinesPage;
