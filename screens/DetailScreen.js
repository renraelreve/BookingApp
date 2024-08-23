import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  NativeModules,
  NativeEventEmitter,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Context as AuthContext } from "../context/AuthContext";
import { bookingApi } from "../api/bookingApi";

import base64 from "react-native-base64";

const isNativeEventEmitterSupported =
  Platform.OS === "ios" || NativeModules.ReactNativeEventEmitter;

function DetailScreen({ route }) {
  const { event } = route.params;
  const [updatedEvent, setUpdatedEvent] = useState(event);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [tickets, setTickets] = useState(1);
  const { state } = useContext(AuthContext);
  const navigation = useNavigation();

  const token = base64.encode(`${state.username}:${state.password}`);

  const eventDetails = {
    1: "This is a special concert by Taylor Swift featuring her greatest hits. This event will be held on 24 August 2070. BOOK YOUR TICKETS NOW!",
    2: "Watch Singapore take on South Korea in an exciting World Cup Qualifier match. This event will be held on 24 August 2070. BOOK YOUR TICKETS NOW!",
    3: "Experience the thrill of the Formula 1 Race with top drivers competing. This event will be held on 24 August 2070. BOOK YOUR TICKETS NOW!",
  };

  const eventDetail = eventDetails[event.eid] || "Details not available.";

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
    const amount = parseInt(tickets, 10);
    if (amount) {
      try {
        const getUid = await bookingApi.get("/users/find", {
          headers: {
            Authorization: `Basic ${token}`,
          },
          params: {
            name: state.username,
          },
        }); // Corrected the missing parenthesis here

        const response = await bookingApi.post(
          `/booking/users/${getUid.data.uid}/showtimes/${sid}`,
          { bookedSeats: amount },
          {
            headers: {
              Authorization: `Basic ${token}`,
            },
          }
        );

        Alert.alert("Booking successful!");

        setUpdatedEvent((prevEvent) => ({
          ...prevEvent,
          showtime: prevEvent.showtime.map((show) =>
            show.sid === sid
              ? { ...show, balSeats: show.balSeats - amount }
              : show
          ),
        }));

        if (isNativeEventEmitterSupported) {
          const eventEmitter = new NativeEventEmitter(
            NativeModules.ReactNativeEventEmitter || NativeModules.ToastExample
          );
          eventEmitter.emit("bookingSuccess");
          console.log("Event emitted successfully");
        }

        const bookedShowtime = updatedEvent.showtime.find(
          (show) => show.sid === sid
        );
        if (bookedShowtime) {
          navigation.navigate("CalendarScreen", {
            eventName: event.description,
            showtimeDate: bookedShowtime.date,
          });
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Booking failed!");
      }
    }
  };

  const handleConfirmBooking = (showtime) => {
    Alert.alert(
      "Confirm Booking",
      `You are about to book ${tickets} ticket${
        tickets > 1 ? "s" : ""
      } for the show time on ${showtime.date}.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            handleBookingSubmit(showtime.sid);
            setTickets(1);
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
        {/* Button to navigate to PhotoScreen */}
        {state.username && (
          <TouchableOpacity
            style={styles.photoButton}
            onPress={() => navigation.navigate("Photo", { event })}
          >
            <Text style={styles.buttonText}>Take Event Photo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.photoButton}
          onPress={() =>
            navigation.navigate("PhotoGallery", {
              event,
            })
          }
        >
          <Text style={styles.buttonText}>View Event Photos</Text>
        </TouchableOpacity>
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
                state.username && (
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => handleBookNow(show)}
                  >
                    <Text style={styles.buttonText}>Book Now</Text>
                  </TouchableOpacity>
                )
              ) : (
                <View style={styles.inputAndButtonContainer}>
                  <View style={styles.stepperContainer}>
                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() => setTickets(Math.max(1, tickets - 1))}
                    >
                      <Text style={styles.stepperButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepperText}>{tickets}</Text>
                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() => setTickets(tickets + 1)}
                    >
                      <Text style={styles.stepperButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
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
      </View>
    </ScrollView>
  );
}

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCEEF9",
    paddingLeft: 15,
    paddingRight: 15,
  },
  image: {
    width: "100%",
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
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
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
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stepperButton: {
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 5,
  },
  stepperButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  stepperText: {
    fontSize: 16,
    marginHorizontal: 10,
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
  photoButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: "center",
  },
});
