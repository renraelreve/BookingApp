import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import base64 from "react-native-base64";
import { bookingApi } from "../api/bookingApi"; // Ensure this is correctly set up for your API calls

function AccountScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    const token = base64.encode(`${username}:${password}`);

    try {
      // Attempt to authenticate with the backend
      const response = await bookingApi.get("/api/auth/login", {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (response.status === 200) {
        // Successfully logged in
        setIsLoggedIn(true);
        Alert.alert("Login Successful", "You are now logged in.");
      } else {
        // Login failed
        setIsLoggedIn(false);
        Alert.alert(
          "Login Failed",
          "Please check your credentials and try again."
        );
      }
    } catch (error) {
      console.error(error);
      setIsLoggedIn(false);
      Alert.alert(
        "Login Failed",
        "Please check your credentials and try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      {isLoggedIn ? (
        <Text style={styles.successText}>You are logged in!</Text>
      ) : (
        <Text style={styles.errorText}>Not logged in</Text>
      )}
    </View>
  );
}

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  successText: {
    color: "green",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    marginTop: 20,
  },
});
