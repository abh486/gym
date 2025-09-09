import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Screens
import MemberProfile from '../screens/MemberProfile';
import DietLog from '../screens/Member/DietLog';
import LoginScreen from '../screens/LoginScreen';
import WorkoutLog from '../screens/Member/WorkoutLog';
import BottomTabNavigator from './BottomTabNavigator';
import WorkoutPlanDetail from '../screens/Member/WorkoutPlanDetail';

// import Training from '../screens/Member/Training'; // 👈 uncomment if exists

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show splash or loader while checking auth
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="DietLog" component={DietLog} />
            <Stack.Screen name="MemberProfile" component={MemberProfile} />
            <Stack.Screen name="WorkoutLog" component={WorkoutLog} />
            <Stack.Screen name="WorkoutPlanDetail" component={WorkoutPlanDetail} />
          </>
        ) : (
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
