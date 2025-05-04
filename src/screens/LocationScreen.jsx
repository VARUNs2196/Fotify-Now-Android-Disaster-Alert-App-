import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { OPENWEATHER_API_KEY ,NEWS_API_KEY} from '@env';

const LocationScreen = ({ route, navigation }) => {
    const location = route?.params?.location || "Unknown";
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        const data = await response.json();
        if (data.cod !== 200) throw new Error("Weather data not available");
        setWeather({
          temperature: data.main.temp,
          humidity: data.main.humidity,
          condition: data.weather[0].main,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        });
      } catch (error) {
        console.error("Error fetching weather:", error.message);
      }
    };

    const fetchNews = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(location)}&from=${oneWeekAgo}&to=${today}&apiKey=${NEWS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        setNews(data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    fetchNews();
  }, [location]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#00AEEF" />
        </TouchableOpacity>
        <Text style={styles.title}>Location: {location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weather of {location}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="gray" />
        ) : weather ? (
          <View style={styles.weatherCard}>
            <Text style={styles.weatherTemperature}>{weather.temperature}°C</Text>
            <Text style={styles.weatherCondition}>{weather.condition}</Text>
            <Text style={styles.weatherHumidity}>Humidity: {weather.humidity}%</Text>
            <Image source={{ uri: weather.icon }} style={styles.weatherIcon} />
          </View>
        ) : (
          <Text style={styles.errorText}>Failed to load weather data</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>News of {location}</Text>
        {news.map((article, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => Linking.openURL(article.url)}
            style={styles.newsCard}
          >
            {article.urlToImage && (
              <Image source={{ uri: article.urlToImage }} style={styles.newsImage} />
            )}
            <Text style={styles.newsTitle}>{article.title}</Text>
            <Text style={styles.newsDescription} numberOfLines={3}>
              {article.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00AEEF",
    marginLeft: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  weatherCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  weatherTemperature: {
    fontSize: 35,
    fontWeight: "bold",
  },
  weatherCondition: {
    fontSize: 22,
    color: "gray",
  },
  weatherHumidity: {
    fontSize: 22,
    color: "gray",
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  newsCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  newsDescription: {
    fontSize: 14,
    color: "#555",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default LocationScreen;
