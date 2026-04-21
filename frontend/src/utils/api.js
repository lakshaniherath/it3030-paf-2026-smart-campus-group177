const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch (error) {
    return {};
  }
};

export const getAuthHeaders = (extraHeaders = {}) => {
  const user = getStoredUser();
  const token = localStorage.getItem('authToken') || '';

  const headers = {
    Authorization: `Bearer ${token}`,
    ...extraHeaders,
  };

  if (user.email) {
    headers['X-User-Email'] = user.email;
  }

  return headers;
};

export const apiFetch = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(options.headers || {}),
    },
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload;
};

export default API_BASE_URL;