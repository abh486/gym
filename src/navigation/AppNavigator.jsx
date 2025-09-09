import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import MemberProfile from '../screens/MemberProfile';
import DietLog from '../screens/Member/DietLog';

import LoginScreen from '../screens/LoginScreen';
import WorkoutLog from '../screens/Member/WorkoutLog';
import BottomTabNavigator from './BottomTabNavigator';
import WorkoutPlanDetail from '../screens/Member/WorkoutPlanDetail';
import StartWorkout from '../screens/Member/StartWorkout';
// import Training from '../screens/Member/Training'; // 👈 uncomment if exists

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="MemberProfile"
      >
        <Stack.Screen 
          name="MainTabs" 
          component={BottomTabNavigator}
          options={{ title: 'Main App' }}
        />
        {/* Other stack screens */}
        <Stack.Screen name="DietLog" component={DietLog} />
        {/* <Stack.Screen name="Training" component={Training} /> */} 
        <Stack.Screen name="MemberProfile" component={MemberProfile} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="WorkoutLog" component={WorkoutLog} />
        <Stack.Screen name="WorkoutPlanDetail" component={WorkoutPlanDetail} />
        <Stack.Screen name="StartWorkout" component={StartWorkout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
