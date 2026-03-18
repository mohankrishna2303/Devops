import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Clock, CheckCircle, XCircle } from 'lucide-react';

const AnalyticsPage = () => {
  const [metrics, setMetrics] = useState([]);
  const [deploymentData, setDeploymentData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMetrics([
        {
          title: 'Deployment Frequency',
          value: '12.5',
          unit: 'per week',
          change: 15.2,
          trend: 'up',
          icon: Activity
        },
        {
          title: 'Lead Time for Changes',
          value: '2.4',
          unit: 'hours',
          change: -8.5,
          trend: 'down',
          icon: Clock
        },
        {
          title: 'Change Failure Rate',
          value: '3.2',
          unit: '%',
          change: -2.1,
          trend: 'down',
          icon: XCircle
        },
        {
          title: 'Mean Time to Recovery',
          value: '45',
          unit: 'minutes',
          change: -12.3,
          trend: 'down',
          icon: CheckCircle
        }
      ]);

      setDeploymentData([
        { date: '2024-01-08', successful: 8, failed: 1, total: 9 },
        { date: '2024-01-09', successful: 12, failed: 2, total: 14 },
        { date: '2024-01-10', successful: 10, failed: 0, total: 10 },
        { date: '2024-01-11', successful: 15, failed: 3, total: 18 },
        { date: '2024-01-12', successful: 9, failed: 1, total: 10 },
        { date: '2024-01-13', successful: 14, failed: 2, total: 16 },
        { date: '2024-01-14', successful: 11, failed: 1, total: 12 }
      ]);

      setPerformanceData([
        { service: 'web-app', uptime: 99.9, responseTime: 245, errorRate: 0.2 },
        { service: 'api-server', uptime: 99.8, responseTime: 180, errorRate: 0.3 },
        { service: 'database', uptime: 99.5, responseTime: 45, errorRate: 0.1 },
        { service: 'cache-service', uptime: 99.9, responseTime: 25, errorRate: 0.05 },
        { service: 'auth-service', uptime: 99.7, responseTime: 120, errorRate: 0.4 }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">DORA metrics and DevOps performance analytics</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Activity className="h-4 w-4 mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* DORA Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">DORA Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
                </div>
                <div className={`flex items-center justify-center mt-2 ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deployment Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deployment Trends</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Deployment trends chart</p>
              <p className="text-sm">Success vs Failure rate over time</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {deploymentData.reduce((sum, d) => sum + d.successful, 0)}
              </p>
              <p className="text-sm text-gray-600">Successful</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {deploymentData.reduce((sum, d) => sum + d.failed, 0)}
              </p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {deploymentData.reduce((sum, d) => sum + d.total, 0)}
              </p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Performance</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <PieChart className="h-12 w-12 mx-auto mb-2" />
              <p>Service performance distribution</p>
              <p className="text-sm">Uptime and response time analysis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Service Performance Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uptime
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceData.map((service, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {service.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span>{service.uptime}%</span>
                      {service.uptime >= 99.5 ? (
                        <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 ml-2" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.responseTime}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.errorRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      service.uptime >= 99.5 && service.errorRate < 0.5
                        ? 'bg-green-100 text-green-800'
                        : service.uptime >= 99.0 && service.errorRate < 1.0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.uptime >= 99.5 && service.errorRate < 0.5
                        ? 'Excellent'
                        : service.uptime >= 99.0 && service.errorRate < 1.0
                        ? 'Good'
                        : 'Needs Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">🎯 High Performance</h3>
            <p className="text-sm text-green-800">
              Your deployment frequency has increased by 15.2% this week, showing improved delivery velocity.
            </p>
          </div>
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">⚡ Fast Recovery</h3>
            <p className="text-sm text-blue-800">
              Mean time to recovery decreased by 12.3%, indicating better incident response capabilities.
            </p>
          </div>
          <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
            <h3 className="font-medium text-yellow-900 mb-2">📈 Improvement Opportunity</h3>
            <p className="text-sm text-yellow-800">
              Focus on reducing change failure rate further to achieve elite performance status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
