# 🏗️ Motor App - Deployment Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         RENDER.COM                               │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Web Service: motor-api                                   │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Express.js API (Node.js)                          │  │  │
│  │  │  - TypeScript compiled to JavaScript               │  │  │
│  │  │  - REST API endpoints                              │  │  │
│  │  │  - CORS enabled                                     │  │  │
│  │  │  - Helmet security                                  │  │  │
│  │  │  - Morgan logging                                   │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                           ⬇️                              │  │
│  │  URL: https://motor-api.onrender.com                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ⬇️                                    │
│                   (Internal Connection)                          │
│                            ⬇️                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database: motor-db                                       │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  PostgreSQL 12+                                     │  │  │
│  │  │  - Tables: car_details, oil_changes, fuel_logs,    │  │  │
│  │  │            expenses                                 │  │  │
│  │  │  - SSL/TLS encrypted                                │  │  │
│  │  │  - 1 GB storage (free tier)                        │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ⬆️
                         HTTPS
                            ⬆️
┌─────────────────────────────────────────────────────────────────┐
│                    MOBILE APP (Expo)                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Native App                                         │  │
│  │  - iOS & Android                                          │  │
│  │  - API calls to motor-api                                │  │
│  │  - Local storage (AsyncStorage) + Cloud sync             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Action (Mobile App)
```
User creates/updates car data → App UI → Context State
```

### 2. API Request
```
Context → HTTP Request (fetch/axios) → motor-api.onrender.com
```

### 3. Backend Processing
```
Express.js → Route Handler → Controller → Sequelize ORM
```

### 4. Database Operation
```
Sequelize → PostgreSQL Query → motor-db
```

### 5. Response
```
Database → Sequelize Model → Controller → JSON Response → Mobile App
```

## Technology Stack

### Frontend (Mobile)
- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **State**: Context API + AsyncStorage
- **HTTP**: Fetch API
- **Platform**: iOS & Android

### Backend (API)
- **Framework**: Express.js
- **Language**: TypeScript → JavaScript
- **ORM**: Sequelize
- **Security**: Helmet + CORS
- **Logging**: Morgan

### Database
- **DBMS**: PostgreSQL 12+
- **Connection**: SSL/TLS
- **Access**: Internal only (secure)

### Hosting (Render)
- **Region**: Oregon (US West)
- **Plan**: Free tier
- **SSL**: Automatic (Let's Encrypt)
- **Deployment**: Git-based auto-deploy

## Environment Variables

### Development (.env)
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=motor_db
DB_USER=postgres
DB_PASSWORD=your_password
CORS_ORIGIN=*
```

### Production (Render)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/motor_db
CORS_ORIGIN=*
```

## API Endpoints

### Health Check
```
GET /health → Status check
```

### Cars
```
GET    /api/cars              → List all cars
GET    /api/cars/:carId       → Get car details
POST   /api/cars              → Create new car
PUT    /api/cars/:carId       → Update car
DELETE /api/cars/:carId       → Delete car
```

### Oil Changes
```
GET    /api/cars/:carId/oil-changes    → List oil changes
POST   /api/cars/:carId/oil-changes    → Create oil change
DELETE /api/cars/oil-changes/:id       → Delete oil change
```

### Fuel Logs
```
GET    /api/cars/:carId/fuel-logs      → List fuel logs
GET    /api/cars/:carId/fuel-average   → Calculate average
POST   /api/cars/:carId/fuel-logs      → Create fuel log
DELETE /api/cars/fuel-logs/:id         → Delete fuel log
```

### Expenses
```
GET    /api/cars/:carId/expenses       → List expenses
POST   /api/cars/:carId/expenses       → Create expense
DELETE /api/cars/expenses/:id          → Delete expense
```

## Database Schema

### car_details
```sql
CREATE TABLE car_details (
  id UUID PRIMARY KEY,
  userId UUID,
  name VARCHAR NOT NULL,
  make VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  year INTEGER NOT NULL,
  color VARCHAR,
  licensePlate VARCHAR,
  vin VARCHAR,
  purchaseDate DATE,
  currentMileage FLOAT,
  images TEXT[],
  emoji VARCHAR,
  backgroundStyle VARCHAR,
  backgroundColor VARCHAR,
  secondaryColor VARCHAR,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### oil_changes
```sql
CREATE TABLE oil_changes (
  id UUID PRIMARY KEY,
  carId UUID REFERENCES car_details(id),
  date DATE NOT NULL,
  mileage FLOAT NOT NULL,
  cost FLOAT,
  notes TEXT,
  nextChangeMileage FLOAT,
  nextChangeDate DATE,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### fuel_logs
```sql
CREATE TABLE fuel_logs (
  id UUID PRIMARY KEY,
  carId UUID REFERENCES car_details(id),
  date DATE NOT NULL,
  mileage FLOAT NOT NULL,
  liters FLOAT NOT NULL,
  cost FLOAT NOT NULL,
  pricePerLiter FLOAT,
  fuelType VARCHAR,
  fullTank BOOLEAN,
  notes TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### expenses
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY,
  carId UUID REFERENCES car_details(id),
  date DATE NOT NULL,
  category VARCHAR NOT NULL,
  description VARCHAR,
  amount FLOAT NOT NULL,
  mileage FLOAT,
  notes TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

## Security

### Frontend
- ✅ HTTPS only in production
- ✅ No sensitive data in AsyncStorage
- ✅ API key rotation (if added later)

### Backend
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Input validation (express-validator)
- ✅ SQL injection prevention (Sequelize ORM)
- ✅ Environment variable secrets

### Database
- ✅ SSL/TLS encryption
- ✅ Internal network only
- ✅ Automatic backups (paid plans)
- ✅ No public access

## Deployment Process

### 1. Code Push
```bash
git push origin main
```

### 2. Render Detection
- Webhook triggers build
- Blueprint spec loaded (render.yaml)

### 3. Build Phase
```bash
cd server
npm install
npm run build
```

### 4. Deploy Phase
```bash
npm start
```

### 5. Health Check
```bash
GET /health
```

### 6. Live!
```
https://motor-api.onrender.com
```

## Monitoring

### Logs
- Real-time in Render Dashboard
- Request/response logging (Morgan)
- Error tracking
- Database queries (development)

### Metrics
- Response times
- Error rates
- Database connections
- Memory usage
- CPU usage

### Alerts
- Service down
- High error rate
- Database connection issues

## Scaling

### Horizontal Scaling
- Multiple instances (paid plans)
- Load balancing
- Session management

### Vertical Scaling
- Increase RAM/CPU
- Better performance
- More connections

### Database Scaling
- Connection pooling (already configured)
- Read replicas (paid plans)
- Increase storage

## Backup & Recovery

### Database Backups (Paid Plans)
- Automatic daily backups
- Point-in-time recovery
- Manual snapshots

### Disaster Recovery
- Multi-region deployment
- Database replication
- Backup restoration

## Cost Optimization

### Free Tier
- Perfect for development/testing
- Service sleeps after inactivity
- 90-day database limit

### Paid Tier
- Always-on services
- Permanent databases
- Better performance
- Priority support

## Future Enhancements

### Potential Improvements
- [ ] Redis caching
- [ ] CDN for static assets
- [ ] WebSocket support (real-time)
- [ ] GraphQL API
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Multi-region deployment
- [ ] Advanced monitoring (DataDog, New Relic)

---

**Architecture Version**: 1.0
**Last Updated**: 2026-01-05
**Status**: Production Ready ✅
