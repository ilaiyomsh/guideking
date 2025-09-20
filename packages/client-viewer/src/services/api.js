const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;

export const fetchGuide = async (guideId) => {
  const response = await fetch(`${API_BASE_URL}/guides/${guideId}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Guide not found');
    }
    throw new Error('Failed to fetch guide');
  }
  
  return response.json();
};
