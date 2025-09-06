// src/screens/LoginScreen.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';


const colors = {
  background: '#ffffff',
  primary: '#10B981',
  primaryText: '#ffffff',
  textSecondary: '#6b7280',
  error: '#d32f2f',
};

const LoginScreen = () => {
  const { login, loading, error } = useAuth();
  const [loginError, setLoginError] = useState(null);

  const handleLogin = async () => {
    try {
      console.log('LoginScreen: Starting login...');
      setLoginError(null);
      await login();
      console.log('LoginScreen: Login completed successfully');
    } catch (err) {
      console.error('LoginScreen: Login failed:', err);
      const errorMessage = err.message || 'Login failed. Please try again.';
      setLoginError(errorMessage);
      Alert.alert('Login Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <Text style={styles.headerText}>Welcome to Fitness Club</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>Sign in to continue</Text>
          
          <TouchableOpacity 
            style={[styles.signInButton, { backgroundColor: colors.primary }]} 
            onPress={handleLogin} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryText} />
            ) : (
              <Text style={styles.signInButtonText}>CONTINUE</Text>
            )}
          </TouchableOpacity>
          
          {(error || loginError) && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: colors.error }]}>
                {loginError || error?.message || 'Unknown error occurred'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ 
  container: { 
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center'
  },
  header: { 
    padding: 60,
    alignItems: 'center'
  }, 
  headerText: { 
    color: '#ffffff', 
    fontSize: 32, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30
  },
  formContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 30 
  }, 
  signInButton: { 
    padding: 15, 
    borderRadius: 25, 
    alignItems: 'center',
    marginBottom: 20
  }, 
  signInButtonText: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  errorContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f44336'
  },
  errorText: { 
    color: '#d32f2f', 
    textAlign: 'center',
    fontSize: 14
  }
});

export default LoginScreen;
