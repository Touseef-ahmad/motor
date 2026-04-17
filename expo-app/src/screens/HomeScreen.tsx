import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCarContext } from "../contexts/CarContext";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

// Tab options for filtering logs
const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "fuel", label: "Fuel" },
  { id: "oil", label: "Oil change" },
  { id: "maintenance", label: "Maintenance" },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { carDetails, oilChanges, fuelLogs, expenses } = useCarContext();
  const [activeTab, setActiveTab] = useState("all");

  // Calculate total log count
  const totalLogs = fuelLogs.length + oilChanges.length + expenses.length;

  // Get the car display name
  const carDisplayName =
    carDetails?.make && carDetails?.model
      ? `${carDetails.year} ${carDetails.make} ${carDetails.model}`
      : "2024 Audi Q8";

  // Get current mileage
  const currentMileage = carDetails?.currentMileage || 12450;

  // Get filtered logs based on active tab
  const getFilteredLogs = () => {
    switch (activeTab) {
      case "fuel":
        return fuelLogs.map((log) => ({ type: "fuel", ...log }));
      case "oil":
        return oilChanges.map((log) => ({ type: "oil", ...log }));
      case "maintenance":
        return expenses
          .filter((e) => e.category === "Maintenance")
          .map((log) => ({ type: "maintenance", ...log }));
      default:
        return [
          ...fuelLogs.map((log) => ({ type: "fuel", ...log })),
          ...oilChanges.map((log) => ({ type: "oil", ...log })),
          ...expenses.map((log) => ({ type: "expense", ...log })),
        ];
    }
  };

  const filteredLogs = getFilteredLogs();

  const getTabCount = (tabId: string) => {
    switch (tabId) {
      case "fuel":
        return fuelLogs.length;
      case "oil":
        return oilChanges.length;
      case "maintenance":
        return expenses.filter((e) => e.category === "Maintenance").length;
      default:
        return totalLogs;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero Section with Car Image */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
        }}
        style={styles.heroSection}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.heroGradient}
        >
          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("Car Details" as never)}
          >
            <Ionicons name="pencil" size={18} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          {/* Car Info */}
          <View style={styles.carInfoContainer}>
            <Text style={styles.carTitle}>{carDisplayName}</Text>
            <View style={styles.mileageContainer}>
              <Ionicons name="speedometer-outline" size={16} color="#FFFFFF" />
              <Text style={styles.mileageText}>
                {currentMileage.toLocaleString()} mi
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Filter Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {FILTER_TABS.map((tab) => {
            const count = getTabCount(tab.id);
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab.label}{" "}
                  {tab.id === "all" && count > 0 ? `(${count})` : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content Area */}
      <ScrollView
        style={styles.contentArea}
        contentContainerStyle={styles.contentContainer}
      >
        {filteredLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>No logs yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Start tracking your vehicle's history
            </Text>
          </View>
        ) : (
          filteredLogs.map((log, index) => {
            // Get cost/amount safely
            const logCost =
              "cost" in log ? log.cost : "amount" in log ? log.amount : 0;
            return (
              <View key={`${log.type}-${index}`} style={styles.logCard}>
                <View style={styles.logIconContainer}>
                  <Ionicons
                    name={
                      log.type === "fuel"
                        ? "flame"
                        : log.type === "oil"
                          ? "water"
                          : log.type === "maintenance"
                            ? "construct"
                            : "receipt"
                    }
                    size={24}
                    color="#007AFF"
                  />
                </View>
                <View style={styles.logContent}>
                  <Text style={styles.logTitle}>
                    {log.type === "fuel"
                      ? "Fuel"
                      : log.type === "oil"
                        ? "Oil Change"
                        : log.type === "maintenance"
                          ? "Maintenance"
                          : "Expense"}
                  </Text>
                  <Text style={styles.logDate}>
                    {new Date(log.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <View style={styles.logAmount}>
                  <Text style={styles.logAmountText}>
                    ${logCost.toFixed(2)}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  heroSection: {
    width: width,
    height: height * 0.35,
  },
  heroGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  editButton: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  carInfoContainer: {
    marginBottom: 10,
  },
  carTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  mileageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mileageText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 6,
    opacity: 0.9,
  },
  tabsWrapper: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F7",
  },
  tabActive: {
    backgroundColor: "transparent",
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
    borderRadius: 0,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#8E8E93",
  },
  tabTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  contentArea: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#3C3C43",
    marginTop: 16,
  },
  emptyStateSubtitle: {
    fontSize: 15,
    color: "#8E8E93",
    marginTop: 8,
  },
  logCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logContent: {
    flex: 1,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  logDate: {
    fontSize: 14,
    color: "#8E8E93",
  },
  logAmount: {
    alignItems: "flex-end",
  },
  logAmountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
});

export default HomeScreen;
