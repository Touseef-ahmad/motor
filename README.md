# Motor - Car Management App 🚗

A feature-rich Expo React Native mobile application for comprehensive car management and tracking.

## 📱 Overview

Motor is a mobile app designed to help car owners track and manage all aspects of their vehicle ownership, from maintenance schedules to fuel consumption and expenses. The app features a unique Snapchat-style home screen with customizable emoji car profiles and animated backgrounds.

## ✨ Features

### Current Features

#### 🏠 Home Screen - Snapchat-Style Car Profile
- **Customizable Car Emoji**: Choose from 10 different car emojis (🚗, 🚙, 🚕, 🚓, 🏎️, etc.)
- **Animated Backgrounds**: Select from 6 gradient background themes (Blue, Purple, Pink, Orange, Green, Red)
- **Bounce Animation**: Interactive emoji animation on selection
- **Quick Stats Dashboard**: View key metrics at a glance
  - Fuel average (km/L)
  - Last oil change date
  - Total expenses
- **Activity Overview**: Quick access to logs and records count

#### 🛢️ Oil Change Tracker
- Record oil change dates and mileage
- Track service costs
- Set next oil change reminders based on mileage
- Add notes for each service
- Warning indicators when service is due
- Complete history of all oil changes

#### ⛽ Fuel Logs & Average Calculator
- Track every refuel with detailed information:
  - Date and current mileage
  - Liters filled and total cost
  - Price per liter calculation
  - Fuel type (Regular, Premium, Diesel, Electric)
  - Full tank indicator
- **Automatic Fuel Average Calculation**: Smart algorithm calculates km/L based on refuel logs
- Summary statistics:
  - Average fuel consumption
  - Total liters consumed
  - Total fuel expenses
- Comprehensive refuel history

#### 💰 Expense Tracker
- Track all car-related expenses by category:
  - Maintenance
  - Fuel
  - Insurance
  - Repair
  - Registration
  - Other
- Record details for each expense:
  - Date and description
  - Amount and mileage
  - Custom notes
- Category-specific icons for easy identification
- Total expenses summary
- Transaction history

#### 📋 Car Details & Photo Gallery
- Comprehensive car information management:
  - Car name, make, model, and year
  - Color and license plate
  - VIN (Vehicle Identification Number)
  - Purchase date
  - Current mileage
- **Photo Gallery**: 
  - Capture car photos using device camera
  - Choose photos from gallery
  - Multiple photo support
  - Easy photo management
- Required field validation

### 🎨 Design Features
- **Modern iOS-style UI**: Clean, professional interface
- **Gradient Backgrounds**: Beautiful color schemes
- **Smooth Animations**: Enhanced user experience
- **Intuitive Navigation**: Bottom tab navigation with icons
- **Modal Forms**: Easy data entry
- **Empty States**: Helpful guidance for new users

### 💾 Data Management
- **AsyncStorage Persistence**: All data saved locally
- **Real-time Updates**: Instant UI updates on data changes
- **Context API**: Centralized state management
- **Automatic Sorting**: Chronological ordering of records

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Touseef-ahmad/motor.git
   cd motor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create asset files**
   
   Create the following image files in the `assets` directory:
   - `icon.png` (1024x1024) - App icon
   - `splash.png` (1242x2436) - Splash screen
   - `adaptive-icon.png` (1024x1024) - Android adaptive icon
   - `favicon.png` (48x48) - Web favicon

   You can use placeholder images for development or create custom images.

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - **iOS**: Press `i` or scan the QR code with the Expo Go app
   - **Android**: Press `a` or scan the QR code with the Expo Go app
   - **Web**: Press `w` to open in browser

## 📱 Usage

### Setting Up Your Car
1. Navigate to the **Car Details** tab
2. Fill in your car information (name, make, model, year are required)
3. Add photos of your car using the camera or gallery
4. Save your details

### Customizing Your Profile
1. Go to the **Home** tab
2. Tap on the car emoji to choose a different one
3. Tap **🎨 Customize** to select a background color theme

### Tracking Oil Changes
1. Navigate to the **Oil Change** tab
2. Tap **+ Add** to create a new record
3. Enter the date, mileage, and cost
4. Optionally set the next change mileage
5. Save the record

### Logging Fuel Refills
1. Navigate to the **Fuel Logs** tab
2. Tap **+ Add** to log a refuel
3. Enter date, mileage, liters, and cost
4. Select fuel type and indicate if it's a full tank
5. Save - the app will automatically calculate your fuel average

### Recording Expenses
1. Navigate to the **Expenses** tab
2. Tap **+ Add** to create a new expense
3. Select category and enter description
4. Enter amount and optional mileage
5. Save the expense

## 🏗️ Project Structure

```
motor/
├── assets/                      # App assets (icons, images)
├── src/
│   ├── contexts/
│   │   └── CarContext.tsx      # Global state management
│   ├── screens/
│   │   ├── HomeScreen.tsx      # Snapchat-style home screen
│   │   ├── OilChangeScreen.tsx # Oil change tracker
│   │   ├── FuelLogsScreen.tsx  # Fuel logs and average
│   │   ├── ExpensesScreen.tsx  # Expense tracker
│   │   └── CarDetailsScreen.tsx # Car details and photos
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   └── components/              # Reusable components (future)
├── App.tsx                      # Main app component with navigation
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── babel.config.js              # Babel configuration
├── README.md                    # This file
└── TODO.md                      # Future features and improvements

```

## 🛠️ Technologies Used

- **React Native**: Mobile app framework
- **Expo**: Development platform and tooling
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
  - Bottom Tabs Navigator
  - Stack Navigator (for future screens)
- **AsyncStorage**: Local data persistence
- **Context API**: State management
- **Expo Linear Gradient**: Gradient backgrounds
- **Expo Image Picker**: Camera and gallery access
- **React Native Reanimated**: Smooth animations
- **Ionicons**: Icon library

## 📊 Data Models

### CarDetails
- Basic information (name, make, model, year)
- Visual customization (emoji, background colors)
- Photos and identification (VIN, license plate)
- Current mileage

### OilChange
- Service date and mileage
- Cost and notes
- Next change reminder

### FuelLog
- Refuel date and mileage
- Liters and cost
- Fuel type and full tank indicator
- Automatic price per liter calculation

### Expense
- Category-based tracking
- Date, description, and amount
- Optional mileage and notes

## 🔒 Privacy & Data

- All data is stored locally on the device using AsyncStorage
- No data is sent to external servers
- No account required
- Photos are stored locally on the device

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Icons from Expo Vector Icons (Ionicons)
- Design inspiration from modern iOS apps and Snapchat's UI/UX

## 📧 Support

For support, questions, or feedback, please open an issue in the GitHub repository.

---

**Made with ❤️ for car enthusiasts**