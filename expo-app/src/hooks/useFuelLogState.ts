import { useMemo } from 'react';
import { FuelLog, TrackingState } from '../types';

// Threshold constants for fuel level detection
const FUEL_LEVEL_JUMP_THRESHOLD = 0.3; // 30% increase suggests refuel
const FUEL_LEVEL_UNCHANGED_THRESHOLD = 0.05; // 5% tolerance for "unchanged"
const REFUEL_DETECTION_THRESHOLD = 0.1; // 10% increase indicates refuel
const FULL_TANK_THRESHOLD = 0.9; // 90% or above is considered full
const LOW_FUEL_THRESHOLD = 0.5; // Below 50% is considered low
const LARGE_MILEAGE_GAP = 1000; // km

interface FuelLogStateResult {
  trackingState: TrackingState;
  lastLog: FuelLog | null;
  pendingBeforeRefuelLog: FuelLog | null;
  suggestions: string[];
  canSubmit: boolean;
  validationErrors: string[];
}

export const useFuelLogState = (
  fuelLogs: FuelLog[],
  currentMileage?: number,
  currentFuelLevel?: number
): FuelLogStateResult => {
  return useMemo(() => {
    const result: FuelLogStateResult = {
      trackingState: TrackingState.Idle,
      lastLog: null,
      pendingBeforeRefuelLog: null,
      suggestions: [],
      canSubmit: true,
      validationErrors: [],
    };

    // Sort logs by mileage (descending)
    const sortedLogs = [...fuelLogs].sort((a, b) => b.mileage - a.mileage);
    
    if (sortedLogs.length === 0) {
      result.trackingState = TrackingState.Idle;
      result.suggestions.push('Start fresh with your first fuel log entry');
      return result;
    }

    result.lastLog = sortedLogs[0];

    // Validate odometer
    if (currentMileage !== undefined && result.lastLog) {
      if (currentMileage < result.lastLog.mileage) {
        result.validationErrors.push('Odometer cannot decrease from last entry');
        result.canSubmit = false;
      }

      // Check for large gap (more than LARGE_MILEAGE_GAP km)
      const gap = currentMileage - result.lastLog.mileage;
      if (gap > LARGE_MILEAGE_GAP) {
        result.suggestions.push(
          'Large mileage gap detected. Consider using "Reset Tracking" if you missed multiple refuels.'
        );
        result.trackingState = TrackingState.Inconsistent;
      }
    }

    // Detect tracking state based on last log
    if (result.lastLog.isBeforeRefuel && !result.lastLog.linkedLogId) {
      result.trackingState = TrackingState.BeforeRefuelPending;
      result.pendingBeforeRefuelLog = result.lastLog;
      result.suggestions.push(
        'You logged before refueling. Did you refuel? Log the after-refuel entry.'
      );
    } else if (result.lastLog.isAfterRefuel) {
      result.trackingState = TrackingState.AfterRefuelPending;
    } else {
      result.trackingState = TrackingState.Idle;
    }

    // Check for fuel level jump (suggests missed before-refuel log)
    if (
      currentFuelLevel !== undefined &&
      result.lastLog.fuelLevel !== undefined &&
      !result.lastLog.isBeforeRefuel
    ) {
      const fuelLevelIncrease = currentFuelLevel - result.lastLog.fuelLevel;
      if (fuelLevelIncrease > FUEL_LEVEL_JUMP_THRESHOLD) {
        // Fuel increased by more than threshold
        result.suggestions.push(
          'Looks like you refueled recently. Create a quick "before refuel" log or skip?'
        );
        result.trackingState = TrackingState.Inconsistent;
      }
    }

    // Check for unchanged fuel level
    if (
      currentFuelLevel !== undefined &&
      result.lastLog.fuelLevel !== undefined &&
      Math.abs(currentFuelLevel - result.lastLog.fuelLevel) < FUEL_LEVEL_UNCHANGED_THRESHOLD
    ) {
      result.suggestions.push('Same fuel level as last entry. Logging mileage only?');
    }

    return result;
  }, [fuelLogs, currentMileage, currentFuelLevel]);
};

export const detectLogType = (
  currentFuelLevel: number,
  lastFuelLevel?: number
): {
  isBeforeRefuel: boolean;
  isAfterRefuel: boolean;
  isPartialRefuel: boolean;
} => {
  if (lastFuelLevel === undefined) {
    return {
      isBeforeRefuel: false,
      isAfterRefuel: false,
      isPartialRefuel: false,
    };
  }

  const fuelLevelChange = currentFuelLevel - lastFuelLevel;

  // After refuel: fuel increased
  if (fuelLevelChange > REFUEL_DETECTION_THRESHOLD) {
    const isPartialRefuel = currentFuelLevel < FULL_TANK_THRESHOLD; // Not full tank
    return {
      isBeforeRefuel: false,
      isAfterRefuel: true,
      isPartialRefuel,
    };
  }

  // Before refuel: fuel decreased or stayed same
  if (fuelLevelChange <= 0) {
    const isBeforeRefuel = currentFuelLevel < LOW_FUEL_THRESHOLD; // Less than half tank
    return {
      isBeforeRefuel,
      isAfterRefuel: false,
      isPartialRefuel: false,
    };
  }

  return {
    isBeforeRefuel: false,
    isAfterRefuel: false,
    isPartialRefuel: false,
  };
};

export const linkBeforeAfterLogs = (
  beforeLog: FuelLog,
  afterLog: FuelLog
): { updatedBefore: FuelLog; updatedAfter: FuelLog } => {
  return {
    updatedBefore: {
      ...beforeLog,
      linkedLogId: afterLog.id,
    },
    updatedAfter: {
      ...afterLog,
      linkedLogId: beforeLog.id,
    },
  };
};
