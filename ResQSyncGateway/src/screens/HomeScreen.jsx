import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import MainLayout from '../layouts/MainLayout';

export default function HomeScreen() {
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = () => {
    setIsRunning(true);
  };

  return (
    <MainLayout>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={require('../assets/images/resqsync-bg.jpg')}
        style={styles.background}
      >
        <View style={styles.overlay}>

          {/* Top Glow */}
          <View style={styles.glowCircle} />

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>📡</Text>
          </View>

          <Text style={styles.title}>ResQSync</Text>

          <Text style={styles.subtitle}>
            Intelligent SMS Emergency Gateway
          </Text>

          {/* Glass Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Gateway Status
            </Text>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isRunning
                      ? '#00FF9D'
                      : '#FF4D6D',
                  },
                ]}
              />

              <Text style={styles.statusText}>
                {isRunning
                  ? 'ACTIVE'
                  : 'OFFLINE'}
              </Text>
            </View>

            <Text style={styles.description}>
              Monitors incoming SMS messages and forwards
              ResQSync emergency alerts to the disaster
              management backend in real-time.
            </Text>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={isRunning}
            onPress={handleStart}
            style={{ width: '100%' }}
          >
            <LinearGradient
              colors={
                isRunning
                  ? ['#00C853', '#00E676']
                  : ['#007AFF', '#00C6FF']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {isRunning
                  ? 'MONITORING ACTIVE'
                  : 'START MONITORING'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Secure • Reliable • Real-Time
            </Text>
          </View>

        </View>
      </ImageBackground>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5,10,25,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  glowCircle: {
    position: 'absolute',
    top: 120,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(0,122,255,0.15)',
  },

  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 25,
  },

  logo: {
    fontSize: 60,
  },

  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },

  subtitle: {
    color: '#A0AEC0',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 40,
    letterSpacing: 1,
  },

  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 35,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 18,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },

  statusText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1,
  },

  description: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 24,
  },

  button: {
    height: 62,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },

  footer: {
    position: 'absolute',
    bottom: 40,
  },

  footerText: {
    color: '#94A3B8',
    fontSize: 14,
    letterSpacing: 1,
  },
});