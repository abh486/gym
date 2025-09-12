import apiClient from './apiClient';

export const verifyAuth0User = async (accessToken) => {
  console.log('verifyAuth0User called with token:', accessToken); // Debug log
  try {
    const response = await apiClient.post('/auth/auth0/verify-user', null, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('verifyAuth0User response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('verifyAuth0User error:', error); // Debug log
    throw error;
  }
};

export const login = (credentials) =>
  apiClient.post('/auth/login', credentials);
