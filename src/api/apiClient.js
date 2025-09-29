
// apiClient.js (axios instance with Auth0 token interceptor)
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({
  domain: "dev-1de0bowjvfbbcx7q.us.auth0.com",
  clientId: "rwah022fY6bSPr5gstiKqPAErQjgynT2",
});

const apiClient = axios.create({
  baseURL: "https://4b3f4f37e11d.ngrok-free.app/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export async function getToken() {
  try {
    const creds = await auth0.credentialsManager.getCredentials();
    if (creds?.accessToken) {
      await AsyncStorage.setItem("accessToken", creds.accessToken);
      return creds.accessToken;
    }
  } catch (e) {
    console.log("[apiClient] Credentials manager failed, falling back to AsyncStorage.");
    return await AsyncStorage.getItem("accessToken");
  }
  return null;
}

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
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
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ [Axios Network Error]", error.message);
    return Promise.reject(error);
  }
);

export default apiClient;

// // src/api/apiClient.js
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Auth0 from 'react-native-auth0';

// const auth0 = new Auth0({
//   domain: "dev-1de0bowjvfbbcx7q.us.auth0.com",
//   clientId: "rwah022fY6bSPr5gstiKqPAErQjgynT2",
// });

// // ✅ FIXED: Using HTTPS and ensured no trailing slash.
// // IMPORTANT: Make sure this URL is your active ngrok or deployed server URL.
// export const API_BASE_URL = "https://3a2a85c38cfe.ngrok-free.app/api";

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 15000,
//   // ❌ REMOVED: Global Content-Type header. This is the MOST IMPORTANT FIX.
//   // Removing this allows Axios to automatically set the correct 'multipart/form-data'
//   // header (with the correct boundary) when it detects a FormData object.
// });

// export async function getToken() {
//   try {
//     const creds = await auth0.credentialsManager.getCredentials();
//     if (creds?.accessToken) {
//       await AsyncStorage.setItem("accessToken", creds.accessToken);
//       return creds.accessToken;
//     }
//   } catch (e) {
//     console.log("[apiClient] Credentials manager failed, falling back to AsyncStorage.");
//     return await AsyncStorage.getItem("accessToken");
//   }
//   return null;
// }

// // Request Interceptor
// apiClient.interceptors.request.use(
//   async (config) => {
//     const token = await getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // More detailed logging
//     console.log('📤 [API Request]', {
//       method: config.method?.toUpperCase(),
//       url: config.url,
//       hasToken: !!token,
//       contentType: config.headers['Content-Type'] || 'auto-detected by Axios',
//     });

//     return config;
//   },
//   (error) => {
//     console.error('❌ [Request Setup Error]', error.message);
//     return Promise.reject(error);
//   }
// );

// // Response Interceptor
// apiClient.interceptors.response.use(
//   (response) => {
//     console.log('✅ [API Response]', {
//         status: response.status,
//         url: response.config.url,
//     });
//     return response;
//   },
//   (error) => {
//     console.error('❌ [API Error]', {
//       message: error.message,
//       status: error.response?.status,
//       data: error.response?.data,
//       url: error.config?.url,
//       method: error.config?.method,
//     });
//     return Promise.reject(error);
//   }
// );

// export default apiClient;