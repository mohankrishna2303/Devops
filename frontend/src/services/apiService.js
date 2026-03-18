import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/analytics/dashboard/'),
  getMetrics: () => api.get('/metrics/dora'),
};

// Projects APIs
export const projectsAPI = {
  getAll: () => api.get('/projects/'),
  getById: (id) => api.get(`/projects/${id}/`),
  create: (data) => api.post('/projects/', data),
  update: (id, data) => api.put(`/projects/${id}/`, data),
  delete: (id) => api.delete(`/projects/${id}/`),
};

// Pipelines APIs
export const pipelinesAPI = {
  getAll: () => api.get('/pipelines/'),
  getById: (id) => api.get(`/pipelines/${id}/`),
  create: (data) => api.post('/pipelines/', data),
  run: (id) => api.post(`/pipelines/${id}/run/`),
  stop: (id) => api.post(`/pipelines/${id}/stop/`),
  getLogs: (id) => api.get(`/pipelines/${id}/logs/`),
};

// Terraform APIs
export const terraformAPI = {
  getData: () => api.get('/terraform/hub/'),
  apply: (data) => api.post('/terraform/apply/', data),
  destroy: (data) => api.post('/terraform/destroy/', data),
  scale: (data) => api.post('/terraform/scale/', data),
  plan: (data) => api.post('/terraform/plan/', data),
  init: () => api.post('/terraform/init/'),
};

// Kubernetes APIs
export const kubernetesAPI = {
  getFleet: () => api.get('/k8s/fleet/'),
  getNamespaces: () => api.get('/k8s/namespaces/'),
  getWorkloads: () => api.get('/k8s/workloads/'),
  getPods: () => api.get('/k8s/pods/'),
  getPodLogs: (podId) => api.get(`/k8s/pods/${podId}/logs/`),
  scaleWorkload: (data) => api.post('/k8s/workloads/scale/', data),
  deployWorkload: (data) => api.post('/k8s/workloads/deploy/', data),
  deleteWorkload: (workloadId) => api.delete(`/k8s/workloads/${workloadId}/delete/`),
  applyYAML: (data) => api.post('/k8s/apply/', data),
  getEvents: () => api.get('/k8s/events/'),
};

// Observability APIs
export const observabilityAPI = {
  getTelemetry: () => api.get('/observability/telemetry/'),
  getMetrics: () => api.get('/metrics/'),
  getAlerts: () => api.get('/alerts/'),
};

// Security APIs
export const securityAPI = {
  getStats: () => api.get('/security/stats/'),
  runAudit: () => api.post('/devops/security-audit/'),
  getVulnerabilities: () => api.get('/security/vulnerabilities/'),
};

// Integrations APIs
export const integrationsAPI = {
  getAll: () => api.get('/integrations/all/'),
  testConnection: (type, data) => api.post(`/integrations/test/${type}/`, data),
  configure: (type, data) => api.post(`/integrations/configure/${type}/`, data),
};

// Registry APIs
export const registryAPI = {
  getImages: () => api.get('/registry/'),
  getDetails: () => api.get('/registry/details/'),
  scanImage: (imageName) => api.post(`/registry/scan/${imageName}/`),
  pullImage: (imageName) => api.post(`/registry/pull/${imageName}/`),
};

// Environments APIs
export const environmentsAPI = {
  getAll: () => api.get('/environments/'),
  getById: (id) => api.get(`/environments/${id}/`),
  deploy: (id, data) => api.post(`/environments/${id}/deploy/`, data),
  promote: (fromId, toId) => api.post(`/environments/promote/`, { from: fromId, to: toId }),
};

// Analytics APIs
export const analyticsAPI = {
  getData: () => api.get('/analytics/data/'),
  getDORAMetrics: () => api.get('/analytics/dora/'),
  generateReport: (type) => api.post('/analytics/report/', { type }),
  exportData: (type) => api.get(`/analytics/export/${type}/`),
};

// AI Assistant APIs
export const aiAPI = {
  chat: (message) => api.post('/ai/chat/', { message }),
  getPatch: (failureId) => api.get(`/failures/${failureId}/ai-patch/`),
  analyzeLogs: (logs) => api.post('/ai/analyze-logs/', { logs }),
};

// User & Role Management APIs
export const usersAPI = {
  getRoles: () => api.get('/devops/roles/'),
  updateRole: (userId, role) => api.put(`/users/${userId}/role/`, { role }),
  getUsers: () => api.get('/users/'),
  createUser: (data) => api.post('/auth/register/', data),
};

// Settings APIs
export const settingsAPI = {
  update: (category, settings) => api.post('/settings/update/', { category, settings }),
  get: (category) => api.get(`/settings/${category}/`),
};

// Logs APIs
export const logsAPI = {
  getSplunkLogs: (params) => api.get('/splunk/logs/', { params }),
  searchLogs: (query) => api.post('/logs/search/', { query }),
  exportLogs: (params) => api.get('/logs/export/', { params }),
};

// Failures APIs
export const failuresAPI = {
  getAll: () => api.get('/failures/'),
  getById: (id) => api.get(`/failures/${id}/`),
  resolve: (id) => api.post(`/failures/${id}/resolve/`),
  create: (data) => api.post('/failures/', data),
  exportCSV: () => api.get('/export/failures/'),
  importCSV: (file) => api.post('/import/failures/', file),
};

// Authentication APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  refreshToken: () => api.post('/auth/token/refresh/'),
  getProfile: () => api.get('/auth/profile/'),
  logout: () => api.post('/auth/logout/'),
};

// Cloud APIs
export const cloudAPI = {
  testAWS: () => api.get('/cloud/aws/test/'),
  testAzure: () => api.get('/cloud/azure/test/'),
  testGCP: () => api.get('/cloud/gcp/test/'),
  getProviders: () => api.get('/cloud/providers/'),
  scanResources: () => api.get('/cloud/scan/'),
  getUntracked: () => api.get('/cloud/untracked/'),
  getCostRecommendations: () => api.get('/cost/recommendations/'),
  applyCostRecommendation: (id) => api.post(`/cost/recommendations/${id}/apply/`),
};

// Terminal APIs
export const terminalAPI = {
  execute: (command) => api.post('/terminal/execute/', { command }),
  readFile: (path) => api.get('/files/read/', { params: { path } }),
};

// GitHub APIs
export const githubAPI = {
  syncRuns: () => api.get('/sync/github/'),
  webhook: (data) => api.post('/webhooks/github/', data),
};

// Jenkins APIs
export const jenkinsAPI = {
  syncJob: () => api.get('/sync/jenkins/'),
  triggerBuild: (jobName) => api.post(`/jenkins/build/${jobName}/`),
};

// Database APIs
export const databaseAPI = {
  getAll: () => api.get('/databases/all/'),
  connectLocal: (config) => api.post('/databases/connect-local/', config),
};

export default api;
