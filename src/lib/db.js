const API_BASE_URL = 'https://ekos-api.replit.app';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    )
  ]);
};

export const register = async (userData) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

export const login = async (credentials) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return handleResponse(response);
};

export const getProfile = async () => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/users/profile`);
  return handleResponse(response);
};

export const updateProfile = async (userData) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/users/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

export const getEchoes = async (page = 1, limit = 10) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/echoes?page=${page}&limit=${limit}`);
  return handleResponse(response);
};

export const getEchoesByCountry = async (country, page = 1, limit = 10) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/echoes?country=${country}&page=${page}&limit=${limit}`);
  return handleResponse(response);
};

export const addEcho = async (echoData) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/echoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(echoData)
  });
  return handleResponse(response);
};

export const getEchoById = async (id) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/echoes/${id}`);
  return handleResponse(response);
};

export const updateEcho = async (id, echoData) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/echoes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(echoData)
  });
  return handleResponse(response);
};

export const deleteEcho = async (id) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/echoes/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};

export const likeEcho = async (id) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/echoes/${id}/like`, {
    method: 'POST'
  });
  return handleResponse(response);
};

export const unlikeEcho = async (id) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/echoes/${id}/unlike`, {
    method: 'POST'
  });
  return handleResponse(response);
};

export const getComments = async (echoId) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/echoes/${echoId}/comments`);
  return handleResponse(response);
};

export const addComment = async (echoId, commentData) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/echoes/${echoId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData)
  });
  return handleResponse(response);
};

export const getReplies = async (commentId) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/comments/${commentId}/replies`);
  return handleResponse(response);
};

export const addReply = async (commentId, replyData) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/comments/${commentId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(replyData)
  });
  return handleResponse(response);
};

export const getTags = async () => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/tags`);
  return handleResponse(response);
};

export const addTag = async (tagData) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tagData)
  });
  return handleResponse(response);
};

export const getBookmarks = async () => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/bookmarks`);
  return handleResponse(response);
};

export const addBookmark = async (echoId) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ echoId })
  });
  return handleResponse(response);
};

export const removeBookmark = async (echoId) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/bookmarks/${echoId}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};

export const reportEcho = async (echoId, reason) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ echoId, reason })
  });
  return handleResponse(response);
};

export const logout = () => {
  // No action needed as we're not storing tokens
};

export const isAuthenticated = () => {
  // Always return true as we're not using authentication
  return true;
};
