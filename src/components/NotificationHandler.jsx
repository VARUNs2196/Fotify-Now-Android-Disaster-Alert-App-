// components/NotificationHandler.jsx
import { useEffect } from 'react';
import { useError } from '../context/ErrorContext';
import * as Notifications from 'expo-notifications';

export default function NotificationHandler() {
  const { showError } = useError();

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      if (notification.request.content.title && notification.request.content.body) {
        showError(`${notification.request.content.title}: ${notification.request.content.body}`);
      }
    });

    return () => subscription.remove();
  }, [showError]);

  return null;
}