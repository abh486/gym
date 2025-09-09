import apiClient from './apiClient';

export const verifyAuth0User = accessToken =>
  apiClient.post('/auth/auth0/verify-user', null, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

export const login = credentials =>
  apiClient.post('/auth/login', credentials);

// ...other auth endpoints
