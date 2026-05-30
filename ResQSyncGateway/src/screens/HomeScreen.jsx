import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import MainLayout from '../layouts/MainLayout';

export default function HomeScreen() {
  const isDarkMode =
    useColorScheme() === 'dark';

  return (
    <MainLayout>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode
              ? '#121212'
              : '#FFFFFF',
          },
        ]}
      >
        <View style={styles.content}>
          <Text
            style={{
              color: isDarkMode
                ? '#FFFFFF'
                : '#000000',
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            ResQSync SMS Gateway
          </Text>
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});