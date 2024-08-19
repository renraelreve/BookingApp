import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  NativeEventEmitter,
  NativeModules,
} from "react-native";
import { Image } from "react-native";
import base64 from "react-native-base64";
import { bookingApi } from "../api/bookingApi";

function DetailScreen({ route }) {
  const { event } = route.params;
  const [updatedEvent, setUpdatedEvent] = useState(event); // Track updated event data
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [seats, setSeats] = useState("");

  const userId = 1;

  const username = "Abigail";
  const password = "password123";
  const token = base64.encode(`${username}:${password}`);

  const handleBookNow = (showtime) => {
    setSelectedShowtime(showtime.sid);
  };

  const handleBookingSubmit = async (sid) => {
    const amount = parseInt(seats, 10); // Parse seats as an integer
    if (amount) {
      try {
        const response = await bookingApi.post(
          `/booking/users/${userId}/showtimes/${sid}`,
          { bookedSeats: amount },
          {
            headers: {
              Authorization: `Basic ${token}`,
            },
          }
        );
        console.log(response.data);
        Alert.alert("Booking successful!");

        // Update the local state to reflect the new balance seats
        setUpdatedEvent((prevEvent) => ({
          ...prevEvent,
          showtime: prevEvent.showtime.map((show) =>
            show.sid === sid
              ? { ...show, balSeats: show.balSeats - amount }
              : show
          ),
        }));

        const eventEmitter = new NativeEventEmitter(
          NativeModules.ReactNativeEventEmitter
        );
        eventEmitter.emit("bookingSuccess"); // Emit the event to notify ExploreScreen
      } catch (error) {
        console.error(error);
        Alert.alert("Booking failed!");
      }
    }
  };

  const handleConfirmBooking = (showtime) => {
    Alert.alert(
      "Confirm Booking",
      `You are about to book ${seats} seat(s) for the showtime on ${showtime.date}.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            handleBookingSubmit(showtime.sid);
            setSeats("");
            setSelectedShowtime(null);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{updatedEvent.description}</Text>
      <Image source={{ uri: updatedEvent.imageUrl }} style={styles.image} />
      <Text style={styles.header}>Showtimes:</Text>
      {updatedEvent.showtime.map((show, index) => (
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  showtimeInfo: {
    flex: 1,
  },
  showtimeText: {
    fontSize: 16,
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  smallButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  inputAndButtonContainer: {
    alignItems: "center",
  },
  input: {
    width: 60,
    padding: 5,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
  },
});
