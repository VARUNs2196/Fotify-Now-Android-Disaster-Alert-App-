import React, { useState, useEffect, useRef } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Animated
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { auth, signInWithEmailAndPassword, signInAnonymously, signInWithCredential, GoogleAuthProvider } from "../context/firebase";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "176749528143-va1ip6fgemdnu61e6sfj4hamh51tmlqm.apps.googleusercontent.com",
        expoClientId: "176749528143-t2h48rjpesg49vdb7aaoortd8c94b22k.apps.googleusercontent.com",
    });

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

    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.authentication;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(() => {
                    navigation.navigate("DisplayScreen");
                })
                .catch(() => {
                    setErrorMessage("Google login failed.");
                });
        }
    }, [response]);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setErrorMessage("");
            navigation.navigate("DisplayScreen");
        } catch (error) {
            setErrorMessage("Wrong email or password");
        }
    };

    const handleGuestLogin = async () => {
        try {
            const res = await signInAnonymously(auth);
            const uid = res.user.uid; // Firebase UID is always unique
            const guestName = "Guest_" + uid.slice(0, 6);
            console.log(guestName);
            navigation.navigate("DisplayScreen", { user: guestName });
        } catch (error) {
            setErrorMessage("Guest login failed.");
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
                    Welcome Back
                </Animated.Text>
            </View>

            <View style={styles.inputContainer}>
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
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleGuestLogin}>
                <Text style={styles.buttonText}>Continue as Guest</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
                <Text style={styles.buttonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <Text style={styles.infoText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.linkText}>Sign Up</Text>
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
