import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import ProjectDetail from '../components/ProjectDetail';

function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('project-detail');

    // Handle internal navigation from dashboard-like layout
    const handleTabChange = (tab) => {
        if (tab === 'project-detail') return;
        navigate('/dashboard', { state: { activeTab: tab } });
    };

    return (
        <DashboardLayout activeTab={activeTab} setActiveTab={handleTabChange}>
            <ProjectDetail
                projectId={id}
                onBack={() => navigate('/dashboard')}
                backLabel="Back to Dashboard"
                onPipelineClick={(pipeId) => navigate('/dashboard', { state: { activeTab: 'pipeline-detail', pipelineId: pipeId } })}
            />
        </DashboardLayout>
    );
}

export default ProjectDetails;
