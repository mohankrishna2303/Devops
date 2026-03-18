import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/projects', icon: '�', label: 'Projects' },
    { path: '/pipelines', icon: '⚡', label: 'Pipelines' },
    { path: '/failures', icon: '🚨', label: 'Failures' },
    { path: '/analytics', icon: '📈', label: 'Analytics' },
    { path: '/terraform', icon: '🏗️', label: 'Terraform' },
    { path: '/devops-process', icon: '⚙️', label: 'DevOps Process' },
    { path: '/kubernetes', icon: '☸️', label: 'Kubernetes' },
    { path: '/observability', icon: '👁️', label: 'Observability' },
    { path: '/environments', icon: '🌍', label: 'Environments' },
    { path: '/registry', icon: '📦', label: 'Registry' },
    { path: '/alerts', icon: '🔔', label: 'Alerts' },
    { path: '/splunk-logs', icon: '📋', label: 'Splunk Logs' },
    { path: '/devops-roles', icon: '👥', label: 'DevOps Roles' },
    { path: '/security', icon: '🔒', label: 'Security' },
    { path: '/integrations', icon: '🔗', label: 'Integrations' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`bg-gray-900 text-white h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && <h1 className="text-xl font-bold">DevOps Platform</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2">
          {menuItems.map((item) => (
            <li key={item.path} className="mb-1">
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        {!collapsed && (
          <div className="text-sm text-gray-400">
            <p>Version 1.0.0</p>
            <p>© 2024 DevOps Platform</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
