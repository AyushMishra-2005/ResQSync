import { NativeModules } from 'react-native';

const { ForegroundModule } = NativeModules;

export const startForegroundService = () => {
  ForegroundModule.startService();
};

export const stopForegroundService = () => {
  ForegroundModule.stopService();
};