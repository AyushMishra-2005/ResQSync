import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import SmsLogsScreen from '../screens/SmsLogsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,

          // Smooth transition
          animation: 'fade',

          // Optional: smoother feel
          animationDuration: 250,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="SMS Logs"
          component={SmsLogsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}