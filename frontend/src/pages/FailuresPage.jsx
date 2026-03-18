import React, { useState, useEffect } from 'react';
import { AlertTriangle, XCircle, Clock, User, ExternalLink, Search, Filter } from 'lucide-react';

const FailuresPage = () => {
  const [failures, setFailures] = useState([]);
  [selectedFailure, setSelectedFailure] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFailures([
        {
          id: 1,
          title: 'Pipeline Build Failed',
          description: 'Unit tests failed in web-app service',
          severity: 'high',
          status: 'open',
          project: 'microservices-app',
          service: 'web-app',
          timestamp: '2024-01-15T10:30:00Z',
          assignee: 'Alice',
          tags: ['pipeline', 'test-failure', 'web-app'],
          logs: [
            { timestamp: '10:30:15', level: 'ERROR', message: 'Test suite failed: 12 tests failing' },
            { timestamp: '10:30:12', level: 'ERROR', message: 'AssertionError: Expected true but got false' },
            { timestamp: '10:30:10', level: 'WARN', message: 'Test timeout after 30 seconds' }
          ]
        },
        {
          id: 2,
          title: 'Database Connection Timeout',
          description: 'Application unable to connect to primary database',
          severity: 'critical',
          status: 'investigating',
          project: 'data-pipeline',
          service: 'api-server',
          timestamp: '2024-01-15T09:45:00Z',
          assignee: 'David',
          tags: ['database', 'connection', 'timeout'],
          logs: [
            { timestamp: '09:45:30', level: 'ERROR', message: 'Connection timeout to db-primary' },
            { timestamp: '09:45:25', level: 'WARN', message: 'Retrying database connection...' },
            { timestamp: '09:45:20', level: 'ERROR', message: 'Unable to establish database connection' }
          ]
        },
        {
          id: 3,
          title: 'Memory Leak Detected',
          description: 'Memory usage continuously increasing in cache service',
          severity: 'medium',
          status: 'resolved',
          project: 'microservices-app',
          service: 'cache-service',
          timestamp: '2024-01-15T08:15:00Z',
          assignee: 'Bob',
          tags: ['memory', 'performance', 'cache'],
          logs: [
            { timestamp: '08:15:45', level: 'WARN', message: 'Memory usage at 85%' },
            { timestamp: '08:15:30', level: 'WARN', message: 'Memory usage at 80%' },
            { timestamp: '08:15:15', level: 'INFO', message: 'Memory leak detected in cache module' }
          ]
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Failure Analysis</h1>
          <p className="text-gray-600 mt-2">Track and analyze system failures and incidents</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Create Incident
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Failures</p>
              <p className="text-2xl font-semibold text-gray-900">{failures.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open</p>
              <p className="text-2xl font-semibold text-gray-900">
                {failures.filter(f => f.status === 'open').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Investigating</p>
              <p className="text-2xl font-semibold text-gray-900">
                {failures.filter(f => f.status === 'investigating').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {failures.filter(f => f.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Failures List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Failures</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {failures.map((failure) => (
              <div
                key={failure.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedFailure(failure)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">{failure.title}</h3>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(failure.severity)}`}>
                        {failure.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{failure.description}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(failure.status)}`}>
                    {failure.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>{failure.project}</span>
                    <span>{failure.service}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-3 w-3" />
                    <span>{failure.assignee}</span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {failure.tags.map((tag, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Failure Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Failure Details</h2>
          </div>
          {selectedFailure ? (
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedFailure.title}</h3>
                <p className="text-gray-600">{selectedFailure.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Severity</label>
                  <p className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getSeverityColor(selectedFailure.severity)}`}>
                    {selectedFailure.severity}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(selectedFailure.status)}`}>
                    {selectedFailure.status}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Project</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedFailure.project}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Service</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedFailure.service}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Assignee</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedFailure.assignee}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Timestamp</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedFailure.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500">Tags</label>
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedFailure.tags.map((tag, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Recent Logs</label>
                <div className="mt-2 bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm space-y-1 max-h-48 overflow-y-auto">
                  {selectedFailure.logs.map((log, index) => (
                    <div key={index} className="flex">
                      <span className="text-gray-400 mr-3">{log.timestamp}</span>
                      <span className={`mr-3 ${
                        log.level === 'ERROR' ? 'text-red-400' :
                        log.level === 'WARN' ? 'text-yellow-400' :
                        log.level === 'INFO' ? 'text-blue-400' :
                        'text-gray-400'
                      }`}>
                        {log.level}
                      </span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Logs
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Mark as Resolved
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
              <p>Select a failure to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FailuresPage;
