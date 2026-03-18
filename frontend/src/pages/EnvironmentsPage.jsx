import React, { useState, useEffect } from 'react';
import { Server, CheckCircle, XCircle, Clock, GitBranch, Play, Square } from 'lucide-react';

const EnvironmentsPage = () => {
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setEnvironments([
        {
          id: 1,
          name: 'Development',
          type: 'development',
          status: 'active',
          url: 'dev.example.com',
          lastDeployed: '2 hours ago',
          deployedBy: 'Alice',
          version: 'v2.1.0-dev',
          services: 8,
          health: 'healthy',
          resources: { cpu: '45%', memory: '60%', storage: '30%' }
        },
        {
          id: 2,
          name: 'Testing',
          type: 'testing',
          status: 'active',
          url: 'test.example.com',
          lastDeployed: '6 hours ago',
          deployedBy: 'Bob',
          version: 'v2.0.5',
          services: 6,
          health: 'healthy',
          resources: { cpu: '35%', memory: '45%', storage: '25%' }
        },
        {
          id: 3,
          name: 'Staging',
          type: 'staging',
          status: 'active',
          url: 'staging.example.com',
          lastDeployed: '1 day ago',
          deployedBy: 'Charlie',
          version: 'v2.0.4',
          services: 7,
          health: 'warning',
          resources: { cpu: '78%', memory: '82%', storage: '45%' }
        },
        {
          id: 4,
          name: 'Production',
          type: 'production',
          status: 'active',
          url: 'app.example.com',
          lastDeployed: '3 days ago',
          deployedBy: 'David',
          version: 'v2.0.3',
          services: 12,
          health: 'healthy',
          resources: { cpu: '65%', memory: '70%', storage: '55%' }
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-5 w-5" />;
      case 'warning': return <Clock className="h-5 w-5" />;
      case 'critical': return <XCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
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
          <h1 className="text-3xl font-bold text-gray-900">Environments</h1>
          <p className="text-gray-600 mt-2">Manage deployment environments and infrastructure</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <GitBranch className="h-4 w-4 mr-2" />
            Promote
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Play className="h-4 w-4 mr-2" />
            Deploy
          </button>
        </div>
      </div>

      {/* Environment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {environments.map((env) => (
          <div key={env.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{env.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{env.type}</p>
                </div>
                <div className={`flex items-center ${getHealthColor(env.health)}`}>
                  {getHealthIcon(env.health)}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(env.status)}`}>
                    {env.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium text-gray-900">{env.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Services</span>
                  <span className="font-medium text-gray-900">{env.services}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Resource Usage</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>CPU</span>
                      <span>{env.resources.cpu}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: env.resources.cpu,
                          backgroundColor: parseInt(env.resources.cpu) > 80 ? '#ef4444' : 
                                         parseInt(env.resources.cpu) > 60 ? '#f59e0b' : '#10b981'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Memory</span>
                      <span>{env.resources.memory}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: env.resources.memory,
                          backgroundColor: parseInt(env.resources.memory) > 80 ? '#ef4444' : 
                                         parseInt(env.resources.memory) > 60 ? '#f59e0b' : '#10b981'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                <div>URL: {env.url}</div>
                <div>Deployed: {env.lastDeployed}</div>
                <div>By: {env.deployedBy}</div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  Deploy
                </button>
                <button className="flex-1 px-3 py-2 bg-white border border-gray-300 text-sm rounded hover:bg-gray-50">
                  Manage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Environment Details */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Environment Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Environment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Deployed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {environments.map((env) => (
                <tr key={env.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Server className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{env.name}</div>
                        <div className="text-sm text-gray-500">{env.url}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {env.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(env.status)}`}>
                      {env.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {env.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {env.lastDeployed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${getHealthColor(env.health)}`}>
                      {getHealthIcon(env.health)}
                      <span className="ml-2 text-sm capitalize">{env.health}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Deploy</button>
                    <button className="text-gray-600 hover:text-gray-900">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentsPage;
