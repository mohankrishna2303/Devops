import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './DashboardPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

// Import all DevOps pages
import ProjectsPage from './pages/ProjectsPage';
import PipelinesPage from './pages/PipelinesPage';
import FailuresPage from './pages/FailuresPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TerraformPage from './pages/TerraformPage';
import DevOpsProcessPage from './pages/DevOpsProcessPage';
import KubernetesPage from './pages/KubernetesPage';
import ObservabilityPage from './pages/ObservabilityPage';
import EnvironmentsPage from './pages/EnvironmentsPage';
import RegistryPage from './pages/RegistryPage';
import AlertsPage from './pages/AlertsPage';
import SplunkLogsPage from './pages/SplunkLogsPage';
// import AIAssistantPage from './pages/AIAssistantPage';
import DevOpsRolesPage from './pages/DevOpsRolesPage';
import SecurityPage from './pages/SecurityPage';
import IntegrationsPage from './pages/IntegrationsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="pipelines" element={<PipelinesPage />} />
          <Route path="failures" element={<FailuresPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="terraform" element={<TerraformPage />} />
          <Route path="devops-process" element={<DevOpsProcessPage />} />
          <Route path="kubernetes" element={<KubernetesPage />} />
          <Route path="observability" element={<ObservabilityPage />} />
          <Route path="environments" element={<EnvironmentsPage />} />
          <Route path="registry" element={<RegistryPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="splunk-logs" element={<SplunkLogsPage />} />
          <Route path="devops-roles" element={<DevOpsRolesPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;