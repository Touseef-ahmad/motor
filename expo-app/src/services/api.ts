import { API_URL, USE_BACKEND, API_ENDPOINTS } from "../config/api";
import { CarDetails, OilChange, FuelLog, Expense } from "../types";

// ─── In-memory token store ────────────────────────────────────────────────────
// AuthContext sets this on startup and after every login/token refresh.
// Using module scope avoids reading AsyncStorage on every API call.

let _accessToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  _accessToken = token;
};

// ─── Request helper ───────────────────────────────────────────────────────────

const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (_accessToken) {
    headers["Authorization"] = `Bearer ${_accessToken}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.error ||
      errorData.message ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  // 204 No Content — nothing to parse
  if (response.status === 204) return undefined;

  return response.json();
};

// ─── Auth API ─────────────────────────────────────────────────────────────────

export interface AuthResponse {
  user: { id: string; email: string };
  accessToken: string;
  refreshToken: string;
}

export const AuthAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> =>
    apiRequest(API_ENDPOINTS.authLogin, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: async (email: string, password: string): Promise<AuthResponse> =>
    apiRequest(API_ENDPOINTS.authRegister, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  refresh: async (refreshToken: string): Promise<{ accessToken: string }> =>
    apiRequest(API_ENDPOINTS.authRefresh, {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  logout: async (): Promise<void> => {
    await apiRequest(API_ENDPOINTS.authLogout, { method: "POST" }).catch(() => {
      // Best-effort; client clears tokens regardless
    });
  },
};

// Car Details API
export const CarAPI = {
  getAllCars: async (): Promise<CarDetails[]> => {
    if (!USE_BACKEND) return [];
    return apiRequest(API_ENDPOINTS.cars);
  },

  getCarDetails: async (carId: string): Promise<CarDetails> => {
    if (!USE_BACKEND) throw new Error("Backend not enabled");
    return apiRequest(API_ENDPOINTS.carDetails(carId));
  },

  createCar: async (car: Omit<CarDetails, "id">): Promise<CarDetails> => {
    if (!USE_BACKEND) throw new Error("Backend not enabled");
    return apiRequest(API_ENDPOINTS.cars, {
      method: "POST",
      body: JSON.stringify(car),
    });
  },

  updateCar: async (
    carId: string,
    car: Partial<CarDetails>,
  ): Promise<CarDetails> => {
    if (!USE_BACKEND) throw new Error("Backend not enabled");
    return apiRequest(API_ENDPOINTS.carDetails(carId), {
      method: "PUT",
      body: JSON.stringify(car),
    });
  },

  deleteCar: async (carId: string): Promise<void> => {
    if (!USE_BACKEND) throw new Error("Backend not enabled");
    await apiRequest(API_ENDPOINTS.carDetails(carId), {
      method: "DELETE",
    });
  },
};

// Oil Change API
export const OilChangeAPI = {
  getOilChanges: async (carId: string): Promise<OilChange[]> => {
    if (!USE_BACKEND) return [];
    return apiRequest(API_ENDPOINTS.oilChanges(carId));
  },

  createOilChange: async (
    carId: string,
    oilChange: Omit<OilChange, "id">,
  ): Promise<OilChange> => {
    if (!USE_BACKEND) throw new Error("Backend not enabled");
    return apiRequest(API_ENDPOINTS.oilChanges(carId), {
      method: "POST",
      body: JSON.stringify(oilChange),
    });
  },

  deleteOilChange: async (id: string): Promise<void> => {
    if (!USE_BACKEND) throw new Error("Backend not enabled");
    await apiRequest(API_ENDPOINTS.deleteOilChange(id), {
      method: "DELETE",
    });
  },
};

// Fuel Log API
export const FuelLogAPI = {
  getFuelLogs: async (carId: string): Promise<FuelLog[]> => {
    if (!USE_BACKEND) return [];
    return apiRequest(API_ENDPOINTS.fuelLogs(carId));
  },

  createFuelLog: async (
    carId: string,
    fuelLog: Omit<FuelLog, "id">,
  ): Promise<FuelLog> => {
    if (!USE_BACKEND) throw new Error("Backend not enabled");
    return apiRequest(API_ENDPOINTS.fuelLogs(carId), {
      method: "POST",
      body: JSON.stringify(fuelLog),
    });
  },

  deleteFuelLog: async (id: string): Promise<void> => {
    if (!USE_BACKEND) throw new Error("Backend not enabled");
    await apiRequest(API_ENDPOINTS.deleteFuelLog(id), {
      method: "DELETE",
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

  createExpense: async (
    carId: string,
    expense: Omit<Expense, "id">,
  ): Promise<Expense> => {
    if (!USE_BACKEND) throw new Error("Backend not enabled");
    return apiRequest(API_ENDPOINTS.expenses(carId), {
      method: "POST",
      body: JSON.stringify(expense),
    });
  },

  deleteExpense: async (id: string): Promise<void> => {
    if (!USE_BACKEND) throw new Error("Backend not enabled");
    await apiRequest(API_ENDPOINTS.deleteExpense(id), {
      method: "DELETE",
    });
  },
};
