import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, TextInput, Button } from 'react-native';
import * as Location from 'expo-location';
import fetchAllData, { getNearbyCities } from '../services/dataService';

const LocationScreen1 = () => {
  const [locationName, setLocationName] = useState('');
  const [inputCity, setInputCity] = useState('');
  const [nearbyCities, setNearbyCities] = useState([]);
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        setLoading(false);
        return;
      }


      const location = await Location.getCurrentPositionAsync({});
const geocode = await Location.reverseGeocodeAsync(location.coords);
const place = geocode[0];


let city = place?.city || place?.district || place?.region || place?.subregion || place?.country || 'Unknown';

if (city === 'Kharakhet') {
  city = 'Dehradun'; 
}

setLocationName(city);
fetchGenuineDisasterData(city);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to get location.');
    }
  };

  const fetchGenuineDisasterData = async (city) => {
    setLoading(true);
    try {
      const cities = await getNearbyCities(city);
      setNearbyCities(cities);

      if (cities.includes('Please enter a valid city name')) {
        Alert.alert('Invalid City', 'Please enter a valid city name.');
        setWeather(null);
        setNews([]);
        return;
      }

      const result = await fetchAllData(city);
      setLocationName(city);
      setWeather(result.allReports.find((r) => r.source === 'weather'));
      setNews(result.genuineReports);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>{item.source} • {new Date(item.date).toLocaleString()}</Text>
      {item.location && <Text style={styles.location}>📍 {item.location}</Text>}
      {item.description && <Text style={styles.description}>{item.description}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Disaster Alerts for {locationName}</Text>

      <TextInput
        style={styles.input}
        placeholder="Search city..."
        value={inputCity}
        onChangeText={setInputCity}
      />
      <Button title="Search" onPress={() => fetchGenuineDisasterData(inputCity)} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />}

      {!loading && weather && (
        <View style={styles.weatherCard}>
          <Text style={styles.weatherTitle}>{weather.title}</Text>
          <Text>{weather.description}</Text>
        </View>
      )}

      {!loading && (
        <>
          <Text style={styles.sectionTitle}>Nearby Cities:</Text>
          <Text style={styles.cities}>{nearbyCities.join(', ')}</Text>

          <Text style={styles.sectionTitle}>Verified News:</Text>
          <FlatList
            data={news}
            keyExtractor={(item, index) => item.url || index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.noNews}>No verified disaster news.</Text>}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10,marginTop:15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  },
  weatherCard: { backgroundColor: '#eef', padding: 10, borderRadius: 10, marginBottom: 10 },
  weatherTitle: { fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  cities: { marginBottom: 10 },
  card: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8, marginVertical: 5 },
  title: { fontSize: 16, fontWeight: 'bold' },
  meta: { fontSize: 12, color: '#888' },
  location: { fontSize: 12, color: '#333' },
  description: { marginTop: 5 },
  noNews: { fontStyle: 'italic', color: '#888', marginTop: 10 }
});

export default LocationScreen1;
