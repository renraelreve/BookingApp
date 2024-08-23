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
    padding: 20, 
  },
  instructionText: {
    fontFamily: "Rubik_400Regular",
    textAlign: "center",
    paddingVertical: 20,
  },
  logoIcon: {
    width: 50,
    height: 50, 
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%", 
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 15, 
  },
  input: {
    flex: 1,
    height: 50,
    padding: 10,
    backgroundColor: "white",
    borderColor: "#ddd",
    borderRadius: 5,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    padding: 10,
  },
  button: {
    backgroundColor: "#007BFF", 
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    width: '90%',
    marginVertical: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18, 
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
});