# Fuel Logs Enhancement Documentation

## Overview

The Fuel Logs page has been enhanced to intelligently handle all real-world user behaviors and edge cases related to refueling, with a beautiful car-style fuel gauge slider component.

## New Features

### 1. FuelGaugeSlider Component

A custom car-style fuel gauge slider that provides an intuitive visual representation of fuel levels.

**Location**: `expo-app/src/components/FuelGaugeSlider.tsx`

**Features**:
- Semi-circular gauge visualization using SVG
- Gradient color scheme (Red → Yellow → Green) representing E to F
- Interactive drag-to-adjust functionality
- Real-time percentage display
- Visual indicators for E (Empty), ½ (Half), and F (Full)
- Animated needle that responds to touch
- Color-coded feedback based on fuel level

**Usage**:
```tsx
<FuelGaugeSlider
  value={fuelLevel}  // 0-1 (E to F)
  onChange={setFuelLevel}
  disabled={false}
/>
```

### 2. Enhanced Tracking State System

**Location**: `expo-app/src/hooks/useFuelLogState.ts`

The app now maintains intelligent tracking of fuel logs with the following states:

#### TrackingState Enum
- `Idle`: No pending refuel, normal state
- `BeforeRefuelPending`: User logged before refuel, waiting for after-refuel log
- `AfterRefuelPending`: Just refueled, ready to continue tracking
- `Inconsistent`: Missed logs or data gaps detected

#### Smart Detection Features
- **Odometer Validation**: Prevents decreasing mileage entries
- **Gap Detection**: Identifies large mileage gaps (>1000 km)
- **Fuel Level Jump Detection**: Automatically detects refueling from fuel level increases
- **Unchanged Level Detection**: Identifies mileage-only logs
- **Before/After Log Linking**: Automatically pairs related refuel logs

### 3. Enhanced Data Model

**New Fields in FuelLog**:
- `fuelLevel` (0-1): Actual fuel gauge reading
- `isBeforeRefuel`: Flag for pre-refuel logs
- `isAfterRefuel`: Flag for post-refuel logs
- `linkedLogId`: Reference to paired before/after log
- `trackingState`: Current tracking state
- `isPartialRefuel`: Flag for partial fill-ups (not to F)

**Backend Model Updated**: `server/src/models/FuelLog.ts`

### 4. Edge Case Handling

The system now intelligently handles these scenarios:

| Case | Handling |
|------|----------|
| **Ideal Case** | User logs before → refuels → logs after. System pairs entries and calculates mileage. |
| **Missed Before Refuel** | Detects fuel level jump and suggests creating a quick before log or skipping. |
| **Missed After Refuel** | Prompts on next open: "You didn't log after your last refuel." |
| **Partial Refuel** | Marks log as "partial" with visual badge when gauge doesn't reach F. |
| **Skipped Multiple Logs** | Offers "Reset Tracking" for large gaps. |
| **First-Time User** | Treats as "reset" baseline log. |
| **Wrong Odometer** | Shows validation error, blocks submission for decreasing values. |
| **Gauge Unchanged** | Confirms: "Same fuel level as before?" and suggests mileage-only log. |

### 5. UI Enhancements

#### State Badges
- ⛽ **Pending refuel**: Orange - Before-refuel log waiting for completion
- ✅ **Consistent**: Green - Properly paired before/after logs
- ⚠️ **Missed log**: Red - Inconsistent tracking detected
- ⛽ **Partial refuel**: Blue - Partial fill-up logged

#### Tracking State Bar
Visual indicator at the top of the screen showing current tracking status with color-coded backgrounds.

#### Reset Tracking Button
Allows users to manually reset tracking baseline after long gaps or missed entries.

#### Contextual Suggestions
Smart modal prompts guide users when inconsistencies are detected.

### 6. Optional Fields

The following fields are now optional to support flexible logging:
- `liters`: For when amount isn't known
- `cost`: For when cost isn't recorded
- Both can be omitted for simple fuel level tracking

### 7. Automatic Detection

The system automatically detects:
- When a refuel occurred (fuel level increase >10%)
- Partial vs. full refuels (fuel level <90% after refuel)
- Before-refuel conditions (fuel level <50%)

## Usage Guide

### Basic Refuel Logging

1. **Open Fuel Logs**: Tap the Fuel Logs tab
2. **Add Entry**: Tap "+ Add" button
3. **Set Fuel Level**: Use the interactive gauge slider
4. **Enter Mileage**: Required field for tracking
5. **Optional Details**: Add liters, cost, fuel type as needed
6. **Save**: System automatically detects log type

### Before/After Refuel Tracking

#### Before Refuel:
1. Before filling up, open the app
2. Set fuel gauge to current level (likely low)
3. Enter current mileage
4. Check "Log Before Refuel" if desired
5. Save - System marks as pending

#### After Refuel:
1. After filling up, open the app
2. Set fuel gauge to new level (high)
3. Enter new mileage
4. Add liters filled and cost
5. Save - System auto-links to before log

### Reset Tracking

Use when:
- Returning after a long break
- Multiple refuels were missed
- Starting fresh tracking

Tap "🔄 Reset" button and confirm.

## Technical Implementation

### Key Functions

**`useFuelLogState()`**
- Analyzes fuel log history
- Determines current tracking state
- Provides validation and suggestions

**`detectLogType()`**
- Compares current vs. last fuel level
- Classifies log as before/after/partial refuel

**`linkBeforeAfterLogs()`**
- Creates bidirectional links between paired logs

### State Flow

```
User Opens Form
    ↓
useFuelLogState analyzes history
    ↓
Determines TrackingState
    ↓
Provides suggestions if needed
    ↓
User enters data
    ↓
detectLogType classifies entry
    ↓
Save with tracking metadata
    ↓
Auto-link if applicable
```

## Migration Notes

### Backward Compatibility

- Existing logs without new fields work normally
- New fields are optional and nullable
- Old logs display without badges
- Fuel level defaults to 0.5 (half tank) if not set

### Database Migration

The backend model now includes new nullable columns:
- `fuelLevel` (FLOAT)
- `isBeforeRefuel` (BOOLEAN)
- `isAfterRefuel` (BOOLEAN)
- `linkedLogId` (UUID)
- `trackingState` (STRING)
- `isPartialRefuel` (BOOLEAN)

No data migration required - new fields default to NULL/false.

## Future Enhancements

Potential additions:
- Predictive refuel reminders based on patterns
- Route-based fuel consumption tracking
- Integration with GPS for automatic location logging
- Fuel price comparison and recommendations
- Export to CSV/PDF reports
- Chart visualizations of fuel efficiency over time

## Troubleshooting

**Issue**: Gauge slider not responding
**Solution**: Ensure PanResponder is not conflicting with ScrollView

**Issue**: Validation errors blocking submission
**Solution**: Check odometer values are increasing and all required fields filled

**Issue**: Suggestions appearing too frequently
**Solution**: Tap "Got it" to dismiss, system learns from patterns

**Issue**: Can't pair before/after logs
**Solution**: Ensure significant fuel level increase (>10%) between logs

## Code Examples

### Adding a Simple Log
```typescript
const newLog: Omit<FuelLog, 'id'> = {
  date: '2024-01-15',
  mileage: 50000,
  fuelLevel: 0.25,
  liters: 0,
  cost: 0,
  pricePerLiter: 0,
  fuelType: 'Regular',
  fullTank: false,
  notes: 'Quick level check'
};
```

### Adding a Full Refuel
```typescript
const refuelLog: Omit<FuelLog, 'id'> = {
  date: '2024-01-15',
  mileage: 50500,
  fuelLevel: 1.0,
  liters: 45,
  cost: 67.50,
  pricePerLiter: 1.50,
  fuelType: 'Regular',
  fullTank: true,
  isAfterRefuel: true,
  notes: 'Full tank at Shell'
};
```

## Testing Checklist

- [x] FuelGaugeSlider renders correctly
- [x] Slider responds to touch input
- [x] Odometer validation prevents invalid entries
- [x] State badges display correctly
- [x] Before/after logs auto-link
- [x] Partial refuels detected
- [x] Large gap warnings appear
- [x] Reset tracking works
- [x] Optional fields work (liters/cost)
- [x] Backward compatibility maintained

## Support

For issues or questions:
1. Check this documentation
2. Review code comments in source files
3. Open an issue on GitHub
4. Check existing issues for similar problems

---

**Last Updated**: January 2024
**Version**: 2.0.0
**Author**: Motor App Team
