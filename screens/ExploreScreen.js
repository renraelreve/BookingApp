import React, { useState, useEffect } from "react";
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
import base64 from "react-native-base64";
import { useNavigation } from "@react-navigation/native";
import { bookingApi } from "../api/bookingApi";

const deviceWidth = Dimensions.get("window").width;

function ExploreScreen() {
  const navigation = useNavigation();
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

      const username = "Abigail";
      const password = "password123";
      const token = base64.encode(`${username}:${password}`);

      const response = await bookingApi.get("/events", {
        headers: {
          Authorization: `Basic ${token}`,
        },
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
      />
    </View>
  );
}

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  itemContainer: {
    width: deviceWidth / 2 - 10,
    margin: 5,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  eventIdText: {
    fontSize: 10,
    textAlign: "center",
  },
});
