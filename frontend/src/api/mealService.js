// mealService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

export const cancelMeal = async (user_id, meal_id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cancel_meal`, {
      user_id,
      meal_id
    });
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Server error' };
  }
};
