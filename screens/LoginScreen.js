//https://reactnativetips.com/how-to-create-a-react-native-login-screen/

import { Alert, Image, Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, NativeEventEmitter,
  NativeModules, } from "react-native";
import { useState, useContext } from "react";
import { Colors } from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import {Context as AuthContext} from '../context/AuthContext';

function LoginScreen({ navigation }) {

	const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { state, login, createuser } = useContext(AuthContext);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // useNavigation

  const loginHandler = () => {
    // navigation.navigate("Account", {
    //   username: username,
    //   password: password,
    // });
    login({username, password});
    navigation.navigate("AccountScreen");
  };

  const addUserHandler = () => {
    // navigation.navigate("Account", {
    //   username: username,
    // });
    createuser({username, password});
    navigation.navigate("AccountScreen");
  };

  return (
    <View style={styles.container}>
      <Image source={require("./../assets/favicon.png")} style={styles.logoIcon}/>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          placeholder="Book!e name"
          keyboardType="default"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="password"
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}>
        <Ionicons
          name={passwordVisible ? "eye-outline" : "eye-off-outline"}
          size={24}
          color="grey"
        />
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        onPress={loginHandler}
        style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <TouchableOpacity 
          onPress={addUserHandler}>
        <Text style={styles.instructionText}>No Account?  Join as a Book!e</Text>
        </TouchableOpacity>
      </View>
    </View>

    
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCEEF9",
    alignItems: "center",
    padding: 20, // Increased padding for better spacing
  },
  instructionText: {
    fontFamily: "Rubik_400Regular",
    textAlign: "center",
    paddingVertical: 20,
  },
  logoIcon: {
    width: 50, // Increased size for better visibility
    height: 50, 
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%", // Ensuring it takes full width of the container
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 15, // Space between input fields
  },
  input: {
    flex: 1,
    height: 50,
    padding: 10,
    backgroundColor: "white", // Ensuring background remains white
    borderColor: "#ddd",
    borderRadius: 5,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    padding: 10,
  },
  button: {
    backgroundColor: "#007BFF", // Darker blue for better visibility
    borderRadius: 25,
    padding: 15, // Increased padding for a larger button
    alignItems: "center",
    width: '90%',
    marginVertical: 20, // Space above the button
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18, // Slightly smaller font size for better fit
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
});