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
  logo: {
    marginBottom: 20,
  },
  input: {
    height: 20,
    width: "100%",
    marginVertical: 20,
    borderWidth: 1,
    padding: 20,
    borderRadius: 5,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    marginTop: 20,
    width: '90%',
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  forgotPassword: {
    color: "#0ed1c0",
    marginTop: 20,
    fontSize: 20,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  signupText: {
    color: "#0ed1c0",
    marginLeft: 20,
    fontSize: 20,
  },
  logoIcon: {
    width: 20,
    height: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  input: {
    flex: 1,
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ddd",
  },
  eyeIcon: {
    position: "absolute",
    right: 1,
    padding: 20,
  },
});