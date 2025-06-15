import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Verify OTP
export const verifyOTP = async (verificationData) => {
  try {
    const response = await axios.post(
      `${API_URL}/verify-otp`,
      verificationData
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Resend OTP
export const resendOTP = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/resend-otp`, { userId });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Logout user
export const logout = async () => {
  try {
    const response = await axios.get(`${API_URL}/logout`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
