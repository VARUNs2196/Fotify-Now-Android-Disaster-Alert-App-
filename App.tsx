import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigation';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ErrorProvider } from './src/context//ErrorContext';
import NotificationHandler from './src/components/NotificationHandler';

export default function App() {
  useEffect(() => {
    // Configure notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Android-specific channel configuration
    const setupAndroid = async () => {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        // sound: true,
      });
    };

    // Request permissions
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('You need to enable notifications for alerts to work');
      }
      if (Platform.OS === 'android') {
        await setupAndroid();
      }
    };

    setupNotifications();
  }, []);

  return (
    <ErrorProvider>
      <NavigationContainer>
        <NotificationHandler />
        <AppNavigator />
      </NavigationContainer>
    </ErrorProvider>
  );
}