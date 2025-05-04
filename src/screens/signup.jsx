import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  auth,
} from "../context/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
  
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });
  
      
      await auth.currentUser.reload();
  
      
      const displayName = auth.currentUser.displayName;
  
      setErrorMessage("");
      navigation.navigate("Home", { user: displayName });
    } catch (error) {
      setErrorMessage("Signup failed. " + error.message);
    }
  };
  

  return (
    <LinearGradient colors={["#A9DDF6", "#D4F1F9"]} style={styles.container}>
      <View style={styles.header}>
        <Animated.Text
          style={[
            styles.title,
            { transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] },
          ]}
        >
          Create Account
        </Animated.Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>Already have an account?</Text>
      <TouchableOpacity onPress={() => navigation.navigate("login")}>
        <Text style={styles.linkText}>Log In</Text>
      </TouchableOpacity>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#00AEEF",
    textShadowColor: "#005A8D",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
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
  infoText: {
    fontSize: 16,
    color: "#000",
    marginTop: 10,
  },
  linkText: {
    fontSize: 16,
    color: "#00AEEF",
    fontWeight: "bold",
    marginTop: 5,
  },
});
