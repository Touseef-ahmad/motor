import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CarDetails, OilChange, FuelLog, Expense, CarContextType } from '../types';

const CarContext = createContext<CarContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CAR_DETAILS: '@motor_car_details',
  OIL_CHANGES: '@motor_oil_changes',
  FUEL_LOGS: '@motor_fuel_logs',
  EXPENSES: '@motor_expenses',
};

export const CarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
  const [oilChanges, setOilChanges] = useState<OilChange[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
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
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const updateCarDetails = async (details: CarDetails) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CAR_DETAILS, JSON.stringify(details));
      setCarDetails(details);
    } catch (error) {
      console.error('Error saving car details:', error);
    }
  };

  const addOilChange = async (oilChange: Omit<OilChange, 'id'>) => {
    try {
      const newOilChange = { ...oilChange, id: Date.now().toString() };
      const updated = [...oilChanges, newOilChange].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      await AsyncStorage.setItem(STORAGE_KEYS.OIL_CHANGES, JSON.stringify(updated));
      setOilChanges(updated);
    } catch (error) {
      console.error('Error adding oil change:', error);
    }
  };

  const deleteOilChange = async (id: string) => {
    try {
      const updated = oilChanges.filter(oc => oc.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.OIL_CHANGES, JSON.stringify(updated));
      setOilChanges(updated);
    } catch (error) {
      console.error('Error deleting oil change:', error);
    }
  };

  const addFuelLog = async (fuelLog: Omit<FuelLog, 'id'>) => {
    try {
      const newFuelLog = { ...fuelLog, id: Date.now().toString() };
      const updated = [...fuelLogs, newFuelLog].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      await AsyncStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(updated));
      setFuelLogs(updated);
    } catch (error) {
      console.error('Error adding fuel log:', error);
    }
  };

  const deleteFuelLog = async (id: string) => {
    try {
      const updated = fuelLogs.filter(fl => fl.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(updated));
      setFuelLogs(updated);
    } catch (error) {
      console.error('Error deleting fuel log:', error);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const newExpense = { ...expense, id: Date.now().toString() };
      const updated = [...expenses, newExpense].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
      setExpenses(updated);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
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
