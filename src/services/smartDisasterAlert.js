import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { getDistance } from 'geolib';
import { fetchLocationDisasters, getCityNameFromCoords } from './dataService';
import { useError } from '../context/ErrorContext';

const RED_ALERT_RADIUS = 50000; 
const YELLOW_ALERT_RADIUS = 150000; 


const configureNotifications = async () => {
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};


export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Location permission denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeout: 10000,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
    };
  } catch (error) {
    console.error('Location error:', error);
    return null;
  }
};


const sendNotification = async (title, body, category = 'alert') => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      categoryIdentifier: category,
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null,
  });
};


export const checkDisasterAlerts = async (showError) => {
  try {
    const userLocation = await getCurrentLocation();
    if (!userLocation) {
      if (showError) {
        showError('Location permission denied or unavailable');
      }
      return { alerts: [], status: 'location_error' };
    }

    
    const cityName = await getCityNameFromCoords(
      userLocation.latitude,
      userLocation.longitude
    );

    
    const { genuineReports: disasters } = await fetchLocationDisasters(cityName || 'global');
    // TEMP: Fake test disaster 10km from your location
// const fakeNearbyDisaster = {
//   title: '🚨 Test Fire (Manual)',
//   coordinates: {
//     latitude: userLocation.latitude + 0.01, // ~10km north
//     longitude: userLocation.longitude,
//   },
//   isLocationRelevant: true
// };

// // Inject it into the fetched disaster array
// const disasters = [fakeNearbyDisaster]; // override real fetch for testing


    
    const alerts = {
      red: [],    
      yellow: [], 
      info: []    
    };

    for (const disaster of disasters) {
      if (!disaster.coordinates) continue;

      const distance = getDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        disaster.coordinates
      );

      if (distance <= RED_ALERT_RADIUS) {
        alerts.red.push(disaster);
      } else if (distance <= YELLOW_ALERT_RADIUS) {
        alerts.yellow.push(disaster);
      } else if (disaster.isLocationRelevant) {
        alerts.info.push(disaster);
      }
    }

    // Send notifications for top alerts
    if (alerts.red.length > 0) {
      const alert = alerts.red[0];
      const distance = Math.round(alert.distance / 1000);
      const message = `${alert.title}. Distance: ${distance}km`;
      
      await sendNotification(
        '🚨 IMMEDIATE DANGER ALERT',
        message,
        'emergency'
      );
      
      if (showError) {
        showError(`🚨 EMERGENCY: ${message}`);
      }
    } else if (alerts.yellow.length > 0) {
      const alert = alerts.yellow[0];
      const message = `${alert.title} is nearby`;
      
      await sendNotification(
        '⚠️ Nearby Disaster Alert',
        message,
        'warning'
      );
      
      if (showError) {
        showError(`⚠️ WARNING: ${message}`);
      }
    }

    return {
      alerts,
      location: userLocation,
      city: cityName,
      status: 'success',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Alert check failed:', error);
    if (showError) {
      showError('Failed to check for disaster alerts');
    }
    return { alerts: [], status: 'error' };
  }
};


export const backgroundAlertCheck = async (showError = null) => {
  try {
    const result = await checkDisasterAlerts(showError);
    if (result.alerts.red.length > 0 || result.alerts.yellow.length > 0) {
      return { success: true, newData: true };
    }
    return { success: true, newData: false };
  } catch (error) {
    if (showError) {
      showError('Background alert check failed');
    }
    return { success: false, error: error.message };
  }
};