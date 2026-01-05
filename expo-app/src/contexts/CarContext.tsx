import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CarDetails, OilChange, FuelLog, Expense, CarContextType } from '../types';
import { USE_BACKEND } from '../config/api';
import { CarAPI, OilChangeAPI, FuelLogAPI, ExpenseAPI } from '../services/api';

const CarContext = createContext<CarContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CAR_DETAILS: '@motor_car_details',
  OIL_CHANGES: '@motor_oil_changes',
  FUEL_LOGS: '@motor_fuel_logs',
  EXPENSES: '@motor_expenses',
  CAR_ID: '@motor_car_id', // Store the backend car ID
};

export const CarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
  const [oilChanges, setOilChanges] = useState<OilChange[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [carId, setCarId] = useState<string | null>(null); // Backend car ID

  // Helper to check if backend is available and car ID exists
  const canUseBackend = () => USE_BACKEND && carId !== null;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (USE_BACKEND) {
        // Load from API
        let currentCarId = await AsyncStorage.getItem(STORAGE_KEYS.CAR_ID);
        
        // If no car ID stored, try to get first car
        if (!currentCarId) {
          try {
            const cars = await CarAPI.getAllCars();
            if (cars.length > 0) {
              currentCarId = cars[0].id;
              await AsyncStorage.setItem(STORAGE_KEYS.CAR_ID, currentCarId);
              setCarId(currentCarId);
            } else {
              // No cars in backend, load from local storage
              await loadFromAsyncStorage();
              return;
            }
          } catch (error) {
            console.error('Error fetching cars from API:', error);
            await loadFromAsyncStorage();
            return;
          }
        }
        
        // Fetch car data from API
        if (currentCarId) {
          try {
            const car = await CarAPI.getCarDetails(currentCarId);
            setCarId(currentCarId);
            setCarDetails(car);
            
            // Fetch related data
            const [oilChangesData, fuelLogsData, expensesData] = await Promise.all([
              OilChangeAPI.getOilChanges(currentCarId),
              FuelLogAPI.getFuelLogs(currentCarId),
              ExpenseAPI.getExpenses(currentCarId),
            ]);
            
            setOilChanges(oilChangesData.sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ));
            setFuelLogs(fuelLogsData.sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ));
            setExpenses(expensesData.sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ));
            
            // Cache to AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEYS.CAR_DETAILS, JSON.stringify(car));
            await AsyncStorage.setItem(STORAGE_KEYS.OIL_CHANGES, JSON.stringify(oilChangesData));
            await AsyncStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(fuelLogsData));
            await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expensesData));
          } catch (error) {
            console.error('Error loading from API, falling back to cache:', error);
            // Fall back to AsyncStorage cache
            await loadFromAsyncStorage();
          }
        }
      } else {
        // Use local AsyncStorage only
        await loadFromAsyncStorage();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadFromAsyncStorage = async () => {
    const [carDetailsData, oilChangesData, fuelLogsData, expensesData] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.CAR_DETAILS),
      AsyncStorage.getItem(STORAGE_KEYS.OIL_CHANGES),
      AsyncStorage.getItem(STORAGE_KEYS.FUEL_LOGS),
      AsyncStorage.getItem(STORAGE_KEYS.EXPENSES),
    ]);

    if (carDetailsData) setCarDetails(JSON.parse(carDetailsData));
    if (oilChangesData) setOilChanges(JSON.parse(oilChangesData));
    if (fuelLogsData) setFuelLogs(JSON.parse(fuelLogsData));
    if (expensesData) setExpenses(JSON.parse(expensesData));
  };

  const updateCarDetails = async (details: CarDetails) => {
    try {
      if (USE_BACKEND) {
        if (carId) {
          // Update existing car in API
          const updated = await CarAPI.updateCar(carId, details);
          setCarDetails(updated);
          await AsyncStorage.setItem(STORAGE_KEYS.CAR_DETAILS, JSON.stringify(updated));
        } else {
          // Create new car in API
          const created = await CarAPI.createCar(details);
          setCarId(created.id);
          setCarDetails(created);
          await AsyncStorage.setItem(STORAGE_KEYS.CAR_ID, created.id);
          await AsyncStorage.setItem(STORAGE_KEYS.CAR_DETAILS, JSON.stringify(created));
        }
      } else {
        // Local storage only
        await AsyncStorage.setItem(STORAGE_KEYS.CAR_DETAILS, JSON.stringify(details));
        setCarDetails(details);
      }
    } catch (error) {
      console.error('Error saving car details:', error);
      // Fall back to local storage
      await AsyncStorage.setItem(STORAGE_KEYS.CAR_DETAILS, JSON.stringify(details));
      setCarDetails(details);
    }
  };

  const addOilChange = async (oilChange: Omit<OilChange, 'id'>) => {
    try {
      if (canUseBackend()) {
        // Create in API
        const created = await OilChangeAPI.createOilChange(carId!, oilChange);
        const updated = [...oilChanges, created].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setOilChanges(updated);
        await AsyncStorage.setItem(STORAGE_KEYS.OIL_CHANGES, JSON.stringify(updated));
      } else {
        // Local storage only
        const newOilChange = { ...oilChange, id: Date.now().toString() };
        const updated = [...oilChanges, newOilChange].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        await AsyncStorage.setItem(STORAGE_KEYS.OIL_CHANGES, JSON.stringify(updated));
        setOilChanges(updated);
      }
    } catch (error) {
      console.error('Error adding oil change:', error);
      // Fall back to local storage
      const newOilChange = { ...oilChange, id: Date.now().toString() };
      const updated = [...oilChanges, newOilChange].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      await AsyncStorage.setItem(STORAGE_KEYS.OIL_CHANGES, JSON.stringify(updated));
      setOilChanges(updated);
    }
  };

  const deleteOilChange = async (id: string) => {
    try {
      if (USE_BACKEND) {
        // Delete from API
        await OilChangeAPI.deleteOilChange(id);
      }
      // Update local state and storage
      const updated = oilChanges.filter(oc => oc.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.OIL_CHANGES, JSON.stringify(updated));
      setOilChanges(updated);
    } catch (error) {
      console.error('Error deleting oil change:', error);
    }
  };

  const addFuelLog = async (fuelLog: Omit<FuelLog, 'id'>) => {
    try {
      if (canUseBackend()) {
        // Create in API
        const created = await FuelLogAPI.createFuelLog(carId!, fuelLog);
        const updated = [...fuelLogs, created].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setFuelLogs(updated);
        await AsyncStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(updated));
      } else {
        // Local storage only
        const newFuelLog = { ...fuelLog, id: Date.now().toString() };
        const updated = [...fuelLogs, newFuelLog].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        await AsyncStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(updated));
        setFuelLogs(updated);
      }
    } catch (error) {
      console.error('Error adding fuel log:', error);
      // Fall back to local storage
      const newFuelLog = { ...fuelLog, id: Date.now().toString() };
      const updated = [...fuelLogs, newFuelLog].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      await AsyncStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(updated));
      setFuelLogs(updated);
    }
  };

  const deleteFuelLog = async (id: string) => {
    try {
      if (USE_BACKEND) {
        // Delete from API
        await FuelLogAPI.deleteFuelLog(id);
      }
      // Update local state and storage
      const updated = fuelLogs.filter(fl => fl.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(updated));
      setFuelLogs(updated);
    } catch (error) {
      console.error('Error deleting fuel log:', error);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      if (canUseBackend()) {
        // Create in API
        const created = await ExpenseAPI.createExpense(carId!, expense);
        const updated = [...expenses, created].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setExpenses(updated);
        await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
      } else {
        // Local storage only
        const newExpense = { ...expense, id: Date.now().toString() };
        const updated = [...expenses, newExpense].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
        setExpenses(updated);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      // Fall back to local storage
      const newExpense = { ...expense, id: Date.now().toString() };
      const updated = [...expenses, newExpense].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
      setExpenses(updated);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      if (USE_BACKEND) {
        // Delete from API
        await ExpenseAPI.deleteExpense(id);
      }
      // Update local state and storage
      const updated = expenses.filter(e => e.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
      setExpenses(updated);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const calculateFuelAverage = (): number => {
    if (fuelLogs.length < 2) return 0;

    const sortedLogs = [...fuelLogs].sort((a, b) => a.mileage - b.mileage);
    let totalDistance = 0;
    let totalFuel = 0;

    for (let i = 1; i < sortedLogs.length; i++) {
      const distance = sortedLogs[i].mileage - sortedLogs[i - 1].mileage;
      if (distance > 0) {
        totalDistance += distance;
        totalFuel += sortedLogs[i].liters;
      }
    }

    if (totalFuel === 0) return 0;
    return totalDistance / totalFuel; // km per liter
  };

  const value: CarContextType = {
    carDetails,
    oilChanges,
    fuelLogs,
    expenses,
    updateCarDetails,
    addOilChange,
    deleteOilChange,
    addFuelLog,
    deleteFuelLog,
    addExpense,
    deleteExpense,
    calculateFuelAverage,
  };

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
};

export const useCarContext = () => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
};
