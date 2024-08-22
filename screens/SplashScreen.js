import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from 'lottie-react-native';

export default function SplashScreen() {
  const animation = useRef(null); 

  useEffect(() => {
    if (animation.current) {
      animation.current.play();
    }

    return () => {
      if (animation.current) {
        animation.current.reset();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookie</Text>
      <LottieView
        ref={animation}
        source={require('../loader.json')}
        autoPlay={false} 
        loop={true}
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCEEF9",
  },
  title: {
    fontSize: 48,
    fontFamily: "Satisfy_400Regular",
    color: "#333333",
    marginBottom: 5,
  },
  loader: {
    width: 100,
    height: 100, 
  },
});