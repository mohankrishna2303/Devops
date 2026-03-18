/**
 * Project CRUD and DevOps actions. Uses api (axios with JWT).
 */
import api from '../api';

export const listProjects = () => api.get('/projects/');
export const getProject = (id) => api.get(`/projects/${id}/`);
export const createProject = (data) => api.post('/projects/', data);
export const updateProject = (id, data) => api.patch(`/projects/${id}/`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}/`);

export const generateConfig = (projectId) => api.post('/devops/generate/', { project_id: projectId });
export const deployProject = (projectId) => api.post('/devops/deploy/', { project_id: projectId });

export const getDeployments = () => api.get('/deployments/');
