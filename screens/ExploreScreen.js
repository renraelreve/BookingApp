import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import base64 from "react-native-base64";

import { bookingApi } from "../api/bookingApi";

import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";

function ExploreScreen({ navigation }) {
  // useNavigation
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);

      // Basic Auth credentials
      const username = "Abigail";
      const password = "password123";
      const token = base64.encode(`${username}:${password}`);

      // Make the API request with the Authorization header
      const response = await bookingApi.get("/events", {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      setEvents(response.data);
      console.log(response.data);
      // setError(null);
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
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {event.description}
            </Text>
            <Text style={{ fontSize: 16 }}>Event ID: {event.eid}</Text>
            {event.imageUrl && (
              <Image
                source={{
                  uri: event.imageUrl,
                }}
                style={{ width: 200, height: 200 }}
              />
            )}
          </View>
        )}
      />
    </View>
  );
}

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    padding: 10,
  },
  instructionText: {
    fontFamily: "Rubik_400Regular",
    textAlign: "center",
    paddingVertical: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  previewImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});
