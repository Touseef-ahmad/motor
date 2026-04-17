import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface StoreItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  price: string;
}

const STORE_ITEMS: StoreItem[] = [
  {
    id: "1",
    icon: "car-sport",
    title: "Premium Features",
    description: "Unlock advanced analytics and reports",
    price: "$4.99/mo",
  },
  {
    id: "2",
    icon: "cloud-upload",
    title: "Cloud Backup",
    description: "Automatic backup of all your data",
    price: "$2.99/mo",
  },
  {
    id: "3",
    icon: "notifications",
    title: "Smart Reminders",
    description: "Oil change and maintenance alerts",
    price: "$1.99/mo",
  },
  {
    id: "4",
    icon: "stats-chart",
    title: "Detailed Reports",
    description: "Export and share vehicle reports",
    price: "$3.99/mo",
  },
];

const StoreScreen: React.FC = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Store</Text>
        <Text style={styles.headerSubtitle}>
          Enhance your vehicle experience
        </Text>
      </View>

      <View style={styles.itemsContainer}>
        {STORE_ITEMS.map((item) => (
          <TouchableOpacity key={item.id} style={styles.itemCard}>
            <View style={styles.itemIconContainer}>
              <Ionicons name={item.icon} size={28} color="#007AFF" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
            <View style={styles.itemPriceContainer}>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.promoSection}>
        <View style={styles.promoCard}>
          <Ionicons name="gift" size={40} color="#FF9500" />
          <Text style={styles.promoTitle}>Get 1 Month Free</Text>
          <Text style={styles.promoDescription}>
            Try Premium features free for 30 days
          </Text>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Start Free Trial</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#8E8E93",
  },
  itemsContainer: {
    padding: 16,
  },
  itemCard: {
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
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#8E8E93",
  },
  itemPriceContainer: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  promoSection: {
    padding: 16,
  },
  promoCard: {
    backgroundColor: "#FFF9E6",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFE5A3",
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginTop: 12,
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  promoButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default StoreScreen;
