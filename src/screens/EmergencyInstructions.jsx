import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@emergency_instructions";

const EmergencyInstructions = () => {
  const [text, setText] = useState("");
  const [instructions, setInstructions] = useState([]);

  useEffect(() => {
    loadInstructions();
  }, []);

  useEffect(() => {
    saveInstructions();
  }, [instructions]);

  const loadInstructions = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data !== null) {
        setInstructions(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to load instructions", error);
    }
  };

  const saveInstructions = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(instructions));
    } catch (error) {
      console.error("Failed to save instructions", error);
    }
  };

  const addInstruction = () => {
    if (!text.trim()) return;
    const newInstruction = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false
    };
    setInstructions((prev) => [...prev, newInstruction]);
    setText("");
  };

  const toggleInstruction = (id) => {
    setInstructions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteInstruction = (id) => {
    setInstructions((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🛟 Emergency Instructions</Text>
  
        <TextInput
          style={styles.input}
          placeholder="Add a new instruction..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addInstruction}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.buttonText}> Add </Text>
        </TouchableOpacity>
  
        {instructions.map(({ id, text, completed }) => (
          <View key={id} style={styles.card}>
            <Checkbox
              value={completed}
              onValueChange={() => toggleInstruction(id)}
            />
            <Text style={[styles.instructionText, completed && styles.completed]}>
              {text}
            </Text>
            <TouchableOpacity onPress={() => deleteInstruction(id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9"
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff"
  },
  addButton: {
    backgroundColor: "#28a745",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20
  },
  buttonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#888"
  }
});

export default EmergencyInstructions;
