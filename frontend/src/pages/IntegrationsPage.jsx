import React, { useState, useEffect } from 'react';
import { Github, Gitlab, GitBranch as Bitbucket, Cloud, Package as Docker, Server as Kubernetes, MessageSquare as Slack, CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react';

const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIntegrations([
        {
          id: 1,
          name: 'GitHub',
          description: 'Connect your GitHub repositories for source code management',
          icon: Github,
          status: 'connected',
          category: 'Source Control',
          lastSync: '2 minutes ago',
          configured: true,
          features: ['Repository sync', 'Webhook integration', 'Pull request tracking']
        },
        {
          id: 2,
          name: 'Jenkins',
          description: 'CI/CD pipeline automation and build management',
          icon: Settings,
          status: 'connected',
          category: 'CI/CD',
          lastSync: '5 minutes ago',
          configured: true,
          features: ['Build triggers', 'Pipeline monitoring', 'Test automation']
        },
        {
          id: 3,
          name: 'Terraform',
          description: 'Infrastructure as code and cloud resource management',
          icon: Cloud,
          status: 'connected',
          category: 'Infrastructure',
          lastSync: '1 hour ago',
          configured: true,
          features: ['Resource provisioning', 'State management', 'Cost optimization']
        },
        {
          id: 4,
          name: 'Kubernetes',
          description: 'Container orchestration and cluster management',
          icon: Kubernetes,
          status: 'connected',
          category: 'Containerization',
          lastSync: '10 minutes ago',
          configured: true,
          features: ['Pod monitoring', 'Service discovery', 'Auto-scaling']
        },
        {
          id: 5,
          name: 'Docker',
          description: 'Container registry and image management',
          icon: Docker,
          status: 'disconnected',
          category: 'Containerization',
          lastSync: 'Never',
          configured: false,
          features: ['Image registry', 'Build automation', 'Security scanning']
        },
        {
          id: 6,
          name: 'Slack',
          description: 'Team collaboration and notification alerts',
          icon: Slack,
          status: 'disconnected',
          category: 'Communication',
          lastSync: 'Never',
          configured: false,
          features: ['Alert notifications', 'Status updates', 'Team collaboration']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-2">Connect and configure your DevOps tools and services</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Settings className="h-4 w-4 mr-2" />
            Configure All
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Integration
          </button>
        </div>
      </div>

      {/* Integration Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Source Control', 'CI/CD', 'Infrastructure', 'Containerization', 'Communication'].map((category) => (
          <div key={category} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">{category}</h3>
            <p className="text-sm text-gray-600">
              {integrations.filter(i => i.category === category).length} integrations
            </p>
          </div>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <div key={integration.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <Icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-gray-500">{integration.category}</p>
                    </div>
                  </div>
                  {getStatusIcon(integration.status)}
                </div>

                <p className="text-gray-600 text-sm mb-4">{integration.description}</p>

                <div className="mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    Last sync: {integration.lastSync}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {integration.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  {integration.configured ? (
                    <>
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                        Configure
                      </button>
                      <button className="flex-1 px-3 py-2 bg-white border border-gray-300 text-sm rounded-lg hover:bg-gray-50">
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Status Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {integrations.filter(i => i.status === 'connected').length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Connected</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {integrations.filter(i => i.status === 'disconnected').length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Disconnected</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {Math.round((integrations.filter(i => i.status === 'connected').length / integrations.length) * 100)}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Configuration Complete</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Recommended Actions</h3>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-blue-800">
            <AlertCircle className="h-4 w-4 mr-2" />
            Connect Docker registry to enable container image management
          </div>
          <div className="flex items-center text-sm text-blue-800">
            <AlertCircle className="h-4 w-4 mr-2" />
            Configure Slack integration for real-time notifications
          </div>
          <div className="flex items-center text-sm text-blue-800">
            <CheckCircle className="h-4 w-4 mr-2" />
            All critical integrations are properly configured
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
