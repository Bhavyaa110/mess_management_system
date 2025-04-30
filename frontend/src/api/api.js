// frontend/src/api/api.js
import axios from 'axios'; // Correct way to import axios

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001/api/auth', // Fixed base URL
  withCredentials: true,
});

// ========== Auth Routes ==========

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${api.defaults.baseURL}/login`, credentials, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error;
  }
};

// Register user
export const SignupStudent = async (userData) => {
  try {
    const response = await axios.post(`${api.defaults.baseURL}/SignupStudent`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  } catch (error) {
    console.error("Error during signup:", error.response?.data || error.message);
    throw error;
  }
};



// Logout user
export const logoutUser = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    console.error("Error during logout:", error.response?.data || error.message);
    throw error;
  }
};

// Get current user info
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error.response?.data || error.message);
    throw error;
  }
};

