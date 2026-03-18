import React, { useState, useEffect } from 'react';
import { Box, RefreshCw, Play, Square, Activity, Server, Cpu, HardDrive, Zap } from 'lucide-react';

const KubernetesPage = () => {
  const [pods, setPods] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [services, setServices] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPods([
        {
          id: 1,
          name: 'web-app-7d5f8c9b9-abc123',
          namespace: 'default',
          status: 'Running',
          ready: '2/2',
          restarts: 0,
          age: '2d',
          cpu: '150m',
          memory: '256Mi'
        },
        {
          id: 2,
          name: 'api-server-6a4b3c2d8-def456',
          namespace: 'default',
          status: 'Running',
          ready: '1/1',
          restarts: 1,
          age: '1d',
          cpu: '100m',
          memory: '128Mi'
        },
        {
          id: 3,
          name: 'db-migration-9f8e7d6c5-ghi789',
          namespace: 'default',
          status: 'Completed',
          ready: '0/1',
          restarts: 0,
          age: '3h',
          cpu: '50m',
          memory: '64Mi'
        }
      ]);

      setDeployments([
        {
          id: 1,
          name: 'web-app',
          namespace: 'default',
          ready: '2/2',
          upToDate: 2,
          available: 2,
          age: '2d',
          strategy: 'RollingUpdate'
        },
        {
          id: 2,
          name: 'api-server',
          namespace: 'default',
          ready: '1/1',
          upToDate: 1,
          available: 1,
          age: '1d',
          strategy: 'RollingUpdate'
        }
      ]);

      setServices([
        {
          id: 1,
          name: 'web-app-service',
          namespace: 'default',
          type: 'LoadBalancer',
          clusterIP: '10.100.200.100',
          externalIP: '34.123.45.67',
          ports: '80:31234/TCP',
          age: '2d'
        },
        {
          id: 2,
          name: 'api-service',
          namespace: 'default',
          type: 'ClusterIP',
          clusterIP: '10.100.200.101',
          externalIP: '<none>',
          ports: '8080:30080/TCP',
          age: '1d'
        }
      ]);

      setNodes([
        {
          id: 1,
          name: 'k8s-worker-1',
          status: 'Ready',
          roles: 'worker',
          version: 'v1.28.2',
          internalIP: '10.0.1.10',
          externalIP: '34.123.45.100',
          cpu: '2.4/4 cores',
          memory: '8.2Gi/16Gi',
          pods: '12/110'
        },
        {
          id: 2,
          name: 'k8s-worker-2',
          status: 'Ready',
          roles: 'worker',
          version: 'v1.28.2',
          internalIP: '10.0.1.11',
          externalIP: '34.123.45.101',
          cpu: '1.8/4 cores',
          memory: '6.5Gi/16Gi',
          pods: '8/110'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'running':
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Kubernetes Cluster</h1>
          <p className="text-gray-600 mt-2">Manage containerized applications and cluster resources</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Play className="h-4 w-4 mr-2" />
            Deploy
          </button>
        </div>
      </div>

      {/* Cluster Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Server className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nodes</p>
              <p className="text-2xl font-semibold text-gray-900">{nodes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Box className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pods</p>
              <p className="text-2xl font-semibold text-gray-900">{pods.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Services</p>
              <p className="text-2xl font-semibold text-gray-900">{services.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Deployments</p>
              <p className="text-2xl font-semibold text-gray-900">{deployments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pods Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pods</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Namespace
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ready
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restarts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPU/Memory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pods.map((pod) => (
                <tr key={pod.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pod.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pod.namespace}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pod.status)}`}>
                      {pod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pod.ready}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pod.restarts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Cpu className="h-3 w-3 mr-1" />
                        {pod.cpu}
                      </div>
                      <div className="flex items-center">
                        <HardDrive className="h-3 w-3 mr-1" />
                        {pod.memory}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pod.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Logs</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deployments and Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deployments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Deployments</h2>
          </div>
          <div className="p-6 space-y-4">
            {deployments.map((deployment) => (
              <div key={deployment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{deployment.name}</h3>
                    <p className="text-sm text-gray-500">{deployment.namespace}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor('Ready')}`}>
                    Ready
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>Ready: {deployment.ready}</div>
                  <div>Up-to-date: {deployment.upToDate}</div>
                  <div>Available: {deployment.available}</div>
                  <div>Strategy: {deployment.strategy}</div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Age: {deployment.age}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Services</h2>
          </div>
          <div className="p-6 space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.namespace}</p>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {service.type}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Cluster IP: {service.clusterIP}</div>
                  {service.externalIP !== '<none>' && (
                    <div>External IP: {service.externalIP}</div>
                  )}
                  <div>Ports: {service.ports}</div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Age: {service.age}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KubernetesPage;
