const API_BASE = 'http://localhost:8080/api';

export const getAuthToken = () => localStorage.getItem('admin_token');
export const setAuthToken = (token) => localStorage.setItem('admin_token', token);
export const removeAuthToken = () => localStorage.removeItem('admin_token');

export const getHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

// Projects
export const fetchProjects = async () => {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
};

export const createProject = async (project) => {
    const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(project)
    });
    if (!res.ok) throw new Error('Failed to create project');
    return await res.json();
};

export const updateProject = async (id, project) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(project)
    });
    if (!res.ok) throw new Error('Failed to update project');
    return await res.json();
};

export const deleteProject = async (id) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete project');
};

// Certificates
export const fetchCertificates = async () => {
    const res = await fetch(`${API_BASE}/certificates`);
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
};

export const createCertificate = async (cert) => {
    const res = await fetch(`${API_BASE}/certificates`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(cert)
    });
    if (!res.ok) throw new Error('Failed to create certificate');
    return await res.json();
};

export const updateCertificate = async (id, cert) => {
    const res = await fetch(`${API_BASE}/certificates/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(cert)
    });
    if (!res.ok) throw new Error('Failed to update certificate');
    return await res.json();
};

export const deleteCertificate = async (id) => {
    const res = await fetch(`${API_BASE}/certificates/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete certificate');
};

// Auth
export const loginAdmin = async (username, password) => {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');
    return data.token;
};

// Contact
export const submitContact = async (message) => {
    const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    });
    if (!res.ok) throw new Error('Failed to send message');
    return await res.json();
};
