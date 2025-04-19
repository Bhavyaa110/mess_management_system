import axios from 'axios';
const BASE_URL = "http://localhost:5000";

export const generateQR = (user_id, meal_id) =>
  axios.post(`${BASE_URL}/generate_qr`, { user_id, meal_id });

export const markAttendance = (user_id, meal_id) =>
  axios.post(`${BASE_URL}/mark_attendance`, { user_id, meal_id });


