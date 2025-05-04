import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const FloodInfo = ({navigation}) => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Display")}>
                    <FontAwesome name="home" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Floods</Text>
            </View>

            <Text style={styles.title}>What is a flood?</Text>
            <Text style={styles.text}>
                A flood is when water overflows onto land that is normally dry. Floods can be caused by heavy rains, snowmelt, or storm surges. They can happen in rivers, streams, lakes, canals, reservoirs, and dams.
            </Text>
            <Image source={require("../../assets/images/flood1.png")} style={styles.image} />

            <Text style={styles.title}>Causes</Text>
            <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Heavy rain:</Text> When it rains heavily, the ground can't absorb all the water, causing it to overflow.</Text>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Snowmelt:</Text> When snow melts quickly, it can cause flooding.</Text>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Storm surges:</Text> When a tropical cyclone or tsunami causes a storm surge, it can flood coastal areas.</Text>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Broken dams or levees:</Text> When dams or levees break, water can escape and flood the surrounding area.</Text>
            </View>
            <Image source={require("../../assets/images/flood2.png")} style={styles.image} />

            <Text style={styles.title}>Precautions</Text>
            <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Find shelter:</Text> If there is a flood warning, find a safe place to go immediately.</Text>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Avoid floodwaters:</Text> Do not walk, swim, or drive through floodwaters. Even six inches of moving water can knock you down.</Text>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Stay calm:</Text> Stay calm and don't panic.</Text>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Evacuate:</Text> If told to do so, evacuate and move to higher ground or a higher floor.</Text>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Protect your property:</Text> Raise furniture and appliances, and move valuables to higher floors.</Text>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Protect your animals:</Text> Keep animals in a shed and ensure their safety.</Text>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Protect your health:</Text> Wash contaminated areas with soap and water or an alcohol-based sanitizer. Wash clothes contaminated with flood water in hot water and detergent.</Text>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Check the water supply:</Text> Before drinking water, find out if it is safe to drink.</Text>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Drive carefully:</Text> Driving is especially hazardous after a flood.</Text>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Only return home when instructed:</Text> Only return home after authorities have told you to do so.</Text>
                <Text style={styles.bullet}>• <Text style={styles.bulletText}>Don't enter flooded buildings:</Text> Avoid entering buildings surrounded by flood waters.</Text>
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
        marginBottom: 10,
    },
    headerText: {
        fontSize: 25,
        fontWeight: "bold",
        marginLeft: 10,
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginVertical: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: "5%",
        marginBottom: "2%"
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
    bulletContainer: {
        marginTop: 10,
    },
    bullet: {
        fontSize: 16,
        marginBottom: 5,
    },
    bulletText: {
        fontWeight: "bold",
    },
});

export default FloodInfo;
