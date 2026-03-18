import axios from 'axios';
import * as authService from './services/authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
    const token = authService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// On 401, clear auth so UI can redirect to login
api.interceptors.response.use(
    (r) => r,
    (err) => {
        if (err.response?.status === 401) authService.clearAuth();
        return Promise.reject(err);
    }
);

export const login = authService.login;
export const register = authService.register;

export const getApiBase = () => API_BASE_URL;

/** Check if backend is reachable. GET /api/ returns { ok: true }. */
export const checkApiHealth = async () => {
    try {
        const r = await api.get('');
        return r.data?.ok === true;
    } catch {
        return false;
    }
};

export const getDashboardStats = async () => {
    try {
        const response = await api.get('/analytics/dashboard/');
        return response.data;
    } catch (err) {
        console.error("Dashboard Stats Fetch Error:", err);
        return {
            total_pipelines: 0,
            failure_rate: 0,
            avg_fix_time: "0m",
            common_error: "None"
        };
    }
};

export const getDoraMetrics = () => api.get('/analytics/dora/');
export const getProjects = () => api.get('/projects/');
export const getPipelines = () => api.get('/pipelines/');
export const getFailures = () => api.get('/failures/');
export const getTerraformHub = () => api.get('/terraform/hub/');
export const applyTerraform = (planName) => api.post('/terraform/apply/', { plan_name: planName });
export const syncJenkins = (jobName) => api.post('/sync/jenkins/', { job_name: jobName });
// ── Kubernetes ─────────────────────────────────────────────────────────────
export const getK8sFleet = () => api.get('/k8s/fleet/');
export const getK8sNamespaces = (clusterId) =>
    api.get('/k8s/namespaces/', { params: clusterId ? { cluster_id: clusterId } : {} });
export const getK8sWorkloads = (clusterId, namespace) =>
    api.get('/k8s/workloads/', { params: { ...(clusterId && { cluster_id: clusterId }), ...(namespace && { namespace }) } });
export const getK8sPods = (clusterId, namespace, workloadId) =>
    api.get('/k8s/pods/', { params: { ...(clusterId && { cluster_id: clusterId }), ...(namespace && { namespace }), ...(workloadId && { workload_id: workloadId }) } });
export const getK8sPodLogs = (podId) => api.get(`/k8s/pods/${podId}/logs/`);
export const scaleK8sWorkload = (workloadId, replicas) =>
    api.post('/k8s/workloads/scale/', { workload_id: workloadId, replicas });
export const deployK8sWorkload = (payload) => api.post('/k8s/workloads/deploy/', payload);
export const deleteK8sWorkload = (workloadId) => api.delete(`/k8s/workloads/${workloadId}/delete/`);
export const applyK8sYaml = (yamlContent, namespace = 'default') =>
    api.post('/k8s/apply/', { yaml_content: yamlContent, namespace });
export const getK8sEvents = (clusterId) =>
    api.get('/k8s/events/', { params: clusterId ? { cluster_id: clusterId } : {} });

export const getTelemetry = () => api.get('/observability/telemetry/');
export const getIntegrations = () => api.get('/integrations/all/');
export const getDatabases = () => api.get('/databases/all/');
export const connectLocalDB = (name, port) => api.post('/databases/connect-local/', { name, port });
export const scanCloud = () => api.post('/cloud/scan/');
export const getUntrackedResources = () => api.get('/cloud/untracked/');
export const getCostRecommendations = () => api.get('/cost/recommendations/');
export const applyCostRecommendation = (id) => api.post(`/cost/recommendations/${id}/apply/`);
export const scaleTerraform = (plan_id, instance_count) => api.post('/terraform/scale/', { plan_id, instance_count });
export const destroyTerraform = (plan_id) => api.post('/terraform/destroy/', { plan_id });
export const getAIPatch = (failure_id) => api.get(`/failures/${failure_id}/ai-patch/`);
export const runStressTest = () => api.post('/devops/stress-test/');
export const runSecurityAudit = () => api.post('/devops/security-audit/');
export const generateConfig = (projectId) => api.post('/devops/generate/', { project_id: projectId });
export const deployProject = (projectId) => api.post('/devops/deploy/', { project_id: projectId });
export const getProject = (id) => api.get(`/projects/${id}/`);

export const resolveFailure = (id) => api.post(`/failures/${id}/resolve/`);
export const API_REPORT_URL = `${API_BASE_URL}/analytics/report/`;

export const syncGithub = async (repoName) => {
    return await api.post('/sync/github/', { repo_name: repoName });
};

export const importCSV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/import/failures/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export default api;
