// frontend/src/api/api.js

import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: '/api', 
  withCredentials: true, 
});

// ========== Auth Routes ==========

// Login user
export const loginUser = (credentials) => {
  return api.post('/auth/login', credentials);
};

// Register user
export const registerUser = (userData) => {
  return api.post('/auth/register', userData);
};

// Logout user
export const logoutUser = () => {
  return api.post('/auth/logout');
};

// Get current user info
export const getCurrentUser = () => {
  return api.get('/auth/user');
};

// ========== Attendance Routes ==========

// Mark attendance
export const markAttendance = (attendanceData) => {
  return api.post('/attendance/mark', attendanceData);
};

// Get attendance record
export const getAttendance = () => {
  return api.get('/attendance');
};

// ========== Meal Routes ==========

// Get all meals
export const getMeals = (day) => {
  return api.get('/meals', {params: {day}});
};

// Cancel a meal
export const cancelMeal = (userData) => {
  return api.delete('/cancel_meal', userData);
};

// Book a meal
export const bookMeal = (mealData) => {
  return api.post('/meals/book', mealData);
};

// ========== Ticket Routes ==========

// Create a ticket
export const createTicket = (ticketData) => {
  return api.post('/tickets', ticketData);
};

// Get all tickets
export const getTickets = () => {
  return api.get('/tickets');
};

// View specific ticket
export const getTicketById = (ticketId) => {
  return api.get(`/tickets/${ticketId}`);
};

// Delete a ticket
export const deleteTicket = (ticketId) => {
  return api.delete(`/tickets/${ticketId}`);
};

export default api;
