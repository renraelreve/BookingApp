import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";

function AgendaScreen() {
  const [items, setItems] = useState({
    "2024-08-20": [{ name: "Event 1" }, { name: "Event 2" }],
    "2024-08-21": [{ name: "Event 3" }],
    "2024-08-22": [{ name: "Event 4" }, { name: "Event 5" }],
  });

  const renderItem = (item) => {
    return (
      <TouchableOpacity style={styles.item}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>No events on this day!</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={(r1, r2) => r1.name !== r2.name}
        theme={{
          selectedDayBackgroundColor: "#00adf5",
          dotColor: "#00adf5",
          selectedDotColor: "#ffffff",
          todayTextColor: "#00adf5",
          arrowColor: "#00adf5",
        }}
      />
    </View>
  );
}

export default AgendaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
