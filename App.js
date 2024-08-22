import { useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack"; // Import Stack Navigator
import {Provider as AuthProvider} from './context/AuthContext.js';
import {Context as AuthContext} from './context/AuthContext';

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
import LoginScreen from "./screens/LoginScreen";
import BookieCalendar from "./components/Calendar";

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Create Stack Navigator

SplashScreen.preventAutoHideAsync();

function App() {
  const {state} = useContext(AuthContext);
  console.log(state);

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
        options={{
          headerTitle: "Explore",
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          headerTitle: "Event Details",
          headerTitleAlign: 'center',
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
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="AccountScreen"
        component={state.username ? AccountScreen : LoginScreen}
        options={{
          headerTitle: state.username ? state.username + '\'s Book!ngs' : "Log In",
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="CalendarScreen"
        component={state.username ? BookieCalendar : LoginScreen}
        options={{
          headerTitle: state.username ? state.username + '\'s Calendar' : "Log In",
          headerTitleAlign: 'center',
        }}
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
          headerTitle: "Book!e", 
          headerTitleAlign: 'center', 
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
  );
}

export default () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};