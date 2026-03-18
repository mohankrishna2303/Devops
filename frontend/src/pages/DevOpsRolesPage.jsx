import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Settings, Shield, Edit, Trash2 } from 'lucide-react';

const DevOpsRolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRoles([
        {
          id: 1,
          name: 'Admin',
          description: 'Full system access and configuration',
          permissions: ['read', 'write', 'delete', 'manage_users', 'manage_integrations', 'deploy'],
          userCount: 2,
          color: 'bg-red-100 text-red-800'
        },
        {
          id: 2,
          name: 'DevOps Engineer',
          description: 'Manage infrastructure and deployments',
          permissions: ['read', 'write', 'deploy', 'manage_infrastructure'],
          userCount: 5,
          color: 'bg-blue-100 text-blue-800'
        },
        {
          id: 3,
          name: 'Developer',
          description: 'Deploy and monitor applications',
          permissions: ['read', 'write', 'deploy'],
          userCount: 12,
          color: 'bg-green-100 text-green-800'
        },
        {
          id: 4,
          name: 'Viewer',
          description: 'Read-only access to dashboards',
          permissions: ['read'],
          userCount: 8,
          color: 'bg-gray-100 text-gray-800'
        }
      ]);

      setUsers([
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice@company.com',
          role: 'Admin',
          status: 'active',
          lastLogin: '2 hours ago',
          avatar: 'AJ'
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob@company.com',
          role: 'DevOps Engineer',
          status: 'active',
          lastLogin: '1 day ago',
          avatar: 'BS'
        },
        {
          id: 3,
          name: 'Charlie Brown',
          email: 'charlie@company.com',
          role: 'Developer',
          status: 'active',
          lastLogin: '3 hours ago',
          avatar: 'CB'
        }
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
          <h1 className="text-3xl font-bold text-gray-900">DevOps Roles</h1>
          <p className="text-gray-600 mt-2">Manage user roles and permissions</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Settings className="h-4 w-4 mr-2" />
            Configure Permissions
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="h-8 w-8 text-gray-400" />
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${role.color}`}>
                  {role.userCount} users
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{role.description}</p>
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 mb-2">Permissions:</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  Edit
                </button>
                <button className="px-3 py-2 bg-white border border-gray-300 text-sm rounded hover:bg-gray-50">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">{users.length} total users</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-medium">{user.avatar}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'DevOps Engineer' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'Developer' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
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

export default DevOpsRolesPage;
