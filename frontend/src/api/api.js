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

export const fetchAdminData = async () => {
  try {
    const response = await axios.get('/api/AdminPage', {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching admin data:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchTodayAttendance = async () => {
  try {
    const response = await axios.get('http://localhost:5001/api/today-attendance');
    return response.data;
  } catch (error) {
    console.error("Error fetching today's attendance:", error.response?.data || error.message);
    throw error;
  }
};
export const fetchAttendanceByRollNo = async (rollNo) => {
  try {
    const response = await axios.get(`http://localhost:5001/api/attendance/${rollNo}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance by roll number:", error.response?.data || error.message);
    throw error;
  }
};



// Register user
export const SignupUser = async (userData) => {
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

