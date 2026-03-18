import React, { useState, useEffect } from 'react';
import { GitBranch, Clock, Users, Plus, RefreshCw, Settings } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects([
        {
          id: 1,
          name: 'microservices-app',
          description: 'E-commerce microservices platform',
          language: 'React/Node.js',
          branches: 5,
          lastCommit: '2 hours ago',
          status: 'active',
          team: ['Alice', 'Bob', 'Charlie'],
          pipelineStatus: 'success'
        },
        {
          id: 2,
          name: 'data-pipeline',
          description: 'ETL pipeline for analytics',
          language: 'Python/Scala',
          branches: 3,
          lastCommit: '1 day ago',
          status: 'active',
          team: ['David', 'Eve'],
          pipelineStatus: 'running'
        },
        {
          id: 3,
          name: 'mobile-app',
          description: 'React Native mobile application',
          language: 'React Native',
          branches: 4,
          lastCommit: '3 days ago',
          status: 'inactive',
          team: ['Frank', 'Grace'],
          pipelineStatus: 'failed'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your repositories and track development progress</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync GitHub
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Import Repository
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <GitBranch className="h-4 w-4 mr-2" />
                {project.branches} branches • {project.language}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                Last commit: {project.lastCommit}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                {project.team.join(', ')}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.pipelineStatus)}`}>
                  {project.pipelineStatus}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
