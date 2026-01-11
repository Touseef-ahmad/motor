import { useMemo } from 'react';
import { FuelLog, TrackingState } from '../types';

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

      // Check for large gap (more than 1000 km)
      const gap = currentMileage - result.lastLog.mileage;
      if (gap > 1000) {
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
      if (fuelLevelIncrease > 0.3) {
        // Fuel increased by more than 30%
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
      Math.abs(currentFuelLevel - result.lastLog.fuelLevel) < 0.05
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
  if (fuelLevelChange > 0.1) {
    const isPartialRefuel = currentFuelLevel < 0.9; // Not full tank
    return {
      isBeforeRefuel: false,
      isAfterRefuel: true,
      isPartialRefuel,
    };
  }

  // Before refuel: fuel decreased or stayed same
  if (fuelLevelChange <= 0) {
    const isBeforeRefuel = currentFuelLevel < 0.5; // Less than half tank
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
