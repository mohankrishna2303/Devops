import React, { useState, useEffect } from 'react';
import { failuresAPI } from '../api/client';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { AlertTriangle, CheckCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';

function FailuresPage() {
  const [failures, setFailures] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [failuresRes, analyticsRes] = await Promise.all([
        failuresAPI.getAll(),
        failuresAPI.getAnalytics()
      ]);
      
      setFailures(failuresRes);
      setAnalytics(analyticsRes);
    } catch (err) {
      setError(err.message || 'Failed to fetch failure data');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveFailure = async (failureId) => {
    try {
      await failuresAPI.resolve(failureId);
      fetchData(); // Refresh data
    } catch (err) {
      setError('Failed to resolve failure');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage message={error} />
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Pipeline Failures</h1>
          <button
            onClick={fetchData}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>

        {/* Analytics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <AlertTriangle className="text-red-500 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Total Failures</p>
                  <p className="text-2xl font-bold">{analytics.total_failures || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Resolved</p>
                  <p className="text-2xl font-bold">{analytics.resolved_failures || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Clock className="text-yellow-500 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Avg Resolution Time</p>
                  <p className="text-2xl font-bold">{analytics.avg_resolution_time || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <AlertTriangle className="text-orange-500 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Failure Rate</p>
                  <p className="text-2xl font-bold">{analytics.failure_rate || '0%'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Failures List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Failures</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {failures.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No failures recorded
              </div>
            ) : (
              failures.map((failure) => (
                <div key={failure.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="text-red-500 mr-2" size={16} />
                        <h3 className="font-medium text-gray-900">{failure.pipeline_name}</h3>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          failure.status === 'resolved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {failure.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{failure.error_message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Project: {failure.project_name}</span>
                        <span>{new Date(failure.created_at).toLocaleDateString()}</span>
                        <span>Duration: {failure.duration || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {failure.logs_url && (
                        <a
                          href={failure.logs_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      {failure.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolveFailure(failure.id)}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default FailuresPage;
