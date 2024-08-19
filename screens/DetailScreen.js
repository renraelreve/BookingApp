import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native";

function DetailScreen({ route }) {
  const { event } = route.params;
  const [selectedShowtime, setSelectedShowtime] = useState(null); // Track selected showtime
  const [seats, setSeats] = useState(""); // Track number of seats to book

  const handleBookNow = (showtime) => {
    setSelectedShowtime(showtime.sid); // Set the selected showtime to show the TextInput and hide the "Book Now" button
  };

  const handleConfirmBooking = (showtime) => {
    // Handle the booking logic here
    Alert.alert(
      "Booking Confirmed",
      `You have booked ${seats} seat(s) for the showtime on ${showtime.date}`
    );
    // Optionally, reset the state or navigate away after booking
    setSeats("");
    setSelectedShowtime(null);
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
          <View style={styles.buttonContainer}>
            {selectedShowtime !== show.sid ? (
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => handleBookNow(show)}
              >
                <Text style={styles.buttonText}>Book Now</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.inputAndButtonContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Seats"
                  keyboardType="numeric"
                  value={seats}
                  onChangeText={setSeats}
                />
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => handleConfirmBooking(show)}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
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
    justifyContent: "space-between", // Space between info and button/input
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
  buttonContainer: {
    flexDirection: "row-reverse", // Align the elements to the right
    alignItems: "center",
  },
  smallButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10, // Add space between buttons
  },
  inputAndButtonContainer: {
    alignItems: "center", // Center the confirm button below the input
  },
  input: {
    width: 60, // Smaller input width
    padding: 5,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10, // Space between input and confirm button
  },
  confirmButton: {
    backgroundColor: "#28a745",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 12, // Make text smaller
  },
});
