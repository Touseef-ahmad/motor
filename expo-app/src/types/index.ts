export interface CarDetails {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  purchaseDate?: string;
  currentMileage: number;
  images: string[];
  emoji: string;
  backgroundStyle: 'solid' | 'gradient' | 'animated';
  backgroundColor: string;
  secondaryColor?: string;
}

export interface OilChange {
  id: string;
  date: string;
  mileage: number;
  cost: number;
  notes?: string;
  nextChangeMileage?: number;
  nextChangeDate?: string;
}

export interface FuelLog {
  id: string;
  date: string;
  mileage: number;
  liters: number;
  cost: number;
  pricePerLiter: number;
  fuelType: 'Regular' | 'Premium' | 'Diesel' | 'Electric';
  fullTank: boolean;
  notes?: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'Maintenance' | 'Fuel' | 'Insurance' | 'Repair' | 'Registration' | 'Other';
  description: string;
  amount: number;
  mileage?: number;
  notes?: string;
}

export interface CarContextType {
  carDetails: CarDetails | null;
  oilChanges: OilChange[];
  fuelLogs: FuelLog[];
  expenses: Expense[];
  updateCarDetails: (details: CarDetails) => Promise<void>;
  addOilChange: (oilChange: Omit<OilChange, 'id'>) => Promise<void>;
  deleteOilChange: (id: string) => Promise<void>;
  addFuelLog: (fuelLog: Omit<FuelLog, 'id'>) => Promise<void>;
  deleteFuelLog: (id: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  calculateFuelAverage: () => number;
}
