import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

export default function BottomNavbar() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Home */}
        <TouchableOpacity
          style={[
            styles.tab,
            route.name === 'Home' && styles.activeTab,
          ]}
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

        {/* Logs */}
        <TouchableOpacity
          style={[
            styles.tab,
            route.name === 'SMS Logs' &&
              styles.activeTab,
          ]}
          onPress={() =>
            navigation.navigate('SMS Logs')
          }
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

        {/* Settings */}
        <TouchableOpacity
          style={[
            styles.tab,
            route.name === 'Settings' &&
              styles.activeTab,
          ]}
          onPress={() =>
            navigation.navigate('Settings')
          }
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
  },

  container: {
    height: 78,

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    backgroundColor: 'rgba(15,23,42,0.95)',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',

    shadowColor: '#00C6FF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,

    elevation: 12,
  },

  tab: {
    flex: 1,
    height: '100%',

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 18,
    marginHorizontal: 4,
  },

  activeTab: {
    backgroundColor: 'rgba(0,198,255,0.12)',
  },

  icon: {
    fontSize: 24,
    marginBottom: 4,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  active: {
    color: '#00C6FF',
  },

  inactive: {
    color: '#64748B',
  },
});