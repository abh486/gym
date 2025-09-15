// import axios from "axios";
// import Auth0 from "react-native-auth0";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const auth0 = new Auth0({
//   domain:"dev-1de0bowjvfbbcx7q.us.auth0.com",
//   clientId:"rwah022fY6bSPr5gstiKqPAErQjgynT2",
// });

// const apiClient = axios.create({
//   baseURL:" https://08cca18b3a93.ngrok-free.app/api",
//   timeout: 15000,
//   headers:{ "Content-Type": "application/json" },
// });

// // Get token from Auth0 or AsyncStorage
// export async function getToken() {
//   try {
//     const creds = await auth0.credentialsManager.getCredentials();
//     if (creds?.accessToken) return creds.accessToken;
//   } catch (e) {
//     // ignore
//   }
//   const token = await AsyncStorage.getItem("accessToken");
//   return token;
// }

// // Debug: print AsyncStorage contents
// export async function debugStorage() {
//   const keys = await AsyncStorage.getAllKeys();
//   const all = {};
//   for (let key of keys) {
//     all[key] = await AsyncStorage.getItem(key);
//   }
//   console.log("📦[AsyncStorage Dump]", all);
//   return all;
// }

// // Axios interceptor to log requests
// apiClient.interceptors.request.use(
//   async (config) => {
//     const token = await getToken();
//     console.log("📤 [Axios Request]", {
//       method: config.method,
//       url: config.url,
//       headers: config.headers,
//       tokenLength: token?.length,
//       data: config.data,
//     });
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("❌ [Axios Network Error]", error.message);
//     return Promise.reject(error);
//   }
// );

// export default apiClient;


// src/api/apiClient.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auth0 from 'react-native-auth0';

// Your Auth0 configuration
const auth0 = new Auth0({
  domain: "dev-1de0bowjvfbbcx7q.us.auth0.com",
  clientId: "rwah022fY6bSPr5gstiKqPAErQjgynT2",
});

// Your API client configuration
const apiClient = axios.create({
  baseURL: "https://e307f4004e07.ngrok-free.app/api", // Your ngrok URL
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// This function is the single source of truth for getting the token.
// It is used by the interceptor below.
export async function getToken() {
  try {
    // Prefer fresh credentials from the manager if available
    const creds = await auth0.credentialsManager.getCredentials();
    if (creds?.accessToken) {
      await AsyncStorage.setItem("accessToken", creds.accessToken); // Keep storage in sync
      return creds.accessToken;
    }
  } catch (e) {
    // Fallback to AsyncStorage if credentials manager fails (e.g., after app restart)
    console.log("[apiClient] Credentials manager failed, falling back to AsyncStorage.");
    return await AsyncStorage.getItem("accessToken");
  }
  return null;
}

// ✅✅✅ THIS IS THE NEW, CRUCIAL INTERCEPTOR ✅✅✅
// This function runs automatically BEFORE every single API request is sent.
apiClient.interceptors.request.use(
  async (config) => {
    // Get the most recent token from our single source of truth.
    const token = await getToken();
    
    // If a token exists, add it to the Authorization header.
    // This is the standard way to send a JWT.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('📤 [Axios Request]', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      tokenLength: token?.length,
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Your existing logging interceptor for responses.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ [Axios Network Error]", error.message);
    return Promise.reject(error);
  }
);


// Your existing debug function.
export async function debugStorage() {
  const keys = await AsyncStorage.getAllKeys();
  const all = {};
  for (let key of keys) {
    all[key] = await AsyncStorage.getItem(key);
  }
  console.log("📦[AsyncStorage Dump]", all);
  return all;
}

export default apiClient;
