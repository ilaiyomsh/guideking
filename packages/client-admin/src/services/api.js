import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all guides (only _id and title)
export const getGuides = async () => {
  const response = await api.get('/guides');
  return response.data;
};

// Get specific guide by ID
export const getGuide = async (id) => {
  const response = await api.get(`/guides/${id}`);
  return response.data;
};

// Create new guide
export const createGuide = async (guide) => {
  const response = await api.post('/guides', guide);
  return response.data;
};

// Update existing guide
export const updateGuide = async (id, guide) => {
  const response = await api.put(`/guides/${id}`, guide);
  return response.data;
};

// Delete guide
export const deleteGuide = async (id) => {
  await api.delete(`/guides/${id}`);
};
