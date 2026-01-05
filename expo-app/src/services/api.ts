import { API_URL, USE_BACKEND, API_ENDPOINTS } from '../config/api';
import { CarDetails, OilChange, FuelLog, Expense } from '../types';

// Helper function to make API requests
const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Car Details API
export const CarAPI = {
  getAllCars: async (): Promise<CarDetails[]> => {
    if (!USE_BACKEND) return [];
    return apiRequest(API_ENDPOINTS.cars);
  },

  getCarDetails: async (carId: string): Promise<CarDetails> => {
    if (!USE_BACKEND) throw new Error('Backend not enabled');
    return apiRequest(API_ENDPOINTS.carDetails(carId));
  },

  createCar: async (car: Omit<CarDetails, 'id'>): Promise<CarDetails> => {
    if (!USE_BACKEND) throw new Error('Backend not enabled');
    return apiRequest(API_ENDPOINTS.cars, {
      method: 'POST',
      body: JSON.stringify(car),
    });
  },

  updateCar: async (carId: string, car: Partial<CarDetails>): Promise<CarDetails> => {
    if (!USE_BACKEND) throw new Error('Backend not enabled');
    return apiRequest(API_ENDPOINTS.carDetails(carId), {
      method: 'PUT',
      body: JSON.stringify(car),
    });
  },

  deleteCar: async (carId: string): Promise<void> => {
    if (!USE_BACKEND) throw new Error('Backend not enabled');
    await apiRequest(API_ENDPOINTS.carDetails(carId), {
      method: 'DELETE',
    });
  },
};

// Oil Change API
export const OilChangeAPI = {
  getOilChanges: async (carId: string): Promise<OilChange[]> => {
    if (!USE_BACKEND) return [];
    return apiRequest(API_ENDPOINTS.oilChanges(carId));
  },

  createOilChange: async (carId: string, oilChange: Omit<OilChange, 'id'>): Promise<OilChange> => {
    if (!USE_BACKEND) throw new Error('Backend not enabled');
    return apiRequest(API_ENDPOINTS.oilChanges(carId), {
      method: 'POST',
      body: JSON.stringify(oilChange),
    });
  },

  deleteOilChange: async (id: string): Promise<void> => {
    if (!USE_BACKEND) throw new Error('Backend not enabled');
    await apiRequest(API_ENDPOINTS.deleteOilChange(id), {
      method: 'DELETE',
    });
  },
};

// Fuel Log API
export const FuelLogAPI = {
  getFuelLogs: async (carId: string): Promise<FuelLog[]> => {
    if (!USE_BACKEND) return [];
    return apiRequest(API_ENDPOINTS.fuelLogs(carId));
  },

  createFuelLog: async (carId: string, fuelLog: Omit<FuelLog, 'id'>): Promise<FuelLog> => {
    if (!USE_BACKEND) throw new Error('Backend not enabled');
    return apiRequest(API_ENDPOINTS.fuelLogs(carId), {
      method: 'POST',
      body: JSON.stringify(fuelLog),
    });
  },

  deleteFuelLog: async (id: string): Promise<void> => {
    if (!USE_BACKEND) throw new Error('Backend not enabled');
    await apiRequest(API_ENDPOINTS.deleteFuelLog(id), {
      method: 'DELETE',
    });
  },

  getFuelAverage: async (carId: string): Promise<{ average: number }> => {
    if (!USE_BACKEND) return { average: 0 };
    return apiRequest(API_ENDPOINTS.fuelAverage(carId));
  },
};

// Expense API
export const ExpenseAPI = {
  getExpenses: async (carId: string): Promise<Expense[]> => {
    if (!USE_BACKEND) return [];
    return apiRequest(API_ENDPOINTS.expenses(carId));
  },

  createExpense: async (carId: string, expense: Omit<Expense, 'id'>): Promise<Expense> => {
    if (!USE_BACKEND) throw new Error('Backend not enabled');
    return apiRequest(API_ENDPOINTS.expenses(carId), {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  },

  deleteExpense: async (id: string): Promise<void> => {
    if (!USE_BACKEND) throw new Error('Backend not enabled');
    await apiRequest(API_ENDPOINTS.deleteExpense(id), {
      method: 'DELETE',
    });
  },
};
