import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { CarProvider } from "./src/contexts/CarContext";
import HomeScreen from "./src/screens/HomeScreen";
import StoreScreen from "./src/screens/StoreScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import OilChangeScreen from "./src/screens/OilChangeScreen";
import FuelLogsScreen from "./src/screens/FuelLogsScreen";
import ExpensesScreen from "./src/screens/ExpensesScreen";
import CarDetailsScreen from "./src/screens/CarDetailsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Store") {
            iconName = focused ? "storefront" : "storefront-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "help-outline";
          }

          // Custom pill-shaped background for active tab
          if (focused) {
            return (
              <View style={styles.activeTabIcon}>
                <Ionicons name={iconName} size={size} color="#007AFF" />
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "rgba(249, 249, 249, 0.94)",
          borderTopColor: "#E5E5EA",
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: 8,
          paddingBottom: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

/**
 * Root navigator: renders the Login screen when unauthenticated, or the full
 * authenticated app (wrapped in CarProvider) when a session exists.
 * CarProvider intentionally lives here so it mounts fresh after every login,
 * guaranteeing React state is clean for the new user.
 */
function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <CarProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#007AFF" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Car Details" component={CarDetailsScreen} />
        <Stack.Screen name="Oil Change" component={OilChangeScreen} />
        <Stack.Screen name="Fuel Logs" component={FuelLogsScreen} />
        <Stack.Screen name="Expenses" component={ExpensesScreen} />
      </Stack.Navigator>
    </CarProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  activeTabIcon: {
    backgroundColor: "#E8F1FF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
