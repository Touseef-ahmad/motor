import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";

interface SettingItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  type: "navigate" | "toggle" | "action";
  value?: boolean;
  screen?: string;
}

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [autoBackup, setAutoBackup] = React.useState(true);

  const accountSettings: SettingItem[] = [
    {
      id: "car-details",
      icon: "car",
      title: "Car Details",
      subtitle: "Edit your vehicle information",
      type: "navigate",
      screen: "Car Details",
    },
    {
      id: "fuel-logs",
      icon: "speedometer",
      title: "Fuel Logs",
      subtitle: "Manage fuel entries",
      type: "navigate",
      screen: "Fuel Logs",
    },
    {
      id: "oil-change",
      icon: "water",
      title: "Oil Changes",
      subtitle: "Track oil change history",
      type: "navigate",
      screen: "Oil Change",
    },
    {
      id: "expenses",
      icon: "cash",
      title: "Expenses",
      subtitle: "Manage vehicle expenses",
      type: "navigate",
      screen: "Expenses",
    },
  ];

  const appSettings: SettingItem[] = [
    {
      id: "notifications",
      icon: "notifications",
      title: "Push Notifications",
      type: "toggle",
      value: notifications,
    },
    {
      id: "dark-mode",
      icon: "moon",
      title: "Dark Mode",
      type: "toggle",
      value: darkMode,
    },
    {
      id: "auto-backup",
      icon: "cloud-upload",
      title: "Auto Backup",
      type: "toggle",
      value: autoBackup,
    },
  ];

  const supportSettings: SettingItem[] = [
    {
      id: "help",
      icon: "help-circle",
      title: "Help & Support",
      type: "navigate",
    },
    {
      id: "feedback",
      icon: "chatbubble",
      title: "Send Feedback",
      type: "action",
    },
    {
      id: "rate",
      icon: "star",
      title: "Rate App",
      type: "action",
    },
    {
      id: "about",
      icon: "information-circle",
      title: "About",
      subtitle: "Version 1.0.0",
      type: "navigate",
    },
  ];

  const handleToggle = (id: string) => {
    switch (id) {
      case "notifications":
        setNotifications(!notifications);
        break;
      case "dark-mode":
        setDarkMode(!darkMode);
        break;
      case "auto-backup":
        setAutoBackup(!autoBackup);
        break;
    }
  };

  const handleNavigate = (screen?: string) => {
    if (screen) {
      navigation.navigate(screen as never);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out? Your data will be cleared from this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: logout,
        },
      ],
    );
  };

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={() => {
        if (item.type === "navigate") {
          handleNavigate(item.screen);
        } else if (item.type === "toggle") {
          handleToggle(item.id);
        }
      }}
      disabled={item.type === "toggle"}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons name={item.icon} size={22} color="#007AFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        )}
      </View>
      {item.type === "toggle" ? (
        <Switch
          value={
            item.id === "notifications"
              ? notifications
              : item.id === "dark-mode"
                ? darkMode
                : autoBackup
          }
          onValueChange={() => handleToggle(item.id)}
          trackColor={{ false: "#E5E5EA", true: "#34C759" }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        {user && <Text style={styles.headerSubtitle}>{user.email}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VEHICLE</Text>
        <View style={styles.sectionContent}>
          {accountSettings.map(renderSettingItem)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APP PREFERENCES</Text>
        <View style={styles.sectionContent}>
          {appSettings.map(renderSettingItem)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUPPORT</Text>
        <View style={styles.sectionContent}>
          {supportSettings.map(renderSettingItem)}
        </View>
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
            <Text style={styles.signOutText}>Sign Out</Text>
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
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    marginLeft: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E5EA",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F0F6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    color: "#1C1C1E",
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  signOutText: {
    fontSize: 17,
    color: "#FF3B30",
    fontWeight: "500",
  },
});

export default SettingsScreen;
