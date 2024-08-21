import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";

function PhotoGalleryScreen({ route }) {
  const { event, photoUrls } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Photos for {event.description}</Text>
      {photoUrls.length > 0 ? (
        photoUrls.map((url, index) => (
          <Image key={index} source={{ uri: url }} style={styles.image} />
        ))
      ) : (
        <Text>No photos available</Text>
      )}
    </ScrollView>
  );
}

export default PhotoGalleryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});
