import { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import base64 from "react-native-base64";
import { bookingApi } from "../api/bookingApi";
import { Context as AuthContext } from "../context/AuthContext";

function AccountScreen({ navigation }) {
  const { state, logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const token = base64.encode(`${state.username}:${state.password}`);
      const response = await bookingApi.get("/users/find", {
        headers: {
          Authorization: `Basic ${token}`,
        },
        params: {
          name: state.username,
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        Alert.alert("Unauthorized", "You are not a book!e yet.");
        navigation.navigate("LoginScreen");
      } else {
        setError(error.message);
        navigation.navigate("LoginScreen");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logoutHandler = () => {
    logout();
    navigation.navigate("Explore");
  };

  const calendarHandler = () => {
    navigation.navigate("CalendarScreen");
  };

  return (
    <ScrollView style={styles.scrollcontainer}>
      <View style={styles.container}>
        {bookings.booking?.map((item, index) => (
          <View key={index} style={styles.bookingContainer}>
            <Text style={styles.showtimeText}><Text style={styles.boldText}>Event:</Text> {item.showtimeEventDescription}</Text>
            <Text style={styles.showtimeText}><Text style={styles.boldText}>Show time:</Text> {item.showtimeDate}</Text>
            <Text style={styles.showtimeText}><Text style={styles.boldText}>Total Tickets Booked:</Text> {item.bookedSeats}</Text>
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={calendarHandler} style={styles.button}>
          <Text style={styles.buttonText}>Activate Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logoutHandler} style={styles.logoutButton}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default AccountScreen;

const styles = StyleSheet.create({
  scrollcontainer: {
    backgroundColor: "#DCEEF9",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  bookingContainer: {
    width: '90%', 
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, 
  },
  showtimeText: {
    fontSize: 16,
    marginBottom: 5, 
  },
  boldText: {
    fontWeight: 'bold', 
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: "#89CFF0",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
    width: "80%",
  },
  logoutButton: {
    backgroundColor: "#FF6347",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});