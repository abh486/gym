// // dietService.js
// import apiClient, { getToken as getAuthToken } from './apiClient'; // adjust path if needed

// // Get diet logs by date
// export const getDietLogsByDate = async (date) => {
//   try {
//     const token = await getAuthToken();
//     const res = await apiClient.get(`/logs/date/${date}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error) {
//     console.log('Error fetching diet logs:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Create new diet log
// export const createDietLog = async (logData) => {
//   try {
//     const token = await getAuthToken();
//     const res = await apiClient.post(`/logs`, logData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error) {
//     console.log('Error creating diet log:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Update diet log by ID
// export const updateDietLog = async (id, logData) => {
//   try {
//     const token = await getAuthToken();
//     const res = await apiClient.put(`/logs/${id}`, logData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error) {
//     console.log('Error updating diet log:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Delete diet log by ID
// export const deleteDietLog = async (id) => {
//   try {
//     const token = await getAuthToken();
//     const res = await apiClient.delete(`/logs/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error) {
//     console.log('Error deleting diet log:', error.response?.data || error.message);
//     throw error;
//   }
// };


// // dietService.js
// import apiClient, { getToken as getAuthToken } from './apiClient'; // adjust path if needed

// // Get diet logs by date
// export const getDietLogsByDate = async (date) => {
//   try {
//     const token = await getAuthToken();
//     const res = await apiClient.get(`diet/auth0/logs/date/${date}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error) {
//     console.log('Error fetching diet logs:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Create new diet log
// export const createDietLog = async (logData) => {
//   try {
//     const token = await getAuthToken();
//     const res = await apiClient.post(`diet/auth0/logs`, logData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error) {
//     console.log('Error creating diet log:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Update diet log by ID
// export const updateDietLog = async (id, logData) => {
//   try {
//     const token = await getAuthToken();
//     const res = await apiClient.put(`diet/auth0/logs/${id}`, logData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error) {
//     console.log('Error updating diet log:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Delete diet log by ID
// export const deleteDietLog = async (id) => {
//   try {
//     const token = await getAuthToken();
//     const res = await apiClient.delete(`diet/auth0/logs/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error) {
//     console.log('Error deleting diet log:', error.response?.data || error.message);
//     throw error;
//   }
// };



// import apiClient, { getToken as getAuthToken } from './apiClient'; // adjust path if needed

// // Get diet logs by date (SENDS TOKEN IN QUERY)
// export const getDietLogsByDate = async (date) => {
//   try {
//     const token = await getAuthToken();
//     // GET requests have no body, so we send the token as a query parameter
//     const res = await apiClient.get(`diet/auth0/logs/date/${date}?token=${token}`);
//     return res.data;
//   } catch (error) {
//     console.log('Error fetching diet logs:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Create new diet log (SENDS TOKEN IN BODY)
// export const createDietLog = async (logData) => {
//   try {
//     const token = await getAuthToken();
//     // Merge the token into the body of the POST request
//     const bodyWithToken = { ...logData, token };
//     const res = await apiClient.post(`diet/auth0/logs`, bodyWithToken);
//     return res.data;
//   } catch (error) {
//     console.log('Error creating diet log:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Update diet log by ID (SENDS TOKEN IN BODY)
// export const updateDietLog = async (id, logData) => {
//   try {
//     const token = await getAuthToken();
//     // Merge the token into the body of the PUT request
//     const bodyWithToken = { ...logData, token };
//     const res = await apiClient.put(`diet/auth0/logs/${id}`, bodyWithToken);
//     return res.data;
//   } catch (error) {
//     console.log('Error updating diet log:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Delete diet log by ID (SENDS TOKEN IN QUERY)
// export const deleteDietLog = async (id) => {
//   try {
//     const token = await getAuthToken();
//     // DELETE requests have no body, so we send the token as a query parameter
//     const res = await apiClient.delete(`diet/auth0/logs/${id}?token=${token}`);
//     return res.data;
//   } catch (error) {
//     console.log('Error deleting diet log:', error.response?.data || error.message);
//     throw error;
//   }
// };
// src/api/dietService.js
// src/api/dietService.js

import apiClient from './apiClient';
import parseApiError from '../utils/parseApiError';

/**
 * @description Saves a new diet/meal entry to the backend.
 * @param {object} dietData - The diet form data from the component.
 * @returns {Promise<{success: boolean, message: string, data: object|null}>} A structured response.
 */
export const saveDietEntry = async (dietData) => {
  try {
    console.log('[DietService] Saving diet entry:', dietData);
    
    // Transform the data to match backend expectations
    const transformedData = {
      mealName: dietData.mealName,
      mealType: dietData.mealType || 'breakfast',
      calories: parseInt(dietData.calories) || 0,
      protein: parseInt(dietData.protein) || 0,
      carbs: parseInt(dietData.carbs) || 0,
      fats: parseInt(dietData.fats) || 0,
      fiber: parseInt(dietData.fiber) || 0,
      sugar: parseInt(dietData.sugar) || 0,
      notes: dietData.notes || '',
    };

    console.log('[DietService] Transformed data:', transformedData);
    
    const response = await apiClient.post('/diet/auth0/logs', transformedData);
    
    console.log('[DietService] Raw response:', response.data);
    
    return {
      success: true,
      message: 'Diet entry saved successfully!',
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error('[DietService] Error saving diet entry:', error);
    const errorMessage = parseApiError(error);
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};

/**
 * @description Fetches diet logs for a specific date.
 * @param {string} date - The date in YYYY-MM-DD format.
 * @returns {Promise<{success: boolean, message: string, data: object|null}>} A structured response.
 */
export const getDietLogsByDate = async (date) => {
  try {
    console.log('[DietService] Fetching diet logs for date:', date);
    
    const response = await apiClient.get(`/diet/auth0/logs/date/${date}`);
    
    console.log('[DietService] Raw response:', response.data);
    
    return {
      success: true,
      message: 'Diet logs fetched successfully.',
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error('[DietService] Error fetching diet logs:', error);
    const errorMessage = parseApiError(error);
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};

/**
 * @description Updates an existing diet log entry.
 * @param {string} logId - The ID of the log to update.
 * @param {object} updateData - The data to update.
 * @returns {Promise<{success: boolean, message: string, data: object|null}>} A structured response.
 */
export const updateDietLog = async (logId, updateData) => {
  try {
    console.log('[DietService] Updating diet log:', logId, updateData);
    
    const response = await apiClient.put(`/diet/auth0/logs/${logId}`, updateData);
    
    console.log('[DietService] Raw response:', response.data);
    
    return {
      success: true,
      message: 'Diet log updated successfully!',
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error('[DietService] Error updating diet log:', error);
    const errorMessage = parseApiError(error);
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};

/**
 * @description Deletes a diet log entry.
 * @param {string} logId - The ID of the log to delete.
 * @returns {Promise<{success: boolean, message: string, data: object|null}>} A structured response.
 */
export const deleteDietLog = async (logId) => {
  try {
    console.log('[DietService] Deleting diet log:', logId);
    
    await apiClient.delete(`/diet/auth0/logs/${logId}`);
    
    return {
      success: true,
      message: 'Diet log deleted successfully!',
      data: null,
    };
  } catch (error) {
    console.error('[DietService] Error deleting diet log:', error);
    const errorMessage = parseApiError(error);
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};