import { Alert, Image, Platform, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";

function AccountScreen({ navigation }) {
  // useNavigation

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        Choose an existing photo or take a new photo.
      </Text>
    </View>
  );
}

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCEEF9",
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
