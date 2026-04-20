import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import {
  CarDetails,
  OilChange,
  FuelLog,
  Expense,
  CarContextType,
} from "../types";
import { USE_BACKEND } from "../config/api";
import { CarAPI, OilChangeAPI, FuelLogAPI, ExpenseAPI } from "../services/api";

// ─── Pending Action Types ─────────────────────────────────────────────────────

type PendingActionType =
  | "ADD_OIL_CHANGE"
  | "DELETE_OIL_CHANGE"
  | "ADD_FUEL_LOG"
  | "DELETE_FUEL_LOG"
  | "ADD_EXPENSE"
  | "DELETE_EXPENSE";

interface PendingAction {
  id: string;
  type: PendingActionType;
  payload: any;
  timestamp: number;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  CAR_DETAILS: "@motor_car_details",
  OIL_CHANGES: "@motor_oil_changes",
  FUEL_LOGS: "@motor_fuel_logs",
  EXPENSES: "@motor_expenses",
  CAR_ID: "@motor_car_id",
  PENDING_ACTIONS: "@motor_pending_actions",
};

// ─── Context ──────────────────────────────────────────────────────────────────

const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
  const [oilChanges, setOilChanges] = useState<OilChange[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [carId, setCarId] = useState<string | null>(null);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);

  // Ref so async sync callbacks always see the latest carId without stale closures
  const carIdRef = useRef<string | null>(null);
  useEffect(() => {
    carIdRef.current = carId;
  }, [carId]);

  // ─── Startup ────────────────────────────────────────────────────────────────

  useEffect(() => {
    loadData();
  }, []);

  // ─── NetInfo: auto-sync when connectivity returns ───────────────────────────

  useEffect(() => {
    if (!USE_BACKEND) return;
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        // Reads fresh queue from AsyncStorage to avoid stale closure
        syncPendingActions();
      }
    });
    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Data Loading ───────────────────────────────────────────────────────────

  const loadData = async () => {
    try {
      // 1. Always show cached data immediately — the app is usable offline
      await loadFromAsyncStorage();

      if (!USE_BACKEND) return;

      // 2. Restore the pending queue and carId from storage
      const [pendingRaw, storedCarId] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS),
        AsyncStorage.getItem(STORAGE_KEYS.CAR_ID),
      ]);

      const queue: PendingAction[] = pendingRaw ? JSON.parse(pendingRaw) : [];
      setPendingActions(queue);

      let currentCarId = storedCarId;
      if (currentCarId) {
        setCarId(currentCarId);
        carIdRef.current = currentCarId;
      }

      // 3. Flush pending actions (graceful no-op when offline)
      if (queue.length > 0 && currentCarId) {
        await syncPendingActions(currentCarId);
      }

      // 4. Refresh from server — but only if all pending actions were flushed,
      //    so locally-added items are never overwritten by a stale server response.
      const afterSyncRaw = await AsyncStorage.getItem(
        STORAGE_KEYS.PENDING_ACTIONS,
      );
      const afterSyncQueue: PendingAction[] = afterSyncRaw
        ? JSON.parse(afterSyncRaw)
        : [];

      if (afterSyncQueue.length === 0) {
        if (currentCarId) {
          await refreshFromServer(currentCarId);
        } else {
          // No stored carId — try to discover one from the server
          try {
            const cars = await CarAPI.getAllCars();
            if (cars.length > 0) {
              currentCarId = cars[0].id;
              await AsyncStorage.setItem(STORAGE_KEYS.CAR_ID, currentCarId);
              setCarId(currentCarId);
              carIdRef.current = currentCarId;
              await refreshFromServer(currentCarId);
            }
          } catch {
            // Offline or no cars on server yet — local cache is the source of truth
          }
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const loadFromAsyncStorage = async () => {
    const [carDetailsData, oilChangesData, fuelLogsData, expensesData] =
      await Promise.all([
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

  const refreshFromServer = async (activeCarId: string) => {
    try {
      const [car, oilChangesData, fuelLogsData, expensesData] =
        await Promise.all([
          CarAPI.getCarDetails(activeCarId),
          OilChangeAPI.getOilChanges(activeCarId),
          FuelLogAPI.getFuelLogs(activeCarId),
          ExpenseAPI.getExpenses(activeCarId),
        ]);

      const sortedOilChanges = oilChangesData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      const sortedFuelLogs = fuelLogsData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      const sortedExpenses = expensesData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      setCarDetails(car);
      setOilChanges(sortedOilChanges);
      setFuelLogs(sortedFuelLogs);
      setExpenses(sortedExpenses);

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.CAR_DETAILS, JSON.stringify(car)),
        AsyncStorage.setItem(
          STORAGE_KEYS.OIL_CHANGES,
          JSON.stringify(sortedOilChanges),
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.FUEL_LOGS,
          JSON.stringify(sortedFuelLogs),
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.EXPENSES,
          JSON.stringify(sortedExpenses),
        ),
      ]);
    } catch {
      // Offline — local cache remains the source of truth
    }
  };

  // ─── Pending Queue Helpers ──────────────────────────────────────────────────

  /**
   * Appends a new action to the persisted pending queue.
   * Always reads the current queue from AsyncStorage to prevent race conditions
   * when multiple operations are performed in quick succession.
   */
  const enqueue = async (
    action: Omit<PendingAction, "id" | "timestamp">,
  ): Promise<PendingAction[]> => {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
    const currentQueue: PendingAction[] = raw ? JSON.parse(raw) : [];

    const newAction: PendingAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: Date.now(),
    };

    const updated = [...currentQueue, newAction];
    await AsyncStorage.setItem(
      STORAGE_KEYS.PENDING_ACTIONS,
      JSON.stringify(updated),
    );
    setPendingActions(updated);
    return updated;
  };

  // ─── Sync Engine ────────────────────────────────────────────────────────────

  /**
   * Processes every action in the pending queue. Each successfully synced action
   * is immediately removed so an app restart never re-submits it. Failed actions
   * stay in the queue and are retried on the next sync attempt.
   */
  const syncPendingActions = async (explicitCarId?: string) => {
    if (!USE_BACKEND) return;

    const activeCarId = explicitCarId ?? carIdRef.current;
    if (!activeCarId) return;

    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
    const queue: PendingAction[] = raw ? JSON.parse(raw) : [];
    if (queue.length === 0) return;

    let remainingQueue = [...queue];
    // Maps local_* IDs → server UUIDs within a single sync run so that
    // linkedLogId references are resolved before being sent to the server.
    const idMap = new Map<string, string>();

    for (const action of queue) {
      try {
        await processAction(action, activeCarId, idMap);
        remainingQueue = remainingQueue.filter((a) => a.id !== action.id);
        await AsyncStorage.setItem(
          STORAGE_KEYS.PENDING_ACTIONS,
          JSON.stringify(remainingQueue),
        );
        setPendingActions(remainingQueue);
      } catch {
        // Keep in queue; will retry when connectivity returns or on next startup
      }
    }
  };

  /**
   * Executes a single pending action against the real API.
   * For ADD actions the server record replaces the local placeholder in storage,
   * so the ID transitions from the client-generated `local_*` value to the
   * server-assigned ID.
   */
  const processAction = async (
    action: PendingAction,
    activeCarId: string,
    idMap: Map<string, string>,
  ): Promise<void> => {
    switch (action.type) {
      case "ADD_OIL_CHANGE": {
        const { localId, data } = action.payload as {
          localId: string;
          data: Omit<OilChange, "id">;
        };
        const created = await OilChangeAPI.createOilChange(activeCarId, {
          ...data,
          externalId: localId,
        } as any);
        idMap.set(localId, created.id);
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.OIL_CHANGES);
        const current: OilChange[] = stored ? JSON.parse(stored) : [];
        const updated = current
          .map((item) => (item.id === localId ? created : item))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
        await AsyncStorage.setItem(
          STORAGE_KEYS.OIL_CHANGES,
          JSON.stringify(updated),
        );
        setOilChanges(updated);
        break;
      }

      case "DELETE_OIL_CHANGE":
        await OilChangeAPI.deleteOilChange(action.payload.id as string);
        break;

      case "ADD_FUEL_LOG": {
        const { localId, data } = action.payload as {
          localId: string;
          data: Omit<FuelLog, "id">;
        };
        // Resolve linkedLogId: replace any local_* reference with the server
        // UUID that was recorded earlier in this sync run.
        const resolvedLinkedLogId = data.linkedLogId
          ? (idMap.get(data.linkedLogId) ??
            (data.linkedLogId.startsWith("local_")
              ? undefined
              : data.linkedLogId))
          : data.linkedLogId;
        const created = await FuelLogAPI.createFuelLog(activeCarId, {
          ...data,
          linkedLogId: resolvedLinkedLogId,
          externalId: localId,
        } as any);
        idMap.set(localId, created.id);
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.FUEL_LOGS);
        const current: FuelLog[] = stored ? JSON.parse(stored) : [];
        const updated = current
          .map((item) => (item.id === localId ? created : item))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
        await AsyncStorage.setItem(
          STORAGE_KEYS.FUEL_LOGS,
          JSON.stringify(updated),
        );
        setFuelLogs(updated);
        break;
      }

      case "DELETE_FUEL_LOG":
        await FuelLogAPI.deleteFuelLog(action.payload.id as string);
        break;

      case "ADD_EXPENSE": {
        const { localId, data } = action.payload as {
          localId: string;
          data: Omit<Expense, "id">;
        };
        const created = await ExpenseAPI.createExpense(activeCarId, {
          ...data,
          externalId: localId,
        } as any);
        idMap.set(localId, created.id);
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
        const current: Expense[] = stored ? JSON.parse(stored) : [];
        const updated = current
          .map((item) => (item.id === localId ? created : item))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
        await AsyncStorage.setItem(
          STORAGE_KEYS.EXPENSES,
          JSON.stringify(updated),
        );
        setExpenses(updated);
        break;
      }

      case "DELETE_EXPENSE":
        await ExpenseAPI.deleteExpense(action.payload.id as string);
        break;
    }
  };

  // ─── Car Details ────────────────────────────────────────────────────────────

  const updateCarDetails = async (details: CarDetails) => {
    // Save locally first so the UI is always responsive
    await AsyncStorage.setItem(
      STORAGE_KEYS.CAR_DETAILS,
      JSON.stringify(details),
    );
    setCarDetails(details);

    if (!USE_BACKEND) return;

    try {
      if (carIdRef.current) {
        const updated = await CarAPI.updateCar(carIdRef.current, details);
        setCarDetails(updated);
        await AsyncStorage.setItem(
          STORAGE_KEYS.CAR_DETAILS,
          JSON.stringify(updated),
        );
      } else {
        const created = await CarAPI.createCar(details);
        setCarId(created.id);
        carIdRef.current = created.id;
        setCarDetails(created);
        await AsyncStorage.setItem(STORAGE_KEYS.CAR_ID, created.id);
        await AsyncStorage.setItem(
          STORAGE_KEYS.CAR_DETAILS,
          JSON.stringify(created),
        );
      }
    } catch (error) {
      console.error(
        "Car details saved locally; will sync when back online:",
        error,
      );
    }
  };

  // ─── Oil Changes ────────────────────────────────────────────────────────────

  const addOilChange = async (oilChange: Omit<OilChange, "id">) => {
    // 1. Optimistic local save — UI is instant
    const localId = `local_${Date.now()}`;
    const newItem: OilChange = { ...oilChange, id: localId };
    const updated = [...oilChanges, newItem].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    await AsyncStorage.setItem(
      STORAGE_KEYS.OIL_CHANGES,
      JSON.stringify(updated),
    );
    setOilChanges(updated);

    if (!USE_BACKEND) return;

    // 2. Queue and attempt an immediate sync
    await enqueue({
      type: "ADD_OIL_CHANGE",
      payload: { localId, data: oilChange },
    });
    await syncPendingActions();
  };

  const deleteOilChange = async (id: string) => {
    // 1. Optimistic local delete
    const updated = oilChanges.filter((oc) => oc.id !== id);
    await AsyncStorage.setItem(
      STORAGE_KEYS.OIL_CHANGES,
      JSON.stringify(updated),
    );
    setOilChanges(updated);

    if (!USE_BACKEND) return;

    // 2. Read the live queue from storage
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
    const currentQueue: PendingAction[] = raw ? JSON.parse(raw) : [];

    // 2a. If this item was never synced (pending ADD exists), cancel both —
    //     nothing ever reached the server so no API call is needed.
    const pendingAddIdx = currentQueue.findIndex(
      (a) => a.type === "ADD_OIL_CHANGE" && a.payload.localId === id,
    );
    if (pendingAddIdx !== -1) {
      const newQueue = currentQueue.filter((_, i) => i !== pendingAddIdx);
      await AsyncStorage.setItem(
        STORAGE_KEYS.PENDING_ACTIONS,
        JSON.stringify(newQueue),
      );
      setPendingActions(newQueue);
      return;
    }

    // 2b. Item exists on the server — queue and attempt delete
    await enqueue({ type: "DELETE_OIL_CHANGE", payload: { id } });
    await syncPendingActions();
  };

  // ─── Fuel Logs ──────────────────────────────────────────────────────────────

  const addFuelLog = async (fuelLog: Omit<FuelLog, "id">) => {
    const localId = `local_${Date.now()}`;
    const newItem: FuelLog = { ...fuelLog, id: localId };
    const updated = [...fuelLogs, newItem].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    await AsyncStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(updated));
    setFuelLogs(updated);

    if (!USE_BACKEND) return;

    await enqueue({
      type: "ADD_FUEL_LOG",
      payload: { localId, data: fuelLog },
    });
    await syncPendingActions();
  };

  const deleteFuelLog = async (id: string) => {
    const updated = fuelLogs.filter((fl) => fl.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(updated));
    setFuelLogs(updated);

    if (!USE_BACKEND) return;

    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
    const currentQueue: PendingAction[] = raw ? JSON.parse(raw) : [];

    const pendingAddIdx = currentQueue.findIndex(
      (a) => a.type === "ADD_FUEL_LOG" && a.payload.localId === id,
    );
    if (pendingAddIdx !== -1) {
      const newQueue = currentQueue.filter((_, i) => i !== pendingAddIdx);
      await AsyncStorage.setItem(
        STORAGE_KEYS.PENDING_ACTIONS,
        JSON.stringify(newQueue),
      );
      setPendingActions(newQueue);
      return;
    }

    await enqueue({ type: "DELETE_FUEL_LOG", payload: { id } });
    await syncPendingActions();
  };

  // ─── Expenses ───────────────────────────────────────────────────────────────

  const addExpense = async (expense: Omit<Expense, "id">) => {
    const localId = `local_${Date.now()}`;
    const newItem: Expense = { ...expense, id: localId };
    const updated = [...expenses, newItem].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
    setExpenses(updated);

    if (!USE_BACKEND) return;

    await enqueue({ type: "ADD_EXPENSE", payload: { localId, data: expense } });
    await syncPendingActions();
  };

  const deleteExpense = async (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
    setExpenses(updated);

    if (!USE_BACKEND) return;

    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
    const currentQueue: PendingAction[] = raw ? JSON.parse(raw) : [];

    const pendingAddIdx = currentQueue.findIndex(
      (a) => a.type === "ADD_EXPENSE" && a.payload.localId === id,
    );
    if (pendingAddIdx !== -1) {
      const newQueue = currentQueue.filter((_, i) => i !== pendingAddIdx);
      await AsyncStorage.setItem(
        STORAGE_KEYS.PENDING_ACTIONS,
        JSON.stringify(newQueue),
      );
      setPendingActions(newQueue);
      return;
    }

    await enqueue({ type: "DELETE_EXPENSE", payload: { id } });
    await syncPendingActions();
  };

  // ─── Calculations ───────────────────────────────────────────────────────────

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

  // ─── Context Value ──────────────────────────────────────────────────────────

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
    throw new Error("useCarContext must be used within a CarProvider");
  }
  return context;
};
