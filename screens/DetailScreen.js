import React from "react";
import { View, Text, StyleSheet, Image, Button, ScrollView } from "react-native";

function DetailScreen({ route }) {
  const { event, isSignedIn } = route.params;

  // Dummy event details
  const eventDetails = {
    1: "This is a special concert by Taylor Swift featuring her greatest hits. This event will be held on 24 August 2070. BOOK YOUR TICKETS NOW!",
    2: "Watch Singapore take on South Korea in an exciting World Cup Qualifier match. This event will be held on 24 August 2070. BOOK YOUR TICKETS NOW!",
    3: "Experience the thrill of the Formula 1 Race with top drivers competing. This event will be held on 24 August 2070. BOOK YOUR TICKETS NOW!",
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.description}>{event.description}</Text> 
      <Image source={{ uri: event.imageUrl }} style={styles.image} />
      <Text style={styles.details}>{eventDetails[event.eid]}</Text> 
      
      {isSignedIn ? (
        <Button title="Buy Tickets" onPress={() => {}} />
      ) : (
        <Text style={styles.signInPrompt}>Please sign in to buy tickets.</Text>
      )}
    </View>
    </ScrollView>
  );
}

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  image: {
    width: 300,
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
});