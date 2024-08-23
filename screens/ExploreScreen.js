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
import { useNavigation } from "@react-navigation/native";

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
      const response = await bookingApi.get("/events");
      setEvents(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setError(error.message);
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
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCEEF9",
    paddingTop: 15,
  },
  contentContainer: {
    paddingBottom: 15,
  },
  itemContainer: {
    width: deviceWidth - 40, 
    margin: 20, 
    alignItems: "center",
    backgroundColor: "white", 
    borderRadius: 10,
    padding: 10, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: "100%", // Full width of the item
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
});