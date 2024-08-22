import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { PhotoContext } from "../context/PhotoContext"; // Import PhotoContext

function PhotoGalleryScreen({ route }) {
  const { event } = route.params;
  const { photoUrls } = useContext(PhotoContext); // Use the PhotoContext

  // Get the photos for the specific event
  const photos = photoUrls[event.eid] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Photos for {event.description}</Text>
      {photos.length === 0 ? (
        <Text style={styles.noPhotosText}>
          No photos available for this event.
        </Text>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.photo} />
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
  photo: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 8,
  },
});
