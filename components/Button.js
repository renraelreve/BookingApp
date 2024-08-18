import { Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../styles/colors";

function Button({ children, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      // style={styles.buttonContainer}
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && styles.buttonPressed,
      ]}
      // android_ripple={{ color: "#fff" }}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,

    // Android Shadow
    elevation: 16,
    shadowColor: "#000",

    // iOS Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6, // missed this
    shadowOpacity: 0.25,
  },
  buttonText: {
    color: "white",
    fontFamily: "Rubik_700Bold",
    textTransform: "uppercase",
    fontSize: 16,
  },
  buttonPressed: {
    backgroundColor: "#ff922b",
    opacity: 0.85,
  },
});
