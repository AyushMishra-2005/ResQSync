import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

export default function BottomNavbar() {
  const navigation = useNavigation();
  const route = useRoute();

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? '#1E1E1E'
            : '#FFFFFF',
        },
      ]}
    >
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Home')}
      >
        <Text
          style={[
            styles.icon,
            route.name === 'Home'
              ? styles.active
              : styles.inactive,
          ]}
        >
          🏠
        </Text>

        <Text
          style={[
            styles.label,
            route.name === 'Home'
              ? styles.active
              : styles.inactive,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('SMS Logs')}
      >
        <Text
          style={[
            styles.icon,
            route.name === 'SMS Logs'
              ? styles.active
              : styles.inactive,
          ]}
        >
          📨
        </Text>

        <Text
          style={[
            styles.label,
            route.name === 'SMS Logs'
              ? styles.active
              : styles.inactive,
          ]}
        >
          Logs
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text
          style={[
            styles.icon,
            route.name === 'Settings'
              ? styles.active
              : styles.inactive,
          ]}
        >
          ⚙️
        </Text>

        <Text
          style={[
            styles.label,
            route.name === 'Settings'
              ? styles.active
              : styles.inactive,
          ]}
        >
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },

  tab: {
    alignItems: 'center',
  },

  icon: {
    fontSize: 24,
    marginBottom: 2,
  },

  label: {
    fontSize: 12,
    fontWeight: '500',
  },

  active: {
    color: '#007AFF',
  },

  inactive: {
    color: '#888888',
  },
});