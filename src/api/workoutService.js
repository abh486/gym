import apiClient from './apiClient'; // Uses the Auth0-configured apiClient

/**
 * @description Fetches the entire exercise library from the backend.
 * @returns {Promise<Array>} A promise that resolves to the array of exercises.
 */
export const getExerciseLibrary = async () => {
  try {
    // Correctly points to the Auth0-protected route
    const response = await apiClient.get('/workouts/auth0/library');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching exercise library:', error.response?.data || error.message);
    throw error.response?.data || new Error('Server error while fetching library.');
  }
};

/**
 * @description Logs a new workout session to the backend.
 * @param {Object} sessionData - The data for the session.
 * @returns {Promise<Object>} A promise that resolves to the newly created session data.
 */
export const logWorkoutSession = async (sessionData) => {
  try {
    // Correctly points to the Auth0-protected route
    const response = await apiClient.post('/workouts/auth0/sessions', sessionData);
    return response.data.data;
  } catch (error) {
    console.error('Error logging workout session:', error.response?.data || error.message);
    throw error.response?.data || new Error('Server error while logging session.');
  }
};

/**
 * @description Fetches a paginated history of the user's workout sessions.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<Object>} A promise that resolves to the history data and pagination info.
 */
export const getWorkoutHistory = async (page = 1, limit = 10) => {
  try {
    // Correctly points to the Auth0-protected route
    const response = await apiClient.get('/workouts/auth0/sessions', { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching workout history:', error.response?.data || error.message);
    throw error.response?.data || new Error('Server error while fetching history.');
  }
};

/**
 * @description Deletes a specific workout session by its ID.
 * @param {string} sessionId - The ID of the session to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
export const deleteWorkoutSession = async (sessionId) => {
  try {
    // Correctly points to the Auth0-protected route
    await apiClient.delete(`/workouts/auth0/sessions/${sessionId}`);
  } catch (error) {
    console.error('Error deleting workout session:', error.response?.data || error.message);
    throw error.response?.data || new Error('Server error while deleting session.');
  }
};