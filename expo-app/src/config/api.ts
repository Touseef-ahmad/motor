// API Configuration
// Set USE_BACKEND to true to use the Express backend API
// Set to false to use local AsyncStorage only

export const USE_BACKEND = true; // Backend is now deployed and ready!

export const API_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'https://motor-api-ogln.onrender.com/api'; // Production

export const API_ENDPOINTS = {
  cars: '/cars',
  carDetails: (carId: string) => `/cars/${carId}`,
  oilChanges: (carId: string) => `/cars/${carId}/oil-changes`,
  fuelLogs: (carId: string) => `/cars/${carId}/fuel-logs`,
  fuelAverage: (carId: string) => `/cars/${carId}/fuel-average`,
  expenses: (carId: string) => `/cars/${carId}/expenses`,
  deleteOilChange: (id: string) => `/cars/oil-changes/${id}`,
  deleteFuelLog: (id: string) => `/cars/fuel-logs/${id}`,
  deleteExpense: (id: string) => `/cars/expenses/${id}`,
};
