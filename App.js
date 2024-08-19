import { useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack"; // Import Stack Navigator
// For using custom fonts
import {
  Rubik_400Regular,
  Rubik_700Bold,
  useFonts,
} from "@expo-google-fonts/rubik";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SplashScreen from "expo-splash-screen";

import { Colors } from "./styles/colors";
import ExploreScreen from "./screens/ExploreScreen";
import AccountScreen from "./screens/AccountScreen";
import DetailScreen from "./screens/DetailScreen";

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Create Stack Navigator

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  // Define the Stack Navigator
  const ExploreStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ headerShown: false }} // Hide header if not needed
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: "Event Details" }} // Customize the header title
      />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer>
      <BottomTab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.PRIMARY },
          headerTintColor: "white",
          tabBarActiveTintColor: Colors.PRIMARY,
        }}
      >
        <BottomTab.Screen
          name="Home"
          component={ExploreStack}  // Use the Stack Navigator
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <BottomTab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="happy-outline" size={size} color={color} />
            ),
          }}
        />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
}
