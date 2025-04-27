import React from 'react';
import { cancelMeal } from '../api/mealService';

function CancelMealButton({ mealId }) {
  const handleCancel = async () => {
    await cancelMeal(mealId);
    alert('Meal Cancelled!');
  };

  return <button onClick={handleCancel}>Cancel Meal</button>;
}

export default CancelMealButton;
