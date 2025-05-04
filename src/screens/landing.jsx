import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: -20,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={["#A9DDF6", "#D4F1F9"]} style={styles.container}>
      <View style={styles.header}>
        <Animated.Text
          style={[
            styles.title,
            {
              transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            },
          ]}
        >
          Hello User
        </Animated.Text>
        <Animated.Text
          style={[
            styles.subtitle,
            {
              transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            },
          ]}
        >
          Welcome!
        </Animated.Text>
      </View>

      <Text style={styles.infoText}>Already Registered? Log in here.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("login")}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>New User, Please Sign Up</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Built on innovation and driven by purpose, we deliver critical warnings before disaster strikes. Elevate your preparedness—because safety is not just a choice, it's a necessity.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: "20%",
    marginTop:"-20%"
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#00AEEF",
    textShadowColor: "#005A8D", 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#00AEEF",
    textShadowColor: "#005A8D",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  infoText: {
    fontSize: 16,
    color: "#000",
    marginTop: 10,
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
});
