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
import apiClient, { getToken as getAuthToken } from './apiClient';

// Get diet logs by date (SENDS TOKEN IN QUERY PARAMS)
export const getDietLogsByDate = async (date) => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication token not found.');
    // GET requests cannot have a body, so we send the token as a query parameter
    const res = await apiClient.get(`diet/auth0/logs/date/${date}?token=${token}`);
    return res.data;
  } catch (error) {
    console.log('Error fetching diet logs:', error.response?.data || error.message);
    throw error;
  }
};

// Create new diet log (SENDS TOKEN IN BODY)
export const createDietLog = async (logData) => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication token not found.');
    // Merge the token into the body of the POST request
    const bodyWithToken = { ...logData, token };
    const res = await apiClient.post(`diet/auth0/logs`, bodyWithToken);
    return res.data;
  } catch (error) {
    console.log('Error creating diet log:', error.response?.data || error.message);
    throw error;
  }
};

// Update diet log by ID (SENDS TOKEN IN BODY)
export const updateDietLog = async (id, logData) => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication token not found.');
    // Merge the token into the body of the PUT request
    const bodyWithToken = { ...logData, token };
    const res = await apiClient.put(`diet/auth0/logs/${id}`, bodyWithToken);
    return res.data;
  } catch (error) {
    console.log('Error updating diet log:', error.response?.data || error.message);
    throw error;
  }
};

// Delete diet log by ID (SENDS TOKEN IN QUERY PARAMS)
export const deleteDietLog = async (id) => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication token not found.');
    // DELETE requests cannot have a body, so we send the token as a query parameter
    const res = await apiClient.delete(`diet/auth0/logs/${id}?token=${token}`);
    return res.data;
  } catch (error) {
    console.log('Error deleting diet log:', error.response?.data || error.message);
    throw error;
  }
};