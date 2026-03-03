import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, pipelinesAPI } from '../api/client';
import {
    ArrowLeft,
    Activity,
    AlertTriangle,
    Clock,
    CheckCircle,
    ChevronRight,
    ExternalLink,
    Code,
    GitBranch,
    User,
    Calendar
} from 'lucide-react';

function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [projectData, setProjectData] = useState(null);
    const [pipelines, setPipelines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [projectRes, pipelinesRes] = await Promise.all([
                projectsAPI.getById(id),
                pipelinesAPI.getByProject(id)
            ]);
            
            setProjectData(projectRes);
            setPipelines(pipelinesRes);
        } catch (err) {
            console.error('Error fetching project data:', err);
            setError(err.message || 'Failed to load project details');
        } finally {
            setLoading(false);
        }
    };

    const handleDeploy = async () => {
        try {
            await projectsAPI.deploy(id);
            fetchProjectData(); // Refresh data
        } catch (err) {
            console.error('Deploy error:', err);
            setError('Failed to deploy project');
        }
    };

    const handleRunPipeline = async (pipelineId) => {
        try {
            await pipelinesAPI.run(pipelineId);
            fetchProjectData(); // Refresh data
        } catch (err) {
            console.error('Pipeline run error:', err);
            setError('Failed to run pipeline');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500">Loading project details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button
                        onClick={fetchProjectData}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!projectData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500">Project not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="mr-2" size={20} />
                        Back to Dashboard
                    </button>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{projectData.name}</h1>
                                <p className="text-gray-600 mb-4">{projectData.description}</p>
                                <div className="flex items-center space-x-6 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <User size={16} className="mr-1" />
                                        {projectData.owner || 'Unknown'}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar size={16} className="mr-1" />
                                        Created {projectData.created_at ? new Date(projectData.created_at).toLocaleDateString() : 'Unknown'}
                                    </div>
                                    <div className="flex items-center">
                                        <Activity size={16} className="mr-1" />
                                        {projectData.success_rate || 0}% Success Rate
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    projectData.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {projectData.status || 'Unknown'}
                                </span>
                                <button
                                    onClick={handleDeploy}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Deploy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pipelines Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Pipelines</h2>
                    <div className="space-y-4">
                        {pipelines.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                No pipelines configured for this project
                            </div>
                        ) : (
                            pipelines.map((pipeline) => (
                                <div key={pipeline.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            {pipeline.status === 'success' && <CheckCircle className="text-green-500" size={20} />}
                                            {pipeline.status === 'running' && <Activity className="text-blue-500 animate-pulse" size={20} />}
                                            {pipeline.status === 'failed' && <AlertTriangle className="text-red-500" size={20} />}
                                            {pipeline.status === 'pending' && <Clock className="text-yellow-500" size={20} />}
                                            <div>
                                                <h3 className="font-medium text-gray-900">{pipeline.name}</h3>
                                                <p className="text-sm text-gray-500">{pipeline.trigger || 'Manual trigger'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500">{pipeline.duration || 'N/A'}</div>
                                                <div className="text-xs text-gray-400">
                                                    {pipeline.last_run ? new Date(pipeline.last_run).toLocaleDateString() : 'Never run'}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRunPipeline(pipeline.id)}
                                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                                disabled={pipeline.status === 'running'}
                                            >
                                                {pipeline.status === 'running' ? 'Running...' : 'Run'}
                                            </button>
                                            <ChevronRight size={16} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Repository Link */}
                {projectData.repository && (
                    <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Repository</h3>
                        <a 
                            href={projectData.repository}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <GitBranch size={16} className="mr-2" />
                            {projectData.repository}
                            <ExternalLink size={14} className="ml-2" />
                        </a>
                    </div>
                )}

                {/* Environment Variables */}
                {projectData.environment_variables && (
                    <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment Variables</h3>
                        <div className="space-y-2">
                            {Object.entries(projectData.environment_variables).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-mono text-sm text-gray-700">{key}</span>
                                    <span className="text-sm text-gray-500">••••••••</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectDetails;
