import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  Button, // Import Button component
  NativeEventEmitter,
  NativeModules,
} from "react-native";

import base64 from "react-native-base64";
import { bookingApi } from "../api/bookingApi";

function DetailScreen({ route }) {
  const { event, isSignedIn } = route.params;
  const [updatedEvent, setUpdatedEvent] = useState(event); // Track updated event data
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [tickets, setTickets] = useState("");

  // Dummy event details
  const eventDetails = {
    1: "This is a special concert by Taylor Swift featuring her greatest hits. This event will be held on 24 August 2070. BOOK YOUR TICKETS NOW!",
    2: "Watch Singapore take on South Korea in an exciting World Cup Qualifier match. This event will be held on 24 August 2070. BOOK YOUR TICKETS NOW!",
    3: "Experience the thrill of the Formula 1 Race with top drivers competing. This event will be held on 24 August 2070. BOOK YOUR TICKETS NOW!",
  };

  // Handle cases where event.eid is not in eventDetails
  const eventDetail = eventDetails[event.eid] || "Details not available.";

  const userId = 1;

  const username = "Abigail";
  const password = "password123";
  const token = base64.encode(`${username}:${password}`);

  // Sort showtimes by date from oldest to latest
  useEffect(() => {
    const sortedShowtimes = [...updatedEvent.showtime].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setUpdatedEvent((prevEvent) => ({
      ...prevEvent,
      showtime: sortedShowtimes,
    }));
  }, []);

  const handleBookNow = (showtime) => {
    setSelectedShowtime(showtime.sid);
  };

  const handleBookingSubmit = async (sid) => {
    const amount = parseInt(tickets, 10); // Parse tickets as an integer
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

        // Update the local state to reflect the new balance tickets
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
      `You are about to book ${tickets} tickets(s) for the showtime on ${showtime.date}.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            handleBookingSubmit(showtime.sid);
            setTickets("");
            setSelectedShowtime(null);
          },
        },
      ]
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.description}>{event.description}</Text>
        <Image source={{ uri: event.imageUrl }} style={styles.image} />
        <Text style={styles.details}>{eventDetail}</Text>
        <Text style={styles.header}>Showtimes:</Text>
        {updatedEvent.showtime.map((show, index) => (
          <View key={index} style={styles.showtimeContainer}>
            <View style={styles.showtimeInfo}>
              <Text style={styles.showtimeText}>Date: {show.date}</Text>
              <Text style={styles.showtimeText}>
                Total Tickets: {show.totalSeats}
              </Text>
              <Text style={styles.showtimeText}>
                Available Tickets: {show.balSeats}
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
                    placeholder="Tickets"
                    keyboardType="numeric"
                    value={tickets}
                    onChangeText={setTickets}
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
        {/* {isSignedIn ? (
        <Button title="Buy Tickets" onPress={() => {}} />
      ) : (
        <Text style={styles.signInPrompt}>Please sign in to buy tickets.</Text>
      )} */}
      </View>
    </ScrollView>
  );
}

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    width: "100%", // Make the image width responsive
    height: 300,
    resizeMode: "cover",
    marginVertical: 20,
    borderRadius: 8,
  },
  description: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  details: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  signInPrompt: {
    fontSize: 16,
    color: "red",
    marginTop: 20,
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
