import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/login'
import SignUpScreen from '../screens/signup'
import DisplayScreen from '../screens/DisplayScreen'
import AlertScreen from '../screens/AlertScreen'
import LocationScreen from '../screens/LocationScreen'
import LocationScreen1 from '../screens/LocationScreen1'
import WelcomeScreen from '../screens/landing'
import EarthquakeInfo from '../screens/Earthquake'
import EmergencyInstructions from '../screens/EmergencyInstructions'
import { registerBackgroundTask } from '../services/backgroundSync';
import NewsDetailScreen from '../components/NewsDetailScreen';
import TestNotificationScreen from '../screens/testNotificationScreen'
import FloodInfo from '../screens/Flood'

const Stack = createStackNavigator();

export default function AppNavigator() {
  useEffect(() => {
    
    registerBackgroundTask();
  }, []);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DisplayScreen" component={DisplayScreen} />
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="FloodInfo" component={FloodInfo} />
      <Stack.Screen name="NotificationTest" component={TestNotificationScreen} />
      <Stack.Screen name="LocationScreen1" component={LocationScreen1} />
      <Stack.Screen name="NewsDetail" component={NewsDetailScreen} options={{ title: 'News Details' }}/>
      <Stack.Screen name="EmergencyInstructions" component={EmergencyInstructions} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EarthquakeInfo" component={EarthquakeInfo} />
      <Stack.Screen name="Signup" component={SignUpScreen} />
      <Stack.Screen name="AlertScreen" component={AlertScreen} />
      <Stack.Screen name="LocationScreen" component={LocationScreen} />
    </Stack.Navigator>
  );
}
