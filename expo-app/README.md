# Motor Expo App - Mobile Frontend 📱

React Native mobile application for the Motor car management system.

## 🎉 Now Connected to Cloud Backend!

The app is now configured to use the live backend API at `https://motor-api-ogln.onrender.com/api`

✅ **Cloud synchronization enabled**  
✅ **Multi-device support**  
✅ **Offline caching with AsyncStorage**

## Features

- Snapchat-style home screen with customizable car emoji profiles
- Oil change tracking with reminders
- Fuel consumption logging and average calculation
- Expense tracking by category
- Car details management with photo gallery
- **Cloud backend integration** with offline-first architecture

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator
- (Optional) Backend API server running

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create asset files**
   
   Create the following image files in the `assets/` directory:
   - `icon.png` (1024x1024) - App icon
   - `splash.png` (1242x2436) - Splash screen
   - `adaptive-icon.png` (1024x1024) - Android adaptive icon
   - `favicon.png` (48x48) - Web favicon

   See `assets/README_ASSETS.txt` for more details.

3. **API Configuration**
   
   The app is pre-configured to use the deployed backend at:
   ```
   https://motor-api-ogln.onrender.com/api
   ```
   
   To use a different backend or local storage only:
   - Edit `src/config/api.ts`
   - Set `USE_BACKEND = false` for local-only mode
   - Or update `API_URL` to your custom backend URL

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your device

## Configuration

### Using Backend API

To use the backend API instead of local AsyncStorage:

1. Ensure the backend server is running (see `/server/README.md`)
2. Update the API URL in your configuration
3. The app will automatically sync data with the backend

### Using Local Storage Only

The app works standalone with AsyncStorage for local data persistence. No backend required.

## Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
```

## Project Structure

```
expo-app/
├── assets/              # Static assets (images, fonts)
├── src/
│   ├── components/      # Reusable components
│   ├── contexts/        # React Context providers
│   ├── screens/         # App screens
│   ├── types/           # TypeScript type definitions
│   ├── config/          # Configuration files
│   └── utils/           # Utility functions
├── App.tsx              # Main app component
├── app.json             # Expo configuration
└── package.json         # Dependencies
```

## Technologies

- React Native 0.74.5
- Expo ~51.0.0
- TypeScript 5.1.3
- React Navigation 6.x
- AsyncStorage 1.23.1
- Expo Image Picker
- Expo Linear Gradient

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development guide.

## Support

For issues or questions, please open an issue in the main repository.
