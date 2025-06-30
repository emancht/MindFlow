import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/comments';
const API_URL = `${import.meta.env.VITE_API_URL}/api/comments`;

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Create comment
export const createComment = async (postId, content) => {
  try {
    const response = await axios.post(`${API_URL}/${postId}`, { content });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Get comments for a post
export const getComments = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Delete comment
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`${API_URL}/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
