import React, { useState, useEffect } from 'react';
import { metricsAPI } from '../api/client';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DORAMetrics from '../components/DORAMetrics';
import { BarChart3, TrendingUp, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

function MetricsPage() {
  const [metrics, setMetrics] = useState(null);
  const [deploymentFrequency, setDeploymentFrequency] = useState([]);
  const [leadTime, setLeadTime] = useState([]);
  const [failureRate, setFailureRate] = useState([]);
  const [recoveryTime, setRecoveryTime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        doraRes,
        frequencyRes,
        leadTimeRes,
        failureRateRes,
        recoveryTimeRes
      ] = await Promise.all([
        metricsAPI.getDORA(),
        metricsAPI.getDeploymentFrequency(timeRange),
        metricsAPI.getLeadTime(timeRange),
        metricsAPI.getFailureRate(timeRange),
        metricsAPI.getRecoveryTime(timeRange)
      ]);
      
      setMetrics(doraRes);
      setDeploymentFrequency(frequencyRes.data || []);
      setLeadTime(leadTimeRes.data || []);
      setFailureRate(failureRateRes.data || []);
      setRecoveryTime(recoveryTimeRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch metrics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage message={error} />
        <button
          onClick={fetchMetrics}
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
          <h1 className="text-3xl font-bold text-gray-900">DORA Metrics</h1>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={fetchMetrics}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* DORA Metrics Overview */}
        {metrics && <DORAMetrics data={metrics} />}

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Deployment Frequency */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="text-blue-500 mr-2" size={24} />
              <h2 className="text-lg font-semibold text-gray-900">Deployment Frequency</h2>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 size={48} className="mx-auto mb-2" />
                <p>Deployment frequency chart</p>
                <p className="text-sm">Average: {metrics?.deploymentFrequency || 'N/A'} deployments/day</p>
              </div>
            </div>
          </div>

          {/* Lead Time for Changes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Clock className="text-green-500 mr-2" size={24} />
              <h2 className="text-lg font-semibold text-gray-900">Lead Time for Changes</h2>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Clock size={48} className="mx-auto mb-2" />
                <p>Lead time trend chart</p>
                <p className="text-sm">Average: {metrics?.leadTimeForChanges || 'N/A'} days</p>
              </div>
            </div>
          </div>

          {/* Change Failure Rate */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-2" size={24} />
              <h2 className="text-lg font-semibold text-gray-900">Change Failure Rate</h2>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <AlertTriangle size={48} className="mx-auto mb-2" />
                <p>Failure rate chart</p>
                <p className="text-sm">Current: {metrics?.changeFailureRate || 'N/A'}%</p>
              </div>
            </div>
          </div>

          {/* Mean Time to Recovery */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="text-purple-500 mr-2" size={24} />
              <h2 className="text-lg font-semibold text-gray-900">Mean Time to Recovery</h2>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp size={48} className="mx-auto mb-2" />
                <p>Recovery time trend</p>
                <p className="text-sm">Average: {metrics?.meanTimeToRecovery || 'N/A'} hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{metrics?.deploymentFrequency || 'N/A'}</div>
              <div className="text-sm text-gray-600">Deployments/Day</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{metrics?.leadTimeForChanges || 'N/A'}</div>
              <div className="text-sm text-gray-600">Days Lead Time</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{metrics?.changeFailureRate || 'N/A'}%</div>
              <div className="text-sm text-gray-600">Failure Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{metrics?.meanTimeToRecovery || 'N/A'}</div>
              <div className="text-sm text-gray-600">Hours Recovery</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MetricsPage;
