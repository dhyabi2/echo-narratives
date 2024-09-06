// Local storage keys
const ECHOES_KEY = 'echoes';
const CATEGORIES_KEY = 'categories';

// Helper function to get data from local storage
const getFromStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Helper function to set data in local storage
const setToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getEchoes = () => {
  return getFromStorage(ECHOES_KEY) || [];
};

export const addEcho = (echo) => {
  const echoes = getEchoes();
  const newEcho = { ...echo, id: Date.now(), createdAt: new Date().toISOString() };
  echoes.push(newEcho);
  setToStorage(ECHOES_KEY, echoes);
  return newEcho;
};

export const getCategories = () => {
  return getFromStorage(CATEGORIES_KEY) || ['Advice', 'Confession', 'Love', 'Travel', 'Music'];
};

export const addCategory = (category) => {
  const categories = getCategories();
  if (!categories.includes(category)) {
    categories.push(category);
    setToStorage(CATEGORIES_KEY, categories);
  }
};

export const updateEcho = (updatedEcho) => {
  const echoes = getEchoes();
  const index = echoes.findIndex(echo => echo.id === updatedEcho.id);
  if (index !== -1) {
    echoes[index] = updatedEcho;
    setToStorage(ECHOES_KEY, echoes);
  }
};