import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { CarProvider } from "./src/contexts/CarContext";
import HomeScreen from "./src/screens/HomeScreen";
import StoreScreen from "./src/screens/StoreScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import OilChangeScreen from "./src/screens/OilChangeScreen";
import FuelLogsScreen from "./src/screens/FuelLogsScreen";
import ExpensesScreen from "./src/screens/ExpensesScreen";
import CarDetailsScreen from "./src/screens/CarDetailsScreen";
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

export default function App() {
  return (
    <CarProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#007AFF",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
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
      </NavigationContainer>
    </CarProvider>
  );
}

const styles = StyleSheet.create({
  activeTabIcon: {
    backgroundColor: "#E8F1FF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
