import { useState, useEffect, useContext } from "react";
import { Colors } from "../styles/colors";
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
import { Context as AuthContext } from '../context/AuthContext';

function AccountScreen({ navigation }) {
  // function AccountScreen({ route }) {
  // const { username, password } = route.params;
  const {state, logout } = useContext(AuthContext);
  const [ bookings, setBookings ] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadBookings();
    console.log("UseEffect loadBookings");
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      console.log(state.username, state.password);
      const token = base64.encode(`${state.username}:${state.password}`);
  
      const response = await bookingApi.get("/users/find", {
        headers: {
          Authorization: `Basic ${token}`,
        },
        params: {
          name: state.username,
        }
      });
      setBookings(response.data);
      console.log("response.data");
      console.log(response.data);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        Alert.alert(
          "Unauthorized",
          "You are not a book!e yet."
        );
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
    <ScrollView>
      <View style={styles.container}>
      {/* <Text>User Id: {bookings.uid}</Text> */}
        {bookings.booking?.map((item, index) => (
          <View key={index} style={styles.container}>
            <View style={styles.showtimeText}>
              
              <Text>Event: {item.showtimeEventDescription}</Text>
              <Text>Show time: {item.showtimeDate}</Text>
              <Text>Total Tickets Booked: {item.bookedSeats}
              </Text>
            </View>
          </View>
        ))}      
      
      </View>
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={calendarHandler}
          style={styles.button}>
          <Text style={styles.buttonText}>Activate Calendar</Text>
        </TouchableOpacity>  
      </View>    
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={logoutHandler}
          style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>  
      </View>    
    </ScrollView>
  );
}

export default AccountScreen;

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
  button: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    marginTop: 20,
    width: '100%',
  },
});
