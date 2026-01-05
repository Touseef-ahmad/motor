# Development Guide

## Quick Start

### First Time Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create asset images**
   
   Before running the app, you need to create the following image files in the `assets/` directory:
   - `icon.png` (1024x1024) - App icon
   - `splash.png` (1242x2436) - Splash screen
   - `adaptive-icon.png` (1024x1024) - Android adaptive icon
   - `favicon.png` (48x48) - Web favicon

   For quick development, you can download placeholder images from:
   - https://placeholder.com/1024x1024.png (for icons)
   - https://placeholder.com/1242x2436.png (for splash)
   - https://placeholder.com/48x48.png (for favicon)

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run the app**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your device

## Project Structure

```
motor/
├── assets/              # Static assets (images, fonts)
├── src/
│   ├── components/      # Reusable components (future use)
│   ├── contexts/        # React Context providers
│   │   └── CarContext.tsx
│   ├── screens/         # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── OilChangeScreen.tsx
│   │   ├── FuelLogsScreen.tsx
│   │   ├── ExpensesScreen.tsx
│   │   └── CarDetailsScreen.tsx
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   └── utils/           # Utility functions (future use)
├── App.tsx              # Main app component
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript configuration
```

## Key Technologies

- **React Native**: Framework for building native apps
- **Expo**: Development platform
- **TypeScript**: Type safety
- **React Navigation**: Navigation between screens
- **AsyncStorage**: Local data persistence
- **Context API**: State management

## Development Tips

### Running TypeScript Type Checking

```bash
npx tsc --noEmit
```

### Clearing Cache

If you encounter issues, try clearing the cache:

```bash
npm start -- --clear
```

### Debugging

1. Enable Debug JS Remotely in the Expo menu (shake device or Cmd+D/Ctrl+M)
2. Use React DevTools for component inspection
3. Check console logs in the terminal

## Data Storage

All data is stored locally using AsyncStorage with the following keys:
- `@motor_car_details` - Car information
- `@motor_oil_changes` - Oil change records
- `@motor_fuel_logs` - Fuel refill logs
- `@motor_expenses` - Expense records

To reset app data during development, you can use:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear();
```

## Common Issues

### "Unable to resolve module" errors
```bash
npm install
npm start -- --clear
```

### TypeScript errors
```bash
npx tsc --noEmit
```

### Image picker not working
Make sure you've granted camera and photo library permissions.

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

Note: You'll need to set up EAS (Expo Application Services) for production builds.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run TypeScript check: `npx tsc --noEmit`
4. Test on both iOS and Android if possible
5. Submit a pull request

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
