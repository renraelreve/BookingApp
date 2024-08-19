import React from "react";
import { View, Text, StyleSheet } from "react-native";

function DetailScreen({ route }) {
  const { event } = route.params; // Retrieve the passed event

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.description}</Text>
      <Text>Event ID: {event.eid}</Text>
      {/* Display more event details as needed */}
    </View>
  );
}

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
