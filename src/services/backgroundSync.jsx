import * as TaskManager from 'expo-task-manager';
import {
  registerTaskAsync,
  unregisterTaskAsync,
  getStatusAsync,
  BackgroundFetchResult,
} from 'expo-background-fetch'; 

import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { backgroundAlertCheck } from './smartDisasterAlert';
import { fetchGlobalDisasters } from './dataService';


const BACKGROUND_TASK_NAME = 'disaster-alert-sync';

// Define the background task
// backgroundsync.jsx
// TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
//   try {
//     console.log('Running background disaster check...');

//     const { status } = await Location.getBackgroundPermissionsAsync();
//     if (status !== 'granted') {
//       console.log('Background location permission not granted');
//       return BackgroundFetchResult.NO_DATA;
//     }

//     // Pass null since we can't use showError here
//     const result = await backgroundAlertCheck(null);
    
//     if (!result || !result.success) {
//       console.warn('Background alert check failed', result?.error);
//       return BackgroundFetchResult.FAILED;
//     }

//     if (!result.newData) {
//       const globalData = await fetchGlobalDisasters();
//       if (globalData.allReports.length > 0) {
//         await Notifications.scheduleNotificationAsync({
//           content: {
//             title: 'Global Disaster Update',
//             body: `${globalData.allReports.length} new disaster reports worldwide`,
//           },
//           trigger: null,
//         });
//         return BackgroundFetchResult.NEW_DATA;
//       }
//     }

//     return result.newData
//       ? BackgroundFetchResult.NEW_DATA
//       : BackgroundFetchResult.NO_DATA;

//   } catch (error) {
//     console.error('Background task error:', error);
//     return BackgroundFetchResult.FAILED;
//   }
// });

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    console.log('Running background disaster check...');

    const { status } = await Location.getBackgroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Background location permission not granted');
      return BackgroundFetchResult.NO_DATA;
    }

    
    const result = await backgroundAlertCheck(null);
    
    if (!result || !result.success) {
      console.warn('Background alert check failed', result?.error);
      return BackgroundFetchResult.FAILED;
    }

    
    if (result.danger) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Danger Alert!',
          body: 'A potential disaster has been detected in your area',
        },
        trigger: null,
      });
      return BackgroundFetchResult.NEW_DATA;
    }

 
    return BackgroundFetchResult.NO_DATA;

  } catch (error) {
    console.error('Background task error:', error);
    return BackgroundFetchResult.FAILED;
  }
});

export const registerBackgroundTask = async () => {
  try {
    await Notifications.requestPermissionsAsync();
    await Location.requestBackgroundPermissionsAsync();

    await registerTaskAsync(BACKGROUND_TASK_NAME, {
      minimumInterval: 10 * 60, 
      stopOnTerminate: false,
      startOnBoot: true,
    });

    console.log('Background task registered');
    return true;
  } catch (error) {
    console.error('Failed to register background task:', error);
    return false;
  }
};


export const unregisterBackgroundTask = async () => {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK_NAME);
    console.log('Background task unregistered');
    return true;
  } catch (error) {
    console.error('Failed to unregister background task:', error);
    return false;
  }
};


export const checkTaskStatus = async () => {
  const status = await BackgroundFetch.getStatusAsync();
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
  return { status, isRegistered };
};