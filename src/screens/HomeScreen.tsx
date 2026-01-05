import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { useCarContext } from '../contexts/CarContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const EMOJI_OPTIONS = ['🚗', '🚙', '🚕', '🚓', '🏎️', '🚐', '🚛', '🚚', '🏍️', '🛵'];
const BACKGROUND_COLORS = [
  { name: 'Blue', primary: '#007AFF', secondary: '#5AC8FA' },
  { name: 'Purple', primary: '#AF52DE', secondary: '#BF5AF2' },
  { name: 'Pink', primary: '#FF2D55', secondary: '#FF6482' },
  { name: 'Orange', primary: '#FF9500', secondary: '#FFB340' },
  { name: 'Green', primary: '#34C759', secondary: '#62E884' },
  { name: 'Red', primary: '#FF3B30', secondary: '#FF6961' },
];

const HomeScreen: React.FC = () => {
  const { carDetails, updateCarDetails, oilChanges, fuelLogs, expenses, calculateFuelAverage } = useCarContext();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const [bounceAnim] = useState(new Animated.Value(1));

  const currentEmoji = carDetails?.emoji || '🚗';
  const currentBgIndex = BACKGROUND_COLORS.findIndex(
    bg => bg.primary === (carDetails?.backgroundColor || '#007AFF')
  );
  const currentBg = BACKGROUND_COLORS[currentBgIndex !== -1 ? currentBgIndex : 0];

  const startBounceAnimation = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleEmojiSelect = async (emoji: string) => {
    const updatedDetails = {
      id: carDetails?.id || Date.now().toString(),
      name: carDetails?.name || 'My Car',
      make: carDetails?.make || '',
      model: carDetails?.model || '',
      year: carDetails?.year || new Date().getFullYear(),
      color: carDetails?.color || '',
      licensePlate: carDetails?.licensePlate || '',
      currentMileage: carDetails?.currentMileage || 0,
      images: carDetails?.images || [],
      emoji: emoji,
      backgroundStyle: carDetails?.backgroundStyle || 'gradient',
      backgroundColor: carDetails?.backgroundColor || '#007AFF',
      secondaryColor: carDetails?.secondaryColor || '#5AC8FA',
    };
    await updateCarDetails(updatedDetails);
    setShowEmojiPicker(false);
    startBounceAnimation();
  };

  const handleBackgroundSelect = async (bg: typeof BACKGROUND_COLORS[0]) => {
    const updatedDetails = {
      id: carDetails?.id || Date.now().toString(),
      name: carDetails?.name || 'My Car',
      make: carDetails?.make || '',
      model: carDetails?.model || '',
      year: carDetails?.year || new Date().getFullYear(),
      color: carDetails?.color || '',
      licensePlate: carDetails?.licensePlate || '',
      currentMileage: carDetails?.currentMileage || 0,
      images: carDetails?.images || [],
      emoji: carDetails?.emoji || '🚗',
      backgroundStyle: 'gradient',
      backgroundColor: bg.primary,
      secondaryColor: bg.secondary,
    };
    await updateCarDetails(updatedDetails);
    setShowBackgroundPicker(false);
  };

  const fuelAverage = calculateFuelAverage();
  const latestOilChange = oilChanges[0];
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[currentBg.primary, currentBg.secondary]}
        style={styles.heroSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.emojiContainer}
          onPress={() => setShowEmojiPicker(true)}
        >
          <Animated.Text
            style={[
              styles.carEmoji,
              { transform: [{ scale: bounceAnim }] }
            ]}
          >
            {currentEmoji}
          </Animated.Text>
        </TouchableOpacity>
        
        <Text style={styles.carName}>{carDetails?.name || 'My Car'}</Text>
        <Text style={styles.carSubtitle}>
          {carDetails?.make && carDetails?.model
            ? `${carDetails.year} ${carDetails.make} ${carDetails.model}`
            : 'Tap to add car details'}
        </Text>

        <TouchableOpacity
          style={styles.customizeButton}
          onPress={() => setShowBackgroundPicker(true)}
        >
          <Text style={styles.customizeButtonText}>🎨 Customize</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⛽</Text>
          <Text style={styles.statValue}>
            {fuelAverage > 0 ? `${fuelAverage.toFixed(2)}` : '--'}
          </Text>
          <Text style={styles.statLabel}>km/L Average</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🛢️</Text>
          <Text style={styles.statValue}>
            {latestOilChange
              ? new Date(latestOilChange.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : '--'}
          </Text>
          <Text style={styles.statLabel}>Last Oil Change</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statValue}>
            {totalExpenses > 0 ? `$${totalExpenses.toFixed(0)}` : '$0'}
          </Text>
          <Text style={styles.statLabel}>Total Expenses</Text>
        </View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        
        <View style={styles.quickActionCard}>
          <Text style={styles.quickActionIcon}>📊</Text>
          <View style={styles.quickActionContent}>
            <Text style={styles.quickActionTitle}>Fuel Logs</Text>
            <Text style={styles.quickActionValue}>{fuelLogs.length} entries</Text>
          </View>
        </View>

        <View style={styles.quickActionCard}>
          <Text style={styles.quickActionIcon}>🔧</Text>
          <View style={styles.quickActionContent}>
            <Text style={styles.quickActionTitle}>Oil Changes</Text>
            <Text style={styles.quickActionValue}>{oilChanges.length} records</Text>
          </View>
        </View>

        <View style={styles.quickActionCard}>
          <Text style={styles.quickActionIcon}>💳</Text>
          <View style={styles.quickActionContent}>
            <Text style={styles.quickActionTitle}>Expenses</Text>
            <Text style={styles.quickActionValue}>{expenses.length} transactions</Text>
          </View>
        </View>
      </View>

      {/* Emoji Picker Modal */}
      <Modal
        visible={showEmojiPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Your Car Emoji</Text>
            <View style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.emojiOption}
                  onPress={() => handleEmojiSelect(emoji)}
                >
                  <Text style={styles.emojiOptionText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowEmojiPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Background Picker Modal */}
      <Modal
        visible={showBackgroundPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBackgroundPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Background</Text>
            <View style={styles.backgroundGrid}>
              {BACKGROUND_COLORS.map((bg, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.backgroundOption}
                  onPress={() => handleBackgroundSelect(bg)}
                >
                  <LinearGradient
                    colors={[bg.primary, bg.secondary]}
                    style={styles.backgroundPreview}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <Text style={styles.backgroundName}>{bg.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowBackgroundPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  heroSection: {
    width: width,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  emojiContainer: {
    marginBottom: 20,
  },
  carEmoji: {
    fontSize: 120,
  },
  carName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  carSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  customizeButton: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  customizeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: width * 0.28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 36,
    marginRight: 15,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  quickActionValue: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: width * 0.85,
    maxHeight: height * 0.7,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  emojiOption: {
    width: width * 0.15,
    height: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  emojiOptionText: {
    fontSize: 50,
  },
  backgroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  backgroundOption: {
    alignItems: 'center',
    marginBottom: 20,
    width: width * 0.25,
  },
  backgroundPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  backgroundName: {
    fontSize: 12,
    color: '#666',
  },
  modalCloseButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HomeScreen;
