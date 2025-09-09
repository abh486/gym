import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

const getRedirectUri = () =>
  Platform.OS === 'ios' ? 'com.fitnessclub://callback' : 'com.fitnessclub://callback';

export const AuthProvider = ({ children }) => {
  const { authorize, clearSession, getCredentials, isLoading, user, error } = useAuth0();
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Restore credentials on start
  useEffect(() => {
    const restore = async () => {
      try {
        const credentials = await getCredentials();
        if (credentials?.accessToken) {
          setToken(credentials.accessToken);
          await AsyncStorage.setItem('accessToken', credentials.accessToken);

          // verify with backend
          const resp = await apiClient.post('/auth/auth0/verify-user');
          if (resp.data?.success) {
            setUserProfile(resp.data.data);
            setIsAuthenticated(true);
            await AsyncStorage.setItem('userProfile', JSON.stringify(resp.data.data));
          }
        }
      } catch (e) {
        // ignore; user not authenticated
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, [getCredentials]);

  const login = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const redirectUri = getRedirectUri();
      const credentials = await authorize({
        scope: 'openid profile email',
        audience: 'https://api.fitnessclub.com',
        redirectUri
      });

      if (credentials?.accessToken) {
        setToken(credentials.accessToken);
        await AsyncStorage.setItem('accessToken', credentials.accessToken);

        const resp = await apiClient.post('/auth/auth0/verify-user');

        if (resp.data?.success) {
          setUserProfile(resp.data.data);
          setIsAuthenticated(true);
          await AsyncStorage.setItem('userProfile', JSON.stringify(resp.data.data));
        } else {
          throw new Error('Backend verification failed');
        }
      }
    } catch (e) {
      setAuthError(e);
      setToken(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await clearSession();
    } catch (e) {
      // ignore
    } finally {
      setToken(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('userProfile');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      token,
      loading: loading || isLoading,
      isAuthenticated,
      login,
      logout,
      error: authError || error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
