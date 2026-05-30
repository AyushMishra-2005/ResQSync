import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import MainLayout from '../layouts/MainLayout';

const SmsLogsScreen = () => {
  const isDarkMode =
      useColorScheme() === 'dark';
  return (
    <MainLayout>
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: isDarkMode ? '#FFFFFF' : '#000000',
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          SMS Log Screen
        </Text>
      </View>
    </MainLayout>
  );
};

export default SmsLogsScreen;