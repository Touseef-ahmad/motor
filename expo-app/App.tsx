import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CarProvider } from './src/contexts/CarContext';
import HomeScreen from './src/screens/HomeScreen';
import OilChangeScreen from './src/screens/OilChangeScreen';
import FuelLogsScreen from './src/screens/FuelLogsScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import CarDetailsScreen from './src/screens/CarDetailsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <CarProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Home') {
                iconName = focused ? 'car' : 'car-outline';
              } else if (route.name === 'Oil Change') {
                iconName = focused ? 'water' : 'water-outline';
              } else if (route.name === 'Fuel Logs') {
                iconName = focused ? 'speedometer' : 'speedometer-outline';
              } else if (route.name === 'Expenses') {
                iconName = focused ? 'cash' : 'cash-outline';
              } else if (route.name === 'Car Details') {
                iconName = focused ? 'information-circle' : 'information-circle-outline';
              } else {
                iconName = 'help-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Oil Change" component={OilChangeScreen} />
          <Tab.Screen name="Fuel Logs" component={FuelLogsScreen} />
          <Tab.Screen name="Expenses" component={ExpensesScreen} />
          <Tab.Screen name="Car Details" component={CarDetailsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </CarProvider>
  );
}
