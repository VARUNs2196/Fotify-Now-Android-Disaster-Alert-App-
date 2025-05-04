import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
const EarthquakeInfo = ({navigation}) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
                <View style={styles.header}>
                    <TouchableOpacity
                              onPress={() => navigation.navigate("DisplayScreen")} 
                              style={styles.alertCard}
                            ><FontAwesome name="home" size={24} color="black" /></TouchableOpacity>
                    
                    <Text style={styles.headerText}>Earthquake</Text>
                </View>

                <Text style={styles.title}>What is an earthquake?</Text>
                <Text style={styles.text}>
                    An earthquake is a sudden and violent shaking of the ground caused by the
                    release of energy in the Earth's crust.
                </Text>
                <Image source={require("../../assets/images/earthquake1.png")} style={styles.image} />

                <Text style={styles.title}>Why it is caused?</Text>
                <Text style={styles.text}>
                    Earthquakes happen when the Earth's tectonic plates move suddenly along a
                    fault, releasing stored energy. This movement causes the ground to shake,
                    which is what we feel during an earthquake.
                </Text>
                <Image source={require("../../assets/images/earthquake2.png")} style={styles.image} />

                <Text style={styles.title}>Precautions</Text>
                <View style={styles.bulletContainer}>
                    <Text style={styles.bullet}>• <Text style={styles.bulletText}>Drop:</Text> Get down on your hands and knees before the shaking starts.</Text>
                    <Text style={styles.bullet}>• <Text style={styles.bulletText}>Cover:</Text> Get under a sturdy table, desk, or bed.</Text>
                    <Text style={styles.bullet}>• <Text style={styles.bulletText}>Hold on:</Text> Stay put until the shaking stops.</Text>
                    <Text style={styles.bullet}>• <Text style={styles.bulletText}>If in bed:</Text> Stay in bed and cover your head and neck with a pillow.</Text>
                    <Text style={styles.bullet}>• <Text style={styles.bulletText}>If outdoors:</Text> Crawl to an open space, stay away from buildings.</Text>
                    <Text style={styles.bullet}>• <Text style={styles.bulletText}>If driving:</Text> Pull over and stay in your car.</Text>
                    <Text style={styles.bullet}>• <Text style={styles.bulletText}>If using a wheelchair:</Text> Lock your wheels and stay seated.</Text>
                    <Text style={styles.bullet}>• <Text style={styles.bulletText}>Avoid elevators and open flames.</Text></Text>
                </View>
            </ScrollView>
        </SafeAreaView>
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
        fontSize: 20,
        marginBottom: 5,
    },
    bulletText: {
        fontWeight: "bold",
    },
});

export default EarthquakeInfo;
