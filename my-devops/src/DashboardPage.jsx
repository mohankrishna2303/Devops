import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import Overview from './components/Overview';
import Projects from './components/Projects';
import Pipelines from './components/Pipelines';
import Failures from './components/Failures';
import Analytics from './components/Analytics';
import Alerts from './components/Alerts';
import Settings from './components/Settings';
import Billing from './components/Billing';
import Environments from './components/Environments';
import Toolbox from './components/Toolbox';
import Registry from './components/Registry';
import Observability from './components/Observability';
import ProjectDetail from './components/ProjectDetail';
import Ecosystem from './components/Ecosystem';
import Kubernetes from './components/Kubernetes';
import ChatGPTAssistant from './components/ChatGPTAssistant';
import AutoIntegration from './components/AutoIntegration';
import DevOpsRoles from './components/DevOpsRoles';
import TerraformHub from './components/TerraformHub';
import DevOpsProcess from './components/DevOpsProcess';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedPipelineId, setSelectedPipelineId] = useState(null);

    const handleProjectClick = (id) => {
        setSelectedProjectId(id);
        setActiveTab('project-detail');
    };

    const handlePipelineClick = (id) => {
        setSelectedPipelineId(id);
        setActiveTab('pipeline-detail');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Overview onProjectClick={handleProjectClick} onTabChange={setActiveTab} />;
            case 'projects':
                return <Projects onProjectClick={handleProjectClick} />;
            case 'project-detail':
                return <ProjectDetail projectId={selectedProjectId} onBack={() => setActiveTab('projects')} onPipelineClick={handlePipelineClick} />;
            case 'pipelines':
                return <Pipelines onPipelineClick={handlePipelineClick} />;
            case 'pipeline-detail':
                return <Pipelines selectedId={selectedPipelineId} onBack={() => setActiveTab('pipelines')} />;
            case 'failures':
                return <Failures />;
            case 'analytics':
                return <Analytics />;
            case 'terraform':
                return <TerraformHub onTabChange={setActiveTab} />;
            case 'devops-process':
                return <DevOpsProcess onTabChange={setActiveTab} />;
            case 'ecosystem':
                return <Ecosystem />;
            case 'kubernetes':
                return <Kubernetes />;
            case 'observability':
                return <Observability />;
            case 'environments': return <Environments />;
            case 'toolbox': return <Toolbox />;
            case 'registry': return <Registry />;
            case 'alerts': return <Alerts />;
            case 'ai-assistant': return <ChatGPTAssistant />;
            case 'roles': return <DevOpsRoles />;
            case 'auto-integration': return <AutoIntegration />;
            case 'settings':
                return <Settings />;
            case 'billing':
                return <Billing />;
            default:
                return <Overview />;
        }
    };

    return (
        <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {renderContent()}
        </DashboardLayout>
    );
};

export default DashboardPage;
