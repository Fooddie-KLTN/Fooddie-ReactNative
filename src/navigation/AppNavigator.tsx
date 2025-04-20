// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IntroScreen from '../screens/IntroScreen';
import PhoneInputScreen from '../screens/PhoneInputScreen';
import LoginWithPassword from '../screens/LoginWithPassword';
import CreateAccount from '../screens/CreateAccount';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Onboarding / Intro */}
      <Stack.Screen name="Intro" component={IntroScreen} />
      
      {/* Authentication Flow */}
      <Stack.Screen name="PhoneInput" component={PhoneInputScreen} />
      <Stack.Screen name="LoginWithPassword" component={LoginWithPassword} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      
      {/* Main App */}
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
