import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Zap, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const ObservabilityPage = () => {
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMetrics([
        {
          id: 1,
          name: 'CPU Usage',
          value: 68.5,
          unit: '%',
          status: 'warning',
          trend: 'up',
          change: 5.2,
          icon: Cpu
        },
        {
          id: 2,
          name: 'Memory Usage',
          value: 45.2,
          unit: '%',
          status: 'normal',
          trend: 'down',
          change: -2.1,
          icon: HardDrive
        },
        {
          id: 3,
          name: 'Request Rate',
          value: 1250,
          unit: 'req/s',
          status: 'normal',
          trend: 'up',
          change: 12.5,
          icon: Activity
        },
        {
          id: 4,
          name: 'Error Rate',
          value: 0.8,
          unit: '%',
          status: 'critical',
          trend: 'up',
          change: 0.3,
          icon: AlertTriangle
        },
        {
          id: 5,
          name: 'Response Time',
          value: 245,
          unit: 'ms',
          status: 'warning',
          trend: 'up',
          change: 15,
          icon: Zap
        }
      ]);

      setAlerts([
        {
          id: 1,
          severity: 'critical',
          title: 'High Error Rate Detected',
          description: 'Error rate exceeded 0.5% threshold for web-app service',
          time: '5 minutes ago',
          service: 'web-app'
        },
        {
          id: 2,
          severity: 'warning',
          title: 'CPU Usage High',
          description: 'CPU usage on k8s-worker-1 exceeded 70%',
          time: '12 minutes ago',
          service: 'k8s-worker-1'
        },
        {
          id: 3,
          severity: 'info',
          title: 'Deployment Completed',
          description: 'New version v2.1.0 deployed successfully',
          time: '1 hour ago',
          service: 'api-server'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Observability</h1>
          <p className="text-gray-600 mt-2">Monitor system performance and health metrics</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Activity className="h-4 w-4 mr-2" />
            Refresh Metrics
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Activity className="h-4 w-4 mr-2" />
            View Dashboard
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex items-center">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  )}
                  <span className={`ml-1 text-sm ${
                    metric.trend === 'up' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">{metric.unit}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">{metric.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-2" />
              <p>Performance chart would be displayed here</p>
              <p className="text-sm">Integration with Grafana/Chart.js</p>
            </div>
          </div>
        </div>

        {/* Resource Usage Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Cpu className="h-12 w-12 mx-auto mb-2" />
              <p>Resource usage chart would be displayed here</p>
              <p className="text-sm">Real-time monitoring data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Alerts</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 border-l-4 ${getSeverityColor(alert.severity)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{alert.description}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <span className="mr-4">Service: {alert.service}</span>
                    <span>{alert.time}</span>
                  </div>
                </div>
                <div className="ml-4 flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Acknowledge</button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm">Dismiss</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Health */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Service Health</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {[
            { name: 'web-app', status: 'healthy', uptime: '99.9%', responseTime: '245ms' },
            { name: 'api-server', status: 'healthy', uptime: '99.8%', responseTime: '180ms' },
            { name: 'database', status: 'warning', uptime: '98.5%', responseTime: '450ms' },
            { name: 'cache-service', status: 'healthy', uptime: '99.9%', responseTime: '25ms' },
            { name: 'auth-service', status: 'healthy', uptime: '99.7%', responseTime: '120ms' },
            { name: 'notification', status: 'critical', uptime: '95.2%', responseTime: '1200ms' }
          ].map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{service.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  service.status === 'healthy' ? 'bg-green-100 text-green-800' :
                  service.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {service.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Uptime: {service.uptime}</div>
                <div>Response: {service.responseTime}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ObservabilityPage;
