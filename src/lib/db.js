import axios from 'axios';

const API_BASE_URL = 'https://ekos-api.replit.app';

let token = localStorage.getItem('token');

const setToken = (newToken) => {
  token = newToken;
  localStorage.setItem('token', newToken);
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  setToken(response.data.token);
  return response.data.user;
};

export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  setToken(response.data.token);
  return response.data.user;
};

export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

export const getEchoes = async (country, page = 1, limit = 10) => {
  const response = await api.get('/echoes', { params: { country, page, limit } });
  return response.data;
};

export const addEcho = async (echoData) => {
  const response = await api.post('/echoes', echoData);
  return response.data;
};

export const getEchoById = async (id) => {
  const response = await api.get(`/echoes/${id}`);
  return response.data;
};

export const updateEcho = async (id, echoData) => {
  const response = await api.put(`/echoes/${id}`, echoData);
  return response.data;
};

export const deleteEcho = async (id) => {
  const response = await api.delete(`/echoes/${id}`);
  return response.data;
};

export const likeEcho = async (id) => {
  const response = await api.post(`/echoes/${id}/like`);
  return response.data;
};

export const unlikeEcho = async (id) => {
  const response = await api.post(`/echoes/${id}/unlike`);
  return response.data;
};

export const getComments = async (echoId) => {
  const response = await api.get(`/echoes/${echoId}/comments`);
  return response.data;
};

export const addComment = async (echoId, commentData) => {
  const response = await api.post(`/echoes/${echoId}/comments`, commentData);
  return response.data;
};

export const getReplies = async (commentId) => {
  const response = await api.get(`/comments/${commentId}/replies`);
  return response.data;
};

export const addReply = async (commentId, replyData) => {
  const response = await api.post(`/comments/${commentId}/replies`, replyData);
  return response.data;
};

export const getTags = async () => {
  const response = await api.get('/tags');
  return response.data;
};

export const addTag = async (tagData) => {
  const response = await api.post('/tags', tagData);
  return response.data;
};

export const getBookmarks = async () => {
  const response = await api.get('/bookmarks');
  return response.data;
};

export const addBookmark = async (echoId) => {
  const response = await api.post('/bookmarks', { echoId });
  return response.data;
};

export const removeBookmark = async (echoId) => {
  const response = await api.delete(`/bookmarks/${echoId}`);
  return response.data;
};

export const reportEcho = async (echoId, reason) => {
  const response = await api.post('/reports', { echoId, reason });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  token = null;
};

export const isAuthenticated = () => {
  return !!token;
};
