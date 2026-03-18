import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Lock, Eye, Search } from 'lucide-react';

const SecurityPage = () => {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVulnerabilities([
        {
          id: 1,
          title: 'SQL Injection Vulnerability',
          description: 'Potential SQL injection in user authentication endpoint',
          severity: 'critical',
          status: 'open',
          component: 'api-server',
          discovered: '2024-01-15T09:30:00Z',
          cvssScore: 9.8,
          affectedVersions: ['v1.8.0', 'v1.8.1'],
          fixAvailable: true
        },
        {
          id: 2,
          title: 'Outdated Dependency',
          description: 'Node.js version 16.20.0 has known security vulnerabilities',
          severity: 'high',
          status: 'in-progress',
          component: 'web-app',
          discovered: '2024-01-14T14:15:00Z',
          cvssScore: 7.5,
          affectedVersions: ['v2.0.3'],
          fixAvailable: true
        },
        {
          id: 3,
          title: 'Weak Password Policy',
          description: 'Password minimum length requirement is too low',
          severity: 'medium',
          status: 'open',
          component: 'auth-service',
          discovered: '2024-01-13T11:45:00Z',
          cvssScore: 5.3,
          affectedVersions: ['v1.2.0'],
          fixAvailable: true
        }
      ]);

      setScans([
        {
          id: 1,
          name: 'Container Security Scan',
          type: 'Container',
          status: 'completed',
          lastRun: '2 hours ago',
          nextRun: 'In 22 hours',
          vulnerabilitiesFound: 12,
          critical: 1,
          high: 2,
          medium: 4,
          low: 5
        },
        {
          id: 2,
          name: 'Dependency Check',
          type: 'SAST',
          status: 'completed',
          lastRun: '6 hours ago',
          nextRun: 'In 18 hours',
          vulnerabilitiesFound: 8,
          critical: 0,
          high: 1,
          medium: 3,
          low: 4
        },
        {
          id: 3,
          name: 'Infrastructure Scan',
          type: 'IAST',
          status: 'running',
          lastRun: '1 day ago',
          nextRun: 'In progress',
          vulnerabilitiesFound: 5,
          critical: 0,
          high: 0,
          medium: 2,
          low: 3
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
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
          <h1 className="text-3xl font-bold text-gray-900">Security</h1>
          <p className="text-gray-600 mt-2">Monitor vulnerabilities and security compliance</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Search className="h-4 w-4 mr-2" />
            Scan Now
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Shield className="h-4 w-4 mr-2" />
            Configure Security
          </button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-semibold text-gray-900">
                {vulnerabilities.filter(v => v.severity === 'critical').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High</p>
              <p className="text-2xl font-semibold text-gray-900">
                {vulnerabilities.filter(v => v.severity === 'high').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Lock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Medium</p>
              <p className="text-2xl font-semibold text-gray-900">
                {vulnerabilities.filter(v => v.severity === 'medium').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Security Score</p>
              <p className="text-2xl font-semibold text-gray-900">8.2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerabilities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Vulnerabilities</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {vulnerabilities.map((vuln) => (
            <div key={vuln.id} className={`p-4 border-l-4 ${getSeverityColor(vuln.severity)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{vuln.title}</h3>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(vuln.severity)}`}>
                      {vuln.severity}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">CVSS: {vuln.cvssScore}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{vuln.description}</p>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span>Component: {vuln.component}</span>
                    <span>Discovered: {new Date(vuln.discovered).toLocaleDateString()}</span>
                    <span>Status: {vuln.status}</span>
                    {vuln.fixAvailable && (
                      <span className="text-green-600 font-medium">Fix Available</span>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                    View Details
                  </button>
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    Apply Fix
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Scans */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Security Scans</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scan Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vulnerabilities
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scans.map((scan) => (
                <tr key={scan.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {scan.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {scan.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(scan.status)}
                      <span className="ml-2 text-sm text-gray-900">{scan.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {scan.lastRun}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {scan.critical > 0 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          {scan.critical}C
                        </span>
                      )}
                      {scan.high > 0 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          {scan.high}H
                        </span>
                      )}
                      {scan.medium > 0 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          {scan.medium}M
                        </span>
                      )}
                      {scan.low > 0 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {scan.low}L
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Report</button>
                    <button className="text-gray-600 hover:text-gray-900">Run Now</button>
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

export default SecurityPage;
