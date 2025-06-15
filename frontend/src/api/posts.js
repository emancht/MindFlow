import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Create post
export const createPost = async (postData) => {
  try {
    const response = await axios.post(API_URL, postData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Get all posts
export const getPosts = async (page = 1, limit = 10, tag = '') => {
  try {
    const response = await axios.get(API_URL, {
      params: { page, limit, tag }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Get feed posts (from followed users)
export const getFeedPosts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/feed`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Get single post
export const getPost = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Update post
export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(`${API_URL}/${postId}`, postData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Delete post
export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_URL}/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Like post
export const likePost = async (postId) => {
  try {
    const response = await axios.put(`${API_URL}/${postId}/like`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Dislike post
export const dislikePost = async (postId) => {
  try {
    const response = await axios.put(`${API_URL}/${postId}/dislike`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Get popular tags
export const getPopularTags = async () => {
  try {
    const response = await axios.get(`${API_URL}/tags`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};