import apiClient from './apiClient';

export const getExerciseLibrary = async () => {
  try {
    const response = await apiClient.get('/workouts/library');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || new Error('Server error.');
  }
};

export const logWorkoutSession = async (sessionData) => {
  try {
    const response = await apiClient.post('/workouts/sessions', sessionData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || new Error('Server error.');
  }
};