import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCarContext } from '../contexts/CarContext';
import { FuelLog } from '../types';

const FuelLogsScreen: React.FC = () => {
  const { fuelLogs, addFuelLog, deleteFuelLog, calculateFuelAverage } = useCarContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState('');
  const [liters, setLiters] = useState('');
  const [cost, setCost] = useState('');
  const [fuelType, setFuelType] = useState<'Regular' | 'Premium' | 'Diesel' | 'Electric'>('Regular');
  const [fullTank, setFullTank] = useState(true);
  const [notes, setNotes] = useState('');

  const handleAddFuelLog = async () => {
    if (!mileage || !liters || !cost) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const pricePerLiter = parseFloat(cost) / parseFloat(liters);

    const newFuelLog: Omit<FuelLog, 'id'> = {
      date,
      mileage: parseFloat(mileage),
      liters: parseFloat(liters),
      cost: parseFloat(cost),
      pricePerLiter,
      fuelType,
      fullTank,
      notes,
    };

    await addFuelLog(newFuelLog);
    
    // Reset form
    setDate(new Date().toISOString().split('T')[0]);
    setMileage('');
    setLiters('');
    setCost('');
    setFuelType('Regular');
    setFullTank(true);
    setNotes('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Fuel Log',
      'Are you sure you want to delete this fuel log?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteFuelLog(id) },
      ]
    );
  };

  const renderFuelLogItem = ({ item }: { item: FuelLog }) => {
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemDate}>
            {new Date(item.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteButton}>🗑️</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mileage:</Text>
            <Text style={styles.detailValue}>{item.mileage.toLocaleString()} km</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fuel:</Text>
            <Text style={styles.detailValue}>
              {item.liters.toFixed(2)} L ({item.fuelType})
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cost:</Text>
            <Text style={styles.detailValue}>
              ${item.cost.toFixed(2)} (${item.pricePerLiter.toFixed(2)}/L)
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Tank:</Text>
            <Text style={styles.detailValue}>{item.fullTank ? 'Yes' : 'No'}</Text>
          </View>
          {item.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const fuelAverage = calculateFuelAverage();
  const totalFuel = fuelLogs.reduce((sum, log) => sum + log.liters, 0);
  const totalSpent = fuelLogs.reduce((sum, log) => sum + log.cost, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fuel Logs</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {fuelAverage > 0 ? fuelAverage.toFixed(2) : '--'}
          </Text>
          <Text style={styles.summaryLabel}>km/L Average</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalFuel.toFixed(1)}</Text>
          <Text style={styles.summaryLabel}>Total Liters</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>${totalSpent.toFixed(0)}</Text>
          <Text style={styles.summaryLabel}>Total Spent</Text>
        </View>
      </View>

      {fuelLogs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⛽</Text>
          <Text style={styles.emptyText}>No fuel logs yet</Text>
          <Text style={styles.emptySubtext}>Start tracking your refuels to calculate fuel average</Text>
        </View>
      ) : (
        <FlatList
          data={fuelLogs}
          renderItem={renderFuelLogItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Add Fuel Log</Text>

              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
              />

              <Text style={styles.inputLabel}>Mileage (km)</Text>
              <TextInput
                style={styles.input}
                value={mileage}
                onChangeText={setMileage}
                placeholder="Enter current mileage"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Liters</Text>
              <TextInput
                style={styles.input}
                value={liters}
                onChangeText={setLiters}
                placeholder="Enter liters filled"
                keyboardType="decimal-pad"
              />

              <Text style={styles.inputLabel}>Total Cost ($)</Text>
              <TextInput
                style={styles.input}
                value={cost}
                onChangeText={setCost}
                placeholder="Enter total cost"
                keyboardType="decimal-pad"
              />

              <Text style={styles.inputLabel}>Fuel Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={fuelType}
                  onValueChange={(value) => setFuelType(value as typeof fuelType)}
                  style={styles.picker}
                >
                  <Picker.Item label="Regular" value="Regular" />
                  <Picker.Item label="Premium" value="Premium" />
                  <Picker.Item label="Diesel" value="Diesel" />
                  <Picker.Item label="Electric" value="Electric" />
                </Picker>
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setFullTank(!fullTank)}
              >
                <View style={[styles.checkbox, fullTank && styles.checkboxChecked]}>
                  {fullTank && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Full Tank</Text>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any notes"
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddFuelLog}
              >
                <Text style={styles.submitButtonText}>Add Fuel Log</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  summaryCard: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 15,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 8,
  },
  itemDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  deleteButton: {
    fontSize: 20,
  },
  itemDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  notesLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#000',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FuelLogsScreen;
