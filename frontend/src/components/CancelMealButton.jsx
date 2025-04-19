import { cancelMeal } from '../api/mealService';

const handleCancel = async () => {
  const result = await cancelMeal(userId, mealId);
  if (result.success) {
    setMessage('Meal cancelled successfully!');
  } else {
    setMessage(result.error);
  }
};
