import React, { useState, useEffect } from 'react';
import { Cloud, Play, Square, RefreshCw, CheckCircle, XCircle, Clock, Server, Database } from 'lucide-react';

const TerraformPage = () => {
  const [resources, setResources] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setResources([
        {
          id: 1,
          name: 'web-server-01',
          type: 'aws_instance',
          status: 'running',
          provider: 'AWS',
          region: 'us-east-1',
          instanceType: 't3.medium',
          created: '2 days ago',
          lastModified: '5 hours ago'
        },
        {
          id: 2,
          name: 'database-cluster',
          type: 'aws_rds_cluster',
          status: 'available',
          provider: 'AWS',
          region: 'us-east-1',
          instanceType: 'db.t3.micro',
          created: '1 week ago',
          lastModified: '2 days ago'
        },
        {
          id: 3,
          name: 'load-balancer',
          type: 'aws_lb',
          status: 'active',
          provider: 'AWS',
          region: 'us-east-1',
          instanceType: 'application',
          created: '3 days ago',
          lastModified: '1 day ago'
        }
      ]);

      setModules([
        {
          id: 1,
          name: 'vpc-module',
          version: 'v1.2.0',
          source: 'terraform-aws-modules/vpc/aws',
          status: 'applied',
          resources: 12,
          lastApplied: '2 days ago'
        },
        {
          id: 2,
          name: 'ec2-module',
          version: 'v2.1.0',
          source: './modules/ec2',
          status: 'applied',
          resources: 8,
          lastApplied: '5 hours ago'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
      case 'available':
      case 'active':
      case 'applied':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getResourceIcon = (type) => {
    if (type.includes('instance') || type.includes('ec2')) return <Server className="h-5 w-5 text-blue-500" />;
    if (type.includes('database') || type.includes('rds')) return <Database className="h-5 w-5 text-green-500" />;
    return <Cloud className="h-5 w-5 text-gray-500" />;
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
          <h1 className="text-3xl font-bold text-gray-900">Infrastructure Management</h1>
          <p className="text-gray-600 mt-2">Manage cloud infrastructure with Terraform</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh State
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Play className="h-4 w-4 mr-2" />
            Apply Changes
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Server className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Resources</p>
              <p className="text-2xl font-semibold text-gray-900">{resources.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Applied</p>
              <p className="text-2xl font-semibold text-gray-900">{resources.filter(r => r.status !== 'failed').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Cloud className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Modules</p>
              <p className="text-2xl font-semibold text-gray-900">{modules.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Database className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Providers</p>
              <p className="text-2xl font-semibold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Managed Resources</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getResourceIcon(resource.type)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                        <div className="text-sm text-gray-500">{resource.instanceType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resource.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resource.provider} ({resource.region})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(resource.status)}
                      <span className="ml-2 text-sm text-gray-900">{resource.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resource.lastModified}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Destroy</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modules Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Terraform Modules</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {modules.map((module) => (
            <div key={module.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{module.name}</h3>
                  <p className="text-sm text-gray-500">{module.source}</p>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(module.status)}
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Version: {module.version}</span>
                <span>Resources: {module.resources}</span>
                <span>Applied: {module.lastApplied}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TerraformPage;
