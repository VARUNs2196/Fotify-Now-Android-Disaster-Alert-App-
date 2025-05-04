import { Button, View, Text, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function TestNotificationScreen() {
  const testNotification = async (type) => {
    const messages = {
      red: {
        title: "🚨 RED ALERT TEST",
        body: "Earthquake detected within 50km!"
      },
      yellow: {
        title: "⚠️ YELLOW ALERT TEST",
        body: "Wildfire reported within 150km"
      },
      info: {
        title: "ℹ️ TEST NOTIFICATION",
        body: "Regular alert system check"
      }
    };

    await Notifications.scheduleNotificationAsync({
      content: messages[type],
      trigger: null
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Test Center</Text>
      
      <Button 
        title="Test Red Alert" 
        onPress={() => testNotification('red')}
        color="red"
      />
      
      <View style={styles.spacer} />
      
      <Button 
        title="Test Yellow Alert" 
        onPress={() => testNotification('yellow')}
        color="orange"
      />
      
      <View style={styles.spacer} />
      
      <Button 
        title="Test Regular Notification" 
        onPress={() => testNotification('info')}
        color="blue"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
  },
  spacer: {
    height: 15
  }
});