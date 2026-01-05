import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCarContext } from '../contexts/CarContext';

const { width } = Dimensions.get('window');

const CarDetailsScreen: React.FC = () => {
  const { carDetails, updateCarDetails } = useCarContext();
  
  const [name, setName] = useState(carDetails?.name || '');
  const [make, setMake] = useState(carDetails?.make || '');
  const [model, setModel] = useState(carDetails?.model || '');
  const [year, setYear] = useState(carDetails?.year?.toString() || '');
  const [color, setColor] = useState(carDetails?.color || '');
  const [licensePlate, setLicensePlate] = useState(carDetails?.licensePlate || '');
  const [vin, setVin] = useState(carDetails?.vin || '');
  const [purchaseDate, setPurchaseDate] = useState(carDetails?.purchaseDate || '');
  const [currentMileage, setCurrentMileage] = useState(carDetails?.currentMileage?.toString() || '');
  const [images, setImages] = useState<string[]>(carDetails?.images || []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant camera roll permissions to add photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant camera permissions to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleSave = async () => {
    if (!name || !make || !model || !year) {
      Alert.alert('Error', 'Please fill in name, make, model, and year');
      return;
    }

    const updatedDetails = {
      id: carDetails?.id || Date.now().toString(),
      name,
      make,
      model,
      year: parseInt(year),
      color,
      licensePlate,
      vin,
      purchaseDate,
      currentMileage: currentMileage ? parseFloat(currentMileage) : 0,
      images,
      emoji: carDetails?.emoji || '🚗',
      backgroundStyle: carDetails?.backgroundStyle || 'gradient',
      backgroundColor: carDetails?.backgroundColor || '#007AFF',
      secondaryColor: carDetails?.secondaryColor || '#5AC8FA',
    };

    await updateCarDetails(updatedDetails);
    Alert.alert('Success', 'Car details saved successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Car Photos</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.carImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.imageButtonsContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
            <Text style={styles.imageButtonIcon}>📷</Text>
            <Text style={styles.imageButtonText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonIcon}>🖼️</Text>
            <Text style={styles.imageButtonText}>Choose Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <Text style={styles.inputLabel}>Car Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., My Awesome Car"
        />

        <Text style={styles.inputLabel}>Make *</Text>
        <TextInput
          style={styles.input}
          value={make}
          onChangeText={setMake}
          placeholder="e.g., Toyota"
        />

        <Text style={styles.inputLabel}>Model *</Text>
        <TextInput
          style={styles.input}
          value={model}
          onChangeText={setModel}
          placeholder="e.g., Camry"
        />

        <Text style={styles.inputLabel}>Year *</Text>
        <TextInput
          style={styles.input}
          value={year}
          onChangeText={setYear}
          placeholder="e.g., 2020"
          keyboardType="numeric"
        />

        <Text style={styles.inputLabel}>Color</Text>
        <TextInput
          style={styles.input}
          value={color}
          onChangeText={setColor}
          placeholder="e.g., Red"
        />

        <Text style={styles.inputLabel}>License Plate</Text>
        <TextInput
          style={styles.input}
          value={licensePlate}
          onChangeText={setLicensePlate}
          placeholder="e.g., ABC123"
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Details</Text>

        <Text style={styles.inputLabel}>VIN (Vehicle Identification Number)</Text>
        <TextInput
          style={styles.input}
          value={vin}
          onChangeText={setVin}
          placeholder="Enter VIN"
          autoCapitalize="characters"
        />

        <Text style={styles.inputLabel}>Purchase Date</Text>
        <TextInput
          style={styles.input}
          value={purchaseDate}
          onChangeText={setPurchaseDate}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.inputLabel}>Current Mileage (km)</Text>
        <TextInput
          style={styles.input}
          value={currentMileage}
          onChangeText={setCurrentMileage}
          placeholder="Enter current mileage"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Car Details</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  imageScroll: {
    marginBottom: 15,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  carImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageButton: {
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '45%',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  imageButtonIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  imageButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CarDetailsScreen;
