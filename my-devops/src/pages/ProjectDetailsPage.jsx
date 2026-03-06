import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI } from '../api/client';
import FileViewer from '../components/FileViewer';
import DeploymentStatus from '../components/DeploymentStatus';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await projectsAPI.detail(id);
      setProject(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const res = await projectsAPI.generateDevOps(id);
      setProject({...project, devops_config: res.data});
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate DevOps config');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeploy = async () => {
    try {
      setDeploying(true);
      const res = await projectsAPI.deploy(id);
      setProject({...project, deployments: [...(project.deployments || []), res.data]});
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to deploy');
    } finally {
      setDeploying(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} />}

      {/* Project Header */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold">{project?.name}</h1>
        <p className="text-gray-600">{project?.description}</p>
        
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {generating ? 'Generating...' : 'Generate DevOps Config'}
          </button>
          <button
            onClick={handleDeploy}
            disabled={deploying || !project?.devops_config}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {deploying ? 'Deploying...' : 'Deploy'}
          </button>
        </div>
      </div>

      {/* DevOps Config Viewer */}
      {project?.devops_config && (
        <FileViewer config={project.devops_config} />
      )}

      {/* Deployments */}
      {project?.deployments && project.deployments.length > 0 && (
        <DeploymentStatus deployments={project.deployments} />
      )}
    </div>
  );
}

export default ProjectDetails;