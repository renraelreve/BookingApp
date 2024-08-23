import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

import { useIsFocused } from "@react-navigation/native"; // Import useIsFocused to check if the screen is focused
import { bookingApi } from "../api/bookingApi"; // Adjust the import based on your project structure
import base64 from "react-native-base64";

function PhotoGalleryScreen({ route }) {
  const { event } = route.params;
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused(); // Detect if the screen is focused

  // Function to fetch the latest event data from the API
  const fetchEventData = async () => {
    try {
      setLoading(true);
      setError(null);

      const username = "Abigail";
      const password = "password123";
      const token = base64.encode(`${username}:${password}`);

      // Use back ticks for string interpolation with template literals
      console.log("event", event.eid);
      const response = await bookingApi.get(`/event/${event.eid}`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      const updatedEvent = response.data;

      setPhotos(updatedEvent.cloudImages); // Update the state with the latest images
    } catch (error) {
      console.error(
        "Error fetching event data",
        error.response?.data || error.message
      );
      setError("Failed to load photos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch event data whenever the screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchEventData();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Photos for {event.description}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : photos.length === 0 ? (
        <Text style={styles.noPhotosText}>
          No photos available for this event.
        </Text>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()} // Ensure unique keys
          renderItem={({ item }) => (
            <Image source={{ uri: item.url }} style={styles.photo} />
          )}
        />
      )}
    </View>
  );
}

export default PhotoGalleryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  noPhotosText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  photo: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 8,
  },
});
