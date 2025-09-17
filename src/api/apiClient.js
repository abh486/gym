import axios from 'axios';
import Auth0 from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';

const auth0 = new Auth0({
  domain: "dev-1de0bowjvfbbcx7q.us.auth0.com",
  clientId: "rwah022fY6bSPr5gstiKqPAErQjgynT2"
});

const apiClient = axios.create({
  baseURL: "http://cd664ca33db5.ngrok-free.app/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});

async function getTokenFromAuth0() {
  try {
    const creds = await auth0.credentialsManager.getCredentials();
    return creds?.accessToken ?? null;
  } catch (e) {
    // credentialsManager might not be available; fallback to AsyncStorage
    return null;
  }
}

apiClient.interceptors.request.use(
  async (config) => {
    // Primary: auth0 credentials manager
    let token = await getTokenFromAuth0();

    // Fallback: token saved in AsyncStorage by AuthContext
    if (!token) {
      try {
        token = await AsyncStorage.getItem('accessToken');
      } catch (e) {
        token = null;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default apiClient;
