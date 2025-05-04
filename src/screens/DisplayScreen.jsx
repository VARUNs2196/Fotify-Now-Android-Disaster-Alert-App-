import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  SafeAreaView,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { OPENWEATHER_API_KEY } from "@env";
import { LinearGradient } from 'expo-linear-gradient';
import fetchData, { fetchGlobalDisasters } from "../services/dataService"; 

const { width } = Dimensions.get("window");
const CITY_NAME = "Delhi";
import { checkDisasterAlerts } from '../services/smartDisasterAlert';


export default function DisplayScreen({ navigation }) {
  const [globalnews, setGlobalNews] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnimation, {
      toValue: menuVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const menuTranslate = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  useEffect(() => {
    const loadGlobalNews = async () => {
      try {
        const result = await fetchGlobalDisasters(); 
        if (!result || !result.allReports) {
          throw new Error("No global news data found");
        }
       
        setGlobalNews(result.allReports);

        setError(false);
      } catch (err) {
        console.error("Error fetching global news:", err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const loadWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        const data = await response.json();
        if (data.cod !== 200) throw new Error("Weather data not available");
        setWeather({
          temperature: data.main.temp,
          humidity: data.main.humidity,
          condition: data.weather[0].main,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        });
      } catch (err) {
        console.error("Error fetching weather:", err.message);
      }
    };

    loadGlobalNews();
    loadWeather();
  }, []);

  
  useEffect(() => {
    if (!globalnews || globalnews.length === 0) return;
    let index = 0;

    const interval = setInterval(() => {
      if (flatListRef.current && globalnews.length > 0) {
        index = (index + 1) % globalnews.length;
        flatListRef.current.scrollToIndex({ index, animated: true });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [globalnews]);
  const testNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "TEST",
          body: "This is a simple notification test!",
          sound: true,
          priority: 'high'
        },
        trigger: null 
      });
      Alert.alert('Success', 'Notification sent!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  const renderNewsCard = ({ item }) => {

    return (
      <TouchableOpacity
        style={styles.newsCard}
        onPress={() => Linking.openURL(item.url)}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.newsImage} />
        ) : (
          <View style={[styles.newsImage, { justifyContent: "center", alignItems: "center", backgroundColor: "#ccc" }]}>
            <Text style={{ color: "#666" }}>No Image</Text>
          </View>
        )}
        <View style={styles.newsContent}>
          <Text style={styles.newsTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {item?.source && (
            <Text style={styles.newsSource}>
              {item.source}
            </Text>
          )}
          {item.date && (
            <Text style={styles.newsDate}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          )}
          <Text style={styles.newsSource} numberOfLines={5}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };



  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#000000" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>

          {/* Top Navigation Bar */}
          <LinearGradient
            colors={['#8B0000', '#DC143C']}
            style={styles.navBar}
            start={{ x: 0, y: 0 }}
            end={{ x: 2, y: 0 }}
          >
            <TouchableOpacity onPress={toggleMenu}>
              <MaterialIcons name="menu" size={28} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.navIcons}>
              <TouchableOpacity onPress={() => navigation.navigate("LocationScreen1", { location: "New York" })}>
                <MaterialIcons name="search" size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("AlertScreen")}>
                <MaterialIcons name="notifications" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Dropdown Menu */}
          {menuVisible && (
            <Animated.View
              style={[
                styles.menuDropdown,
                {
                  opacity: menuAnimation,
                  transform: [{ translateY: menuTranslate }],
                },
              ]}
            >
              <TouchableOpacity style={styles.menuItem} onPress={() => {
                setMenuVisible(false);
                navigation.navigate("EmergencyInstructions");
              }}>
                <Entypo name="warning" size={18} color="#fff" />
                <Text style={styles.menuItemText}> Emergency Instructions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => {
                setMenuVisible(false);
                navigation.navigate("LocationScreen");
              }}>
                <MaterialIcons name="place" size={18} color="#fff" />
                <Text style={styles.menuItemText}> Search Location</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => {
                setMenuVisible(false);
                navigation.navigate("AlertScreen");
              }}>
                <FontAwesome5 name="bell" size={16} color="#fff" />
                <Text style={styles.menuItemText}> Alerts</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Quote Section */}
          <View style={styles.quoteContainer}>
            <View style={styles.quoteRow}>
              <Text style={styles.quoteMark}>“</Text>
              <View style={styles.quoteLine} />
            </View>
            <Text style={styles.quote}>
              Disaster Strikes Fast;{"\n"}We Keep You Faster.
            </Text>
            <View style={styles.quoteRow}>
              <View style={styles.quoteLine} />
              <Text style={styles.quoteMark}>”</Text>
            </View>
          </View>

          {/* Weather Section */}
          {weather ? (
            <View style={styles.weatherCard}>
              <Text style={styles.weatherTemperature}>{weather.temperature}°C</Text>
              <Text style={styles.weatherCondition}>{weather.condition}</Text>
              <Text style={styles.weatherCondition}>Air Quality: {weather.humidity}</Text>
              <Image source={{ uri: weather.icon }} style={styles.weatherIcon} />
            </View>
          ) : (
            <ActivityIndicator size="large" color="gray" />
          )}

          {/* News Section */}
          <Text style={styles.sectionTitle1}>Geographical News</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <Text style={styles.errorText}>Failed to load news.</Text>
          ) : (
            <AnimatedFlatList
              ref={flatListRef}
              data={globalnews}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}
              renderItem={renderNewsCard}
              getItemLayout={(data, index) => ({
                length: width * 0.8 + 20, 
                offset: (width * 0.8 + 20) * index,
                index,
              })}
            />
          )}

          <Text style={styles.sectionTitle2}>Vigilant: Smarter Alerts, Safer Lives</Text>

         
          <View style={styles.alertCardsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("EarthquakeInfo")}
              style={styles.alertCard}
            >
              <ImageBackground
                source={require("../../assets/images/earthquake1.png")}
                style={styles.alertCardBackground}
                resizeMode="cover"
              >
                <View style={styles.overlay}>
                  <Text style={styles.alertCardTitle}>Earthquake Alert</Text>
                  <Text style={styles.alertCardDescription}>
                    Stay informed about seismic activities in your area.
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("FloodInfo")}
              style={styles.alertCard}
            >

              <ImageBackground
                source={require("../../assets/images/flood1.png")}
                style={styles.alertCardBackground}
                resizeMode="cover"
              >
                <View style={styles.overlay}>
                  <Text style={styles.alertCardTitle}>Flood Warning</Text>
                  <Text style={styles.alertCardDescription}>
                    Get real-time updates on flood risks and safety measures.
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

          </View>
          <View style={{ marginTop: 50 }}>
            <Button
              title="Test Notifications"
              onPress={() => navigation.navigate('NotificationTest')}
              color="#FF6347"
            /></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000", 
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: "5%",
  },
  navIcons: {
    flexDirection: "row",
    gap: 15,
  },
  menuDropdown: {
    position: "absolute",
    top: 80,
    left: 20,
    backgroundColor: "#7A0A0A",
    padding: 12,
    borderRadius: 10,
    zIndex: 10,
    width: 220,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#A52A2A",
    borderBottomWidth: 1,
  },
  menuItemText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  quoteContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  quoteRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    margin: 0,
  },
  quoteMark: {
    fontSize: 80,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  quoteLine: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    marginHorizontal: "6%",
    marginBottom: "18%",
  },
  quote: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: "-6%",
    marginTop: "-21%",
  },
  weatherCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginLeft: "10%",
    marginTop: "-15%",
    height: "17%",
    width: "80%",
  },
  weatherTemperature: {
    fontSize: 35,
    fontWeight: "bold",
    marginTop: "5%",
    marginLeft: "7%",
  },
  weatherCondition: {
    fontSize: 22,
    color: "gray",
    marginLeft: "8%",
  },
  weatherIcon: {
    width: 110,
    height: 110,
    position: "absolute",
    right: 10,
    top: 10,
  },
  sectionTitle1: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: "15%",
  },
  sectionTitle2: {
    fontSize: 16,
    fontWeight: "bold",
  },
  alertCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  alertCard: {
    width: "48%",
    borderRadius: 10,
    overflow: "hidden",
  },
  alertCardBackground: {
    width: "100%",
    height: 150,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  alertCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  alertCardDescription: {
    fontSize: 12,
    textAlign: "center",
    color: "#fff",
  },
  animatedCard: {
    width: width * 0.8,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  newsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    width: width * 0.8,
    marginHorizontal: 10,
    marginBottom: "25%",
    marginTop: "5%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    height: 330,
    elevation: 4,
    overflow: "hidden",
  },
  newsImage: {
    width: "100%",
    height: 150,
  },
  newsContent: {
    padding: 10,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 5,
  },
  newsSource: {
    fontSize: 13,
    color: "#888",
  },
  newsDate: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },

  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
