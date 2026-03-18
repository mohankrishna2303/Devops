// API client configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Helper function for API calls
export const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('devops_access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Optional: handle unauthorized access (e.g., clear tokens, redirect to login)
        localStorage.removeItem('devops_access_token');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    return await apiCall('/projects/');
  },
  getById: async (id) => {
    return await apiCall(`/projects/${id}/`);
  },
  create: async (project) => {
    return await apiCall('/projects/', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },
  update: async (id, project) => {
    return await apiCall(`/projects/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  },
  delete: async (id) => {
    return await apiCall(`/projects/${id}/`, {
      method: 'DELETE',
    });
  },
  getPipelines: async (projectId) => {
    return await apiCall(`/projects/${projectId}/pipelines/`);
  },
  deploy: async (projectId) => {
    return await apiCall(`/projects/${projectId}/deploy/`, {
      method: 'POST',
    });
  }
};

// Metrics API
export const metricsAPI = {
  getAll: async () => {
    return await apiCall('/analytics/dashboard/');
  },
  getByProject: async (projectId) => {
    return await apiCall(`/analytics/dashboard/?project=${projectId}`);
  },
  getDORA: async () => {
    return await apiCall('/analytics/dora/');
  },
  getDeploymentFrequency: async (timeRange = '30d') => {
    return await apiCall(`/analytics/dora/?range=${timeRange}`);
  },
  getLeadTime: async (timeRange = '30d') => {
    return await apiCall(`/analytics/dora/?range=${timeRange}`);
  },
  getFailureRate: async (timeRange = '30d') => {
    return await apiCall(`/analytics/dora/?range=${timeRange}`);
  },
  getRecoveryTime: async (timeRange = '30d') => {
    return await apiCall(`/analytics/dora/?range=${timeRange}`);
  }
};

// Pipelines API
export const pipelinesAPI = {
  getAll: async () => {
    return await apiCall('/pipelines/');
  },
  getById: async (id) => {
    return await apiCall(`/pipelines/${id}/`);
  },
  getByProject: async (projectId) => {
    return await apiCall(`/pipelines/?project=${projectId}`);
  },
  run: async (pipelineId) => {
    return await apiCall(`/pipelines/${pipelineId}/run/`, {
      method: 'POST',
    });
  },
  getLogs: async (pipelineId) => {
    return await apiCall(`/pipelines/${pipelineId}/logs/`);
  },
  cancel: async (pipelineId) => {
    return await apiCall(`/pipelines/${pipelineId}/cancel/`, {
      method: 'POST',
    });
  }
};

// Failures API
export const failuresAPI = {
  getAll: async () => {
    return await apiCall('/failures/');
  },
  getById: async (id) => {
    return await apiCall(`/failures/${id}/`);
  },
  getByProject: async (projectId) => {
    return await apiCall(`/failures/?project=${projectId}`);
  },
  resolve: async (id) => {
    return await apiCall(`/failures/${id}/resolve/`, {
      method: 'POST',
    });
  },
  getAnalytics: async () => {
    return await apiCall('/analytics/dashboard/');
  },
  importCSV: async (data) => {
    return await apiCall('/import/failures/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};

// Environments API
export const environmentsAPI = {
  getAll: async () => {
    return await apiCall('/environments/');
  },
  getById: async (id) => {
    return await apiCall(`/environments/${id}/`);
  },
  create: async (environment) => {
    return await apiCall('/environments/', {
      method: 'POST',
      body: JSON.stringify(environment),
    });
  },
  update: async (id, environment) => {
    return await apiCall(`/environments/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(environment),
    });
  },
  delete: async (id) => {
    return await apiCall(`/environments/${id}/`, {
      method: 'DELETE',
    });
  }
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    return await apiCall('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  register: async (userData) => {
    return await apiCall('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  logout: async () => {
    // Django REST simplejwt logout often just involves clearing the token on client side
    return { success: true };
  },
  getProfile: async () => {
    const token = localStorage.getItem('devops_access_token');
    return await apiCall('/auth/profile/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('devops_refresh_token');
    return await apiCall('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }
};

// Settings API
export const settingsAPI = {
  getUser: async () => {
    return await apiCall('/auth/profile/');
  },
  updateUser: async (settings) => {
    return await apiCall('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
  getSystem: async () => {
    return await apiCall('/analytics/dashboard/');
  },
  updateSystem: async (settings) => {
    return await apiCall('/analytics/dashboard/', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
};

// Kubernetes API
export const getK8sFleet = async () => apiCall('/k8s/fleet/');
export const getK8sNamespaces = async (clusterId) => apiCall(`/k8s/namespaces/?cluster=${clusterId}`);
export const getK8sWorkloads = async () => apiCall('/k8s/workloads/');
export const getK8sPods = async () => apiCall('/k8s/pods/');
export const getK8sPodLogs = async (podId) => apiCall(`/k8s/pods/${podId}/logs/`);
export const scaleK8sWorkload = async (workloadId, replicas) => apiCall('/k8s/workloads/scale/', {
  method: 'POST',
  body: JSON.stringify({ workload_id: workloadId, replicas })
});
export const deployK8sWorkload = async (data) => apiCall('/k8s/workloads/deploy/', {
  method: 'POST',
  body: JSON.stringify(data)
});
export const deleteK8sWorkload = async (workloadId) => apiCall(`/k8s/workloads/${workloadId}/delete/`, {
  method: 'DELETE'
});
export const applyK8sYaml = async (yaml, namespace) => apiCall('/k8s/apply/', {
  method: 'POST',
  body: JSON.stringify({ yaml, namespace })
});
export const getK8sEvents = async () => apiCall('/k8s/events/');

// Infrastructure & Cloud APIs
export const getDatabases = async () => apiCall('/databases/all/');
export const connectLocalDB = async (name, port) => apiCall('/databases/connect-local/', {
  method: 'POST',
  body: JSON.stringify({ name, port })
});
export const getTerraformHub = async () => apiCall('/terraform/hub/');
export const scanCloud = async () => apiCall('/cloud/scan/', { method: 'POST' });
export const getUntrackedResources = async () => apiCall('/cloud/untracked/');

// Integrations API
export const getIntegrations = async () => apiCall('/integrations/');

// Observability API
export const getTelemetry = async () => apiCall('/observability/telemetry/');

// Splunk API
export const splunkAPI = {
  getLogs: async () => apiCall('/splunk/logs/')
};

// Registry API
export const registryAPI = {
  getImages: async () => apiCall('/registry/')
};

// Alerts API
export const alertsAPI = {
  getAll: async () => apiCall('/alerts/')
};

// Security API
export const securityAPI = {
  getStats: async () => apiCall('/security/stats/'),
  runAudit: async () => apiCall('/devops/security-audit/', { method: 'POST' })
};

// AI Chat API
export const aiChatAPI = {
  chat: async (message) => apiCall('/ai/chat/', {
    method: 'POST',
    body: JSON.stringify({ message })
  })
};
