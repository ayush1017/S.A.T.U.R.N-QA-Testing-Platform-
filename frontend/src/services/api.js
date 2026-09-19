const API_BASE = import.meta.env.VITE_API_URL;

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

async function request(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  register: (body) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  me: () => request('/auth/me'),

  generateTestCases: (body) =>
    request('/test-cases/generate', { method: 'POST', body: JSON.stringify(body) }),

  generateBugReport: (body) =>
    request('/bug-reports/generate', { method: 'POST', body: JSON.stringify(body) }),

  chat: (body) =>
    request('/chat', { method: 'POST', body: JSON.stringify(body) }),

  generateTestData: (body) =>
    request('/test-data/generate', { method: 'POST', body: JSON.stringify(body) }),

  submitFeedback: (body) =>
    request('/feedback', { method: 'POST', body: JSON.stringify(body) }),

  getFeedbackHistory: () => request('/feedback/history'),

  health: () => request('/health'),
};
