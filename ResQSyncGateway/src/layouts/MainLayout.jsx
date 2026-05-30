import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNavbar from '../components/BottomNavbar';

export default function MainLayout({children}) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>

      <BottomNavbar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
});