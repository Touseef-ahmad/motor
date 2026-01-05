# Motor - Car Management App 🚗

A full-stack car management application with Expo React Native mobile frontend and Express.js backend with PostgreSQL.

## 🚀 Quick Deploy to Render

**Deploy the backend in minutes!** 

👉 **[Quick Deploy Guide](./RENDER_DEPLOY.md)** | **[Full Deployment Guide](./DEPLOYMENT.md)**

The backend API is ready to deploy to [Render.com](https://render.com) with one click using the included Blueprint configuration.

## 🏗️ Project Structure

This is a monorepo containing:

```
/motor
  /expo-app    # React Native mobile frontend
  /server      # Node.js/Express backend with PostgreSQL
```

### Expo App (Mobile Frontend)
- React Native mobile application
- Snapchat-style home screen with customizable car profiles
- Local-first with optional backend sync
- See [expo-app README](./expo-app/README.md) for details

### Server (Backend API)
- Express.js REST API
- PostgreSQL database with Sequelize ORM
- AWS RDS ready for production deployment
- See [server README](./server/README.md) for details

## 📱 Overview

Motor is a mobile app designed to help car owners track and manage all aspects of their vehicle ownership, from maintenance schedules to fuel consumption and expenses. The app features a unique Snapchat-style home screen with customizable emoji car profiles and animated backgrounds.

**New**: Backend API provides scalable cloud storage and multi-device sync capabilities.

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
- **Backend API**: RESTful API with PostgreSQL database
- **Local Storage**: AsyncStorage for offline capabilities
- **Context API**: Centralized state management
- **Real-time Sync**: Optional cloud synchronization
- **AWS RDS**: Production-ready scalable database
- **Automatic Sorting**: Chronological ordering of records

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL 12 or higher
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

#### Option 1: Full Stack Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Touseef-ahmad/motor.git
   cd motor
   ```

2. **Setup Backend Server**
   ```bash
   cd server
   npm install
   
   # Create and configure .env file
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   
   # Create PostgreSQL database
   createdb motor_db
   
   # Start the server
   npm run dev
   ```
   
   The backend will run on `http://localhost:3000`

3. **Setup Mobile App**
   ```bash
   cd ../expo-app
   npm install
   
   # Create asset images (see expo-app/assets/README_ASSETS.txt)
   
   # Update API endpoint in src/config/api.ts
   
   # Start the app
   npm start
   ```

#### Option 2: Mobile App Only (Local Storage)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Touseef-ahmad/motor.git
   cd motor/expo-app
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
├── expo-app/                    # Mobile frontend
│   ├── assets/                  # App assets (icons, images)
│   ├── src/
│   │   ├── config/
│   │   │   └── api.ts           # API configuration
│   │   ├── contexts/
│   │   │   └── CarContext.tsx   # Global state management
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx   # Snapchat-style home screen
│   │   │   ├── OilChangeScreen.tsx
│   │   │   ├── FuelLogsScreen.tsx
│   │   │   ├── ExpensesScreen.tsx
│   │   │   └── CarDetailsScreen.tsx
│   │   └── types/
│   │       └── index.ts         # TypeScript type definitions
│   ├── App.tsx                  # Main app component
│   ├── app.json                 # Expo configuration
│   └── package.json             # App dependencies
├── server/                      # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts      # PostgreSQL connection
│   │   ├── models/              # Sequelize models
│   │   │   ├── CarDetails.ts
│   │   │   ├── OilChange.ts
│   │   │   ├── FuelLog.ts
│   │   │   └── Expense.ts
│   │   ├── controllers/         # Route controllers
│   │   ├── routes/              # API routes
│   │   └── index.ts             # Express server
│   ├── .env.example             # Environment template
│   └── package.json             # Server dependencies
├── package.json                 # Monorepo scripts
├── README.md                    # This file
└── TODO.md                      # Future features

```

## 🛠️ Technologies Used

### Mobile App (Expo)
- **React Native** 0.74.5: Mobile app framework
- **Expo** ~51.0.0: Development platform and tooling
- **TypeScript** 5.1.3: Type-safe JavaScript
- **React Navigation** 6.x: Navigation library
- **AsyncStorage** 1.23.1: Local data persistence
- **Context API**: State management
- **Expo Linear Gradient**: Gradient backgrounds
- **Expo Image Picker**: Camera and gallery access
- **React Native Reanimated**: Smooth animations

### Backend Server (Express)
- **Express.js** 4.18: Web framework
- **PostgreSQL**: Relational database
- **Sequelize** 6.35: ORM for PostgreSQL
- **TypeScript**: Type-safe backend
- **Helmet**: Security headers
- **CORS**: Cross-origin support
- **Morgan**: Request logging

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

### Local Storage Mode
- All data stored locally on device using AsyncStorage
- No data sent to external servers
- No account required
- Complete privacy and control

### Backend Mode (Optional)
- Data stored in PostgreSQL database
- Secure API communication
- Multi-device synchronization
- Easy deployment to Render, AWS RDS, or other cloud providers

## 🌩️ Backend Deployment

### 🚀 Render.com (Recommended - Easiest)

Deploy with one click using Render's Blueprint feature!

**See [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) for quick start guide.**

**Advantages:**
- ✅ Free tier available
- ✅ Automatic deployments from Git
- ✅ Built-in PostgreSQL database
- ✅ SSL certificates included
- ✅ Zero configuration needed

**Quick Steps:**
1. Push code to GitHub
2. Create Blueprint in Render Dashboard
3. Your API is live at `https://motor-api.onrender.com`

For detailed instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### AWS RDS (Alternative - More Control)

For AWS deployment, see the detailed guide in [DEPLOYMENT.md](./DEPLOYMENT.md#aws-deployment).

**Setting Up PostgreSQL on AWS RDS**

1. **Create RDS Instance**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier motor-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username admin \
     --master-user-password YourSecurePassword \
     --allocated-storage 20
   ```

2. **Configure Security Group**
   - Allow inbound traffic on port 5432
   - Add your server's IP address
   - Configure VPC settings

3. **Update Server Configuration**
   ```env
   DB_HOST=motor-db.xxxxx.us-east-1.rds.amazonaws.com
   DB_PORT=5432
   DB_NAME=motor_db
   DB_USER=admin
   DB_PASSWORD=YourSecurePassword
   ```

4. **Deploy Backend**
   - Deploy to AWS EC2, ECS, or Elastic Beanstalk
   - Configure environment variables
   - Set up SSL/TLS for secure connections

5. **Update Mobile App**
   - Set `USE_BACKEND=true` in `expo-app/src/config/api.ts`
   - Update `API_URL` to your production backend URL
   - Rebuild and redeploy the app

See `/server/README.md` for detailed deployment instructions.

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