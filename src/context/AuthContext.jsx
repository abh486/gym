// import React, { createContext, useContext, useState, useEffect } from "react";
// import { Platform } from "react-native";
// import { useAuth0 } from "react-native-auth0";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import apiClient, { getToken, debugStorage } from "../api/apiClient";

// const AuthContext = createContext();

// const getRedirectUri = () =>
//   Platform.OS === "ios"
//     ? "com.fitnessclub://callback"
//     : "com.fitnessclub://callback";

// export const AuthProvider = ({ children }) => {
//   const { authorize, clearSession } = useAuth0();

//   const [token, setToken] = useState(null);
//   const [userProfile, setUserProfile] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [hasProfile, setHasProfile] = useState(null);

//   // ✅ Attach token to all POST/PUT requests for dev (Ngrok)
//   useEffect(() => {
//     const interceptor = apiClient.interceptors.request.use((config) => {
//       if (token && (config.method === "post" || config.method === "put")) {
//         config.data = { ...(config.data || {}), token };
//       }
//       return config;
//     });
//     return () => apiClient.interceptors.request.eject(interceptor);
//   }, [token]);

//   // ✅ Check if user has profile in backend
//   const checkProfile = async (accessToken) => {
//     try {
//       const res = await apiClient.get("/user/auth0/profile", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       if (res.data && res.data.id) {
//         setHasProfile(true);
//       } else {
//         setHasProfile(false); // no profile → force profile creation
//       }
//     } catch (err) {
//       console.error("🔴 [checkProfile] failed:", err.message);
//       setHasProfile(false);
//     }
//   };

//   // ✅ Restore session on app start
//   useEffect(() => {
//     const restore = async () => {
//       try {
//         const savedToken = await getToken();
//         if (savedToken) {
//           setToken(savedToken);

//           const resp = await apiClient.post("/auth/auth0/verify-user", {
//             token: savedToken,
//           });

//           if (resp.data?.success) {
//             setUserProfile(resp.data.data);
//             setIsAuthenticated(true);
//             await AsyncStorage.setItem(
//               "userProfile",
//               JSON.stringify(resp.data.data)
//             );

//             // Check if user already has a profile
//             await checkProfile(savedToken);
//           }
//         }
//       } catch (e) {
//         console.error("🔴 [restore] failed:", e.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     restore();
//   }, []);

//   // ✅ Login
//   const login = async () => {
//     setLoading(true);
//     try {
//       const redirectUri = getRedirectUri();
//       const creds = await authorize({
//         scope: "openid profile email",
//         audience: "https://api.fitnessclub.com",
//         redirectUri,
//       });

//       if (creds?.accessToken) {
//         setToken(creds.accessToken);
//         await AsyncStorage.setItem("accessToken", creds.accessToken);

//         const resp = await apiClient.post("/auth/auth0/verify-user", {
//           token: creds.accessToken,
//         });

//         if (resp.data?.success) {
//           setUserProfile(resp.data.data);
//           setIsAuthenticated(true);
//           await AsyncStorage.setItem(
//             "userProfile",
//             JSON.stringify(resp.data.data)
//           );

//           // Check profile status
//           await checkProfile(creds.accessToken);
//         } else {
//           throw new Error("Backend verification failed");
//         }
//       }
//     } catch (e) {
//       console.error("🔴 [login] failed:", e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Logout
//   const logout = async () => {
//     setLoading(true);
//     try {
//       await clearSession();
//     } catch (e) {
//       console.warn("Clear session error:", e.message);
//     } finally {
//       setToken(null);
//       setUserProfile(null);
//       setIsAuthenticated(false);
//       setHasProfile(null);
//       await AsyncStorage.clear();
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         userProfile,
//         isAuthenticated,
//         hasProfile,
//         loading,
//         login,
//         logout,
//         debugStorage,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };

// src/context/AuthContext.js

// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import { Platform } from "react-native";
import { useAuth0 } from "react-native-auth0";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient, { getToken, debugStorage } from "../api/apiClient";

const AuthContext = createContext();

const getRedirectUri = () =>
  Platform.OS === "ios"
    ? "com.fitnessclub://callback"
    : "com.fitnessclub://callback";

export const AuthProvider = ({ children }) => {
  const { authorize, clearSession } = useAuth0();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // Added for completeness

  const checkAuthStatus = async () => {
    console.log("[AuthContext] Checking auth status...");
    try {
      const savedToken = await getToken();
      if (!savedToken) {
        throw new Error("No token found. User is logged out.");
      }

      // The apiClient interceptor will now AUTOMATICALLY add the token to the header.
      // We no longer need to pass it in the body.
      const resp = await apiClient.post("/auth/auth0/verify-user");

      if (resp.data?.success && resp.data.data) {
        const profile = resp.data.data;
        setUserProfile(profile);
        setIsAuthenticated(true);
        await AsyncStorage.setItem("userProfile", JSON.stringify(profile));

        if (profile.memberProfile && profile.memberProfile.name) {
          console.log("[AuthContext] Profile is complete.");
          setHasProfile(true);
        } else {
          console.log("[AuthContext] Profile is incomplete.");
          setHasProfile(false);
        }
      } else {
        throw new Error("Backend verification failed.");
      }
    } catch (e) {
      console.error("🔴 [checkAuthStatus] failed:", e.message);
      setIsAuthenticated(false);
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshAuthStatus = async () => {
    console.log("[AuthContext] Refreshing auth status after profile update...");
    await checkAuthStatus();
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const creds = await authorize({
        scope: "openid profile email",
        audience: "https://api.fitnessclub.com",
        redirectUri: getRedirectUri(),
      });

      if (creds?.accessToken) {
        await AsyncStorage.setItem("accessToken", creds.accessToken);
        // After login, re-run the check. The interceptor will use the new token.
        await checkAuthStatus();
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error("🔴 [login] failed:", e.message);
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await clearSession();
      await AsyncStorage.clear();
    } catch (e) {
      console.warn("Clear session error:", e.message);
    } finally {
      setIsAuthenticated(false);
      setHasProfile(false);
      setUserProfile(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        isAuthenticated,
        hasProfile,
        loading,
        login,
        logout,
        refreshAuthStatus,
        debugStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};