import React, { useState, useEffect } from 'react';
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
import { FuelLog, TrackingState } from '../types';
import FuelGaugeSlider from '../components/FuelGaugeSlider';
import { useFuelLogState, detectLogType } from '../hooks/useFuelLogState';

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
  const [fuelLevel, setFuelLevel] = useState(0.5); // 0-1, default to half tank
  const [isBeforeRefuel, setIsBeforeRefuel] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState('');

  // Get tracking state
  const currentMileage = mileage ? parseFloat(mileage) : undefined;
  const logState = useFuelLogState(fuelLogs, currentMileage, fuelLevel);

  // Auto-detect log type when fuel level changes
  useEffect(() => {
    if (logState.lastLog && logState.lastLog.fuelLevel !== undefined) {
      const detected = detectLogType(fuelLevel, logState.lastLog.fuelLevel);
      if (detected.isAfterRefuel) {
        setFullTank(!detected.isPartialRefuel);
      }
    }
  }, [fuelLevel, logState.lastLog]);

  // Show suggestions when tracking state changes
  useEffect(() => {
    if (logState.suggestions.length > 0 && showAddModal) {
      setCurrentSuggestion(logState.suggestions[0]);
      setShowSuggestionModal(true);
    }
  }, [logState.suggestions, showAddModal]);

  const handleResetTracking = () => {
    Alert.alert(
      'Reset Tracking',
      'This will mark your next entry as a fresh baseline. Previous logs will remain but tracking connections will be cleared. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setFuelLevel(0.5);
            setMileage('');
            setLiters('');
            setCost('');
            setNotes('Reset tracking baseline');
          },
        },
      ]
    );
  };

  const handleAddFuelLog = async () => {
    // Validation
    if (!mileage) {
      Alert.alert('Error', 'Please enter current mileage');
      return;
    }

    if (logState.validationErrors.length > 0) {
      Alert.alert('Validation Error', logState.validationErrors.join('\n'));
      return;
    }

    // Calculate price per liter if cost and liters provided
    const litersParsed = liters ? parseFloat(liters) : 0;
    const costParsed = cost ? parseFloat(cost) : 0;
    const pricePerLiter = litersParsed > 0 ? costParsed / litersParsed : 0;

    // Detect log type
    const lastFuelLevel = logState.lastLog?.fuelLevel;
    const detected = detectLogType(fuelLevel, lastFuelLevel);

    const newFuelLog: Omit<FuelLog, 'id'> = {
      date,
      mileage: parseFloat(mileage),
      liters: litersParsed,
      cost: costParsed,
      pricePerLiter,
      fuelType,
      fullTank,
      notes,
      fuelLevel,
      isBeforeRefuel: isBeforeRefuel || detected.isBeforeRefuel,
      isAfterRefuel: detected.isAfterRefuel,
      isPartialRefuel: detected.isPartialRefuel,
      trackingState: logState.trackingState,
    };

    // Link to pending before-refuel log if applicable
    if (detected.isAfterRefuel && logState.pendingBeforeRefuelLog) {
      newFuelLog.linkedLogId = logState.pendingBeforeRefuelLog.id;
    }

    await addFuelLog(newFuelLog);
    
    // Reset form
    setDate(new Date().toISOString().split('T')[0]);
    setMileage('');
    setLiters('');
    setCost('');
    setFuelType('Regular');
    setFullTank(true);
    setNotes('');
    setFuelLevel(0.5);
    setIsBeforeRefuel(false);
    setShowAddModal(false);
    setShowSuggestionModal(false);
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
    // Determine badge
    let badge = '';
    let badgeColor = '#666';
    
    if (item.isBeforeRefuel && !item.linkedLogId) {
      badge = '⛽ Pending refuel';
      badgeColor = '#FF9500';
    } else if (item.isAfterRefuel && item.linkedLogId) {
      badge = '✅ Consistent';
      badgeColor = '#34C759';
    } else if (item.trackingState === TrackingState.Inconsistent) {
      badge = '⚠️ Missed log';
      badgeColor = '#FF3B30';
    } else if (item.isPartialRefuel) {
      badge = '⛽ Partial refuel';
      badgeColor = '#007AFF';
    }

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemDate}>
              {new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            {badge && (
              <Text style={[styles.badge, { color: badgeColor }]}>
                {badge}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteButton}>🗑️</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mileage:</Text>
            <Text style={styles.detailValue}>{item.mileage.toLocaleString()} km</Text>
          </View>
          {item.fuelLevel !== undefined && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fuel Level:</Text>
              <Text style={styles.detailValue}>
                {Math.round(item.fuelLevel * 100)}%
              </Text>
            </View>
          )}
          {item.liters > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fuel:</Text>
              <Text style={styles.detailValue}>
                {item.liters.toFixed(2)} L ({item.fuelType})
              </Text>
            </View>
          )}
          {item.cost > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cost:</Text>
              <Text style={styles.detailValue}>
                ${item.cost.toFixed(2)} {item.pricePerLiter > 0 && `($${item.pricePerLiter.toFixed(2)}/L)`}
              </Text>
            </View>
          )}
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
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            style={[styles.addButton, styles.resetButton]}
            onPress={handleResetTracking}
          >
            <Text style={styles.addButtonText}>🔄 Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tracking State Indicator */}
      {logState.trackingState !== TrackingState.Idle && (
        <View style={[
          styles.trackingStateBar,
          logState.trackingState === TrackingState.Inconsistent && styles.trackingStateWarning,
          logState.trackingState === TrackingState.BeforeRefuelPending && styles.trackingStatePending,
        ]}>
          <Text style={styles.trackingStateText}>
            {logState.trackingState === TrackingState.BeforeRefuelPending && '⛽ Waiting for after-refuel log'}
            {logState.trackingState === TrackingState.AfterRefuelPending && '✅ Ready to track'}
            {logState.trackingState === TrackingState.Inconsistent && '⚠️ Inconsistent tracking - consider reset'}
          </Text>
        </View>
      )}

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

              {/* Fuel Gauge Slider */}
              <FuelGaugeSlider
                value={fuelLevel}
                onChange={setFuelLevel}
              />

              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
              />

              <Text style={styles.inputLabel}>Mileage (km) *</Text>
              <TextInput
                style={styles.input}
                value={mileage}
                onChangeText={setMileage}
                placeholder="Enter current mileage"
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsBeforeRefuel(!isBeforeRefuel)}
              >
                <View style={[styles.checkbox, isBeforeRefuel && styles.checkboxChecked]}>
                  {isBeforeRefuel && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Log Before Refuel</Text>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Liters (optional)</Text>
              <TextInput
                style={styles.input}
                value={liters}
                onChangeText={setLiters}
                placeholder="Enter liters filled"
                keyboardType="decimal-pad"
              />

              <Text style={styles.inputLabel}>Total Cost ($) (optional)</Text>
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

              {/* Validation Errors */}
              {logState.validationErrors.length > 0 && (
                <View style={styles.errorContainer}>
                  {logState.validationErrors.map((error, index) => (
                    <Text key={index} style={styles.errorText}>⚠️ {error}</Text>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={[styles.submitButton, !logState.canSubmit && styles.submitButtonDisabled]}
                onPress={handleAddFuelLog}
                disabled={!logState.canSubmit}
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

      {/* Suggestion Modal */}
      <Modal
        visible={showSuggestionModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSuggestionModal(false)}
      >
        <View style={styles.suggestionModalOverlay}>
          <View style={styles.suggestionModalContent}>
            <Text style={styles.suggestionTitle}>💡 Suggestion</Text>
            <Text style={styles.suggestionText}>{currentSuggestion}</Text>
            <TouchableOpacity
              style={styles.suggestionButton}
              onPress={() => setShowSuggestionModal(false)}
            >
              <Text style={styles.suggestionButtonText}>Got it</Text>
            </TouchableOpacity>
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
  resetButton: {
    backgroundColor: '#666',
  },
  trackingStateBar: {
    padding: 12,
    backgroundColor: '#007AFF',
  },
  trackingStateWarning: {
    backgroundColor: '#FF3B30',
  },
  trackingStatePending: {
    backgroundColor: '#FF9500',
  },
  trackingStateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  badge: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  suggestionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 300,
  },
  suggestionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  suggestionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  suggestionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 12,
  },
  suggestionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FuelLogsScreen;
