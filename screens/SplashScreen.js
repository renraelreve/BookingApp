import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book!e</Text>
      <Text style={styles.motto}>Your Gateway to Excitement</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#89CFF0", 
  },
  title: {
    fontSize: 65,
    fontFamily: "Satisfy_400Regular",
    color: "#333333",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.1)", 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  motto: {
    fontSize: 20,
    fontFamily: "Rubik_400Regular",
    color: "#555555",
    textAlign: "center",
    marginTop: 1,
    textShadowColor: "rgba(0, 0, 0, 0.1)", // Add a subtle shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});