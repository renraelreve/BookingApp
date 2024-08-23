import { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack"; // Import Stack Navigator
import { Provider as AuthProvider } from "./context/AuthContext.js";
import { Context as AuthContext } from "./context/AuthContext";
import { PhotoProvider } from "./context/PhotoContext"; // Import the context provider
import { Text } from "react-native";
// For using custom fonts
import {
  Rubik_400Regular,
  Rubik_700Bold,
  useFonts,
} from "@expo-google-fonts/rubik";
import { Satisfy_400Regular } from "@expo-google-fonts/satisfy";
import Ionicons from "@expo/vector-icons/Ionicons";
import SplashScreen from "./screens/SplashScreen";

// import { Colors } from "./styles/colors";

import ExploreScreen from "./screens/ExploreScreen";
import AccountScreen from "./screens/AccountScreen";
// import DetailScreen from "./screens/DetailScreen";
import PhotoScreen from "./screens/PhotoScreen";
import PhotoGalleryScreen from "./screens/PhotoGalleryScreen";
import DetailScreen from "./screens/DetailScreenwithCal";
import LoginScreen from "./screens/LoginScreen";

const Colors = {
  PRIMARY: "#89CFF0", // Light Blue
  SECONDARY: "#A7D7C5", // Soft Green
  BACKGROUND: "#F7F8FA", // Light Gray
  TEXT: "#333333", // Dark Gray
  ACCENT: "#F7E8A4", // Soft Yellow
};

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

function App() {
  const { state } = useContext(AuthContext);
  console.log(state);

  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_700Bold,
    Satisfy_400Regular,
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }, []);

  if (!fontsLoaded) return null;

  if (showSplash) {
    return <SplashScreen />;
  }

  // Define the Stack Navigator
  const ExploreStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          headerTitle: "Explore",
          headerStyle: { backgroundColor: Colors.PRIMARY },
          headerTintColor: "white",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          headerTitle: "Event Details",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="Photo"
        component={PhotoScreen}
        options={{
          headerTitle: "Take Photo",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="PhotoGallery"
        component={PhotoGalleryScreen}
        options={{
          headerTitle: "View Photo",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: Colors.PRIMARY },
          headerTintColor: "white",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );

  const AccountStack = () => (
    <Stack.Navigator initialRouteName={"LoginScreen"}>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerTitle: "Log In",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: Colors.PRIMARY },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="AccountScreen"
        component={state.username ? AccountScreen : LoginScreen}
        options={{
          headerTitle: state.username
            ? state.username + "'s Book!ngs"
            : "Log In",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: Colors.PRIMARY },
          headerTintColor: "white",
        }}
      />
    </Stack.Navigator>
  );

  return (
    <PhotoProvider>
      <NavigationContainer>
        <BottomTab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.PRIMARY },
            headerTintColor: "white",
            tabBarActiveTintColor: Colors.SECONDARY,
            tabBarStyle: { backgroundColor: Colors.BACKGROUND },
            headerTitleAlign: "center",
            headerTitle: () => (
              <Text style={{ fontFamily: "Satisfy_400Regular", fontSize: 24 }}>
                Book!e
              </Text>
            ),
          }}
        >
          <BottomTab.Screen
            name="Home"
            component={ExploreStack}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="search" size={size} color={color} />
              ),
            }}
          />
          <BottomTab.Screen
            name="Account"
            component={AccountStack}
            initialRouteName="LoginScreen"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="happy-outline" size={size} color={color} />
              ),
            }}
          />
        </BottomTab.Navigator>
      </NavigationContainer>
    </PhotoProvider>
  );
}

export default () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};
