const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

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

  const headers = { ...extraHeaders };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (user.email) {
    headers['X-User-Email'] = user.email;
  }

  return headers;
};

export const apiFetch = async (path, options = {}) => {
  const url = `${API_BASE_URL}${path}`;
  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(options.headers || {}),
      },
    });
  } catch (networkError) {
    throw new Error(`Network error: Unable to reach API at ${API_BASE_URL}. Ensure backend is running and CORS is configured.`);
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (response.status === 204) {
    return {};
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload;
};

export default API_BASE_URL;