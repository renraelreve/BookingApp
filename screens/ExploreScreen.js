import {
  Alert,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  NativeEventEmitter,
  NativeModules,
} from "react-native";
import { useState, useEffect } from "react";
import base64 from "react-native-base64";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

import { bookingApi } from "../api/bookingApi";

const deviceWidth = Dimensions.get("window").width;

function ExploreScreen() {
  const navigation = useNavigation(); // Use navigation hook
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();

    const eventEmitter = new NativeEventEmitter(
      NativeModules.ReactNativeEventEmitter
    ); // Initialize the event emitter
    const subscription = eventEmitter.addListener("bookingSuccess", () => {
      loadEvents(); // Reload events when a booking is successful
    });

    return () => subscription.remove(); // Clean up the subscription on unmount
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);

      // const username = "Abigail";
      // const password = "password123";
      // const token = base64.encode(`${username}:${password}`);

      const response = await bookingApi.get("/events", {
        // headers: {
        //   Authorization: `Basic ${token}`,
        // },
      });

      setEvents(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        Alert.alert(
          "Unauthorized",
          "Please check your authentication credentials."
        );
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(event) => event.eid.toString()}
        renderItem={({ item: event }) => (
          <Pressable onPress={() => navigation.navigate("Detail", { event })}>
            {/* Pass the event as a parameter */}
            <View style={styles.itemContainer}>
              {event.imageUrl && (
                <Image source={{ uri: event.imageUrl }} style={styles.image} />
              )}
              <Text style={styles.descriptionText}>{event.description}</Text>
              <Text style={styles.eventIdText}>Event ID: {event.eid}</Text>
            </View>
          </Pressable>
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    //padding: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  itemContainer: {
    width: deviceWidth / 2 - 20,
    margin: 10,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  eventIdText: {
    fontSize: 12,
    textAlign: "center",
    color: "gray",
  },
});
