 import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import Auth0 from 'react-native-auth0';

// Import your API client function for verification
import { verifyAuth0User } from '../api/auth'; // Adjust path as needed

const auth0 = new Auth0({
  domain: 'dev-1de0bowjvfbbcx7q.us.auth0.com',
  clientId: 'rwah022fY6bSPr5gstiKqPAErQjgynT2',
});

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setLoading(true);

      // Trigger Auth0 Universal Login
      const credentials = await auth0.webAuth.authorize({
        scope: 'openid profile email',
      });

      // Fetch user info from Auth0
      const user = await auth0.auth.userInfo({ token: credentials.accessToken });

      // Verify user via backend API using centralized client
      const backendVerifiedUser = await verifyAuth0User(credentials.accessToken);

      // Navigate to MemberProfile passing user info and backend verification data
      navigation.navigate('MemberProfile', {
        profile: user,
        idToken: credentials.idToken,
        accessToken: credentials.accessToken,
        backendUser: backendVerifiedUser,
      });
    } catch (e) {
      console.error('Auth0 or backend verification failed:', e);
      Alert.alert('Login Error', e?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: '#10B981',
          paddingVertical: 15,
          paddingHorizontal: 40,
          borderRadius: 25,
          opacity: loading ? 0.7 : 1,
        }}
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>CONTINUE</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;
