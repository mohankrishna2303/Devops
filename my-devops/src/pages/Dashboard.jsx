import React, { useEffect, useState } from 'react';
import { projectsAPI, metricsAPI } from '../api/client';
import DashboardLayout from '../components/DashboardLayout';
import ProjectCard from '../components/ProjectCard';
import DORAMetrics from '../components/DORAMetrics';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, metricsRes] = await Promise.all([
        projectsAPI.getAll(),
        metricsAPI.getAll(),
      ]);
      
      setProjects(projectsRes);
      setMetrics(metricsRes);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* DORA Metrics */}
        {metrics && <DORAMetrics data={metrics} />}

        {/* Projects Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Projects</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + New Project
            </button>
          </div>

          {error && <ErrorMessage message={error} />}

          {projects.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No projects yet. Create one to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onRefresh={fetchData} />
              ))}
            </div>
          )}
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
              <div className="text-center text-gray-500">
                Project creation form coming soon...
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;