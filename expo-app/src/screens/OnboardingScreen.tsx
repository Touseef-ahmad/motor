import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleSignUpWithEmail = () => {
    // Navigate to main app for now - replace with actual auth flow
    navigation.navigate("MainTabs" as never);
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign In
    navigation.navigate("MainTabs" as never);
  };

  const handleAppleSignIn = () => {
    // TODO: Implement Apple Sign In
    navigation.navigate("MainTabs" as never);
  };

  const handleSignIn = () => {
    // TODO: Navigate to Sign In screen
    navigation.navigate("MainTabs" as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero Section with Car Image */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
        }}
        style={styles.heroSection}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.85)"]}
          locations={[0.3, 0.7, 1]}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <Text style={styles.headline}>Car Expense Tracker</Text>
            <Text style={styles.subheadline}>
              Track fuel, repairs, and more.{"\n"}Manage your expenses digitally
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Authentication Section */}
      <SafeAreaView style={styles.authSection}>
        <View style={styles.authContent}>
          {/* Primary Button - Sign Up with Email */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSignUpWithEmail}
            activeOpacity={0.8}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.primaryButtonText}>Sign Up with Email</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            {/* Google Button */}
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.7}
            >
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleIcon}>G</Text>
              </View>
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            {/* Apple Button */}
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleSignIn}
              activeOpacity={0.7}
            >
              <Ionicons
                name="logo-apple"
                size={20}
                color="#000000"
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  heroSection: {
    flex: 1,
    minHeight: height * 0.5,
  },
  heroGradient: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroContent: {
    alignItems: "flex-start",
  },
  headline: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 24,
  },
  authSection: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  authContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#1E3A8A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonIcon: {
    marginRight: 10,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5EA",
  },
  dividerText: {
    paddingHorizontal: 16,
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "400",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  googleIconContainer: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4",
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  signInLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A8A",
  },
});

export default OnboardingScreen;
