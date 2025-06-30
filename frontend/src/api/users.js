import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/users';
const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/profile/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Update user profile
export const updateProfile = async (formData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Follow user
export const followUser = async (userId) => {
  try {
    const response = await axios.put(`${API_URL}/follow/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Unfollow user
export const unfollowUser = async (userId) => {
  try {
    const response = await axios.put(`${API_URL}/unfollow/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Get user suggestions
export const getUserSuggestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/suggestions`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
