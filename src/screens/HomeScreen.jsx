import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { auth } from "../context/firebase";
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation, route }) => {
  const [displayName, setDisplayName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      
      if (route?.params?.user) {
        setDisplayName(route.params.user);
        setLoading(false);
        return;
      }

   
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        setDisplayName(user.displayName || "User");
      }

      setLoading(false);
    };

    loadUser();
  }, [route?.params]);

  if (loading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" color="#00AEEF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Welcome, {displayName}!
      </Text>

      <Text style={{ marginVertical: 10 }}>Home Screen</Text>
      <Button title="Go to Explore" onPress={() => navigation.navigate('Explore')} />
    </SafeAreaView>
  );
};

export default HomeScreen;
