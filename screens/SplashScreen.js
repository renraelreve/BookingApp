// SplashScreen.js
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookie</Text>
      <ActivityIndicator size="large" color="#333333" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCEEF9",
  },
  title: {
    fontSize: 48,
    fontFamily: "Satisfy_400Regular", 
    color: "#333333",
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});