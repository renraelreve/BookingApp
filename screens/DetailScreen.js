import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { Image } from "react-native";

function DetailScreen({ route }) {
  const { event } = route.params;

  const handleBookSeats = (showtime) => {
    // Implement booking logic here
    Alert.alert(
      "Booking",
      `You have booked seats for showtime on ${showtime.date}`
    );
    // You can navigate, call an API, or update the state here
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{event.description}</Text>
      <Image source={{ uri: event.imageUrl }} style={styles.image} />
      <Text style={styles.header}>Showtimes:</Text>
      {event.showtime.map((show, index) => (
        <View key={index} style={styles.showtimeContainer}>
          <View style={styles.showtimeInfo}>
            <Text style={styles.showtimeText}>Date: {show.date}</Text>
            <Text style={styles.showtimeText}>
              Total Seats: {show.totalSeats}
            </Text>
            <Text style={styles.showtimeText}>
              Available Seats: {show.balSeats}
            </Text>
          </View>
          <Button title="Book Now" onPress={() => handleBookSeats(show)} />
        </View>
      ))}
    </ScrollView>
  );
}

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  showtimeContainer: {
    flexDirection: "row", // Arrange items in a row
    justifyContent: "space-between", // Space between info and button
    alignItems: "center", // Align items vertically centered
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  showtimeInfo: {
    flex: 1, // Allow info to take up the remaining space
  },
  showtimeText: {
    fontSize: 16,
    marginBottom: 2,
  },
});
