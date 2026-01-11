# Motor API - Backend Server

Express.js backend with PostgreSQL for the Motor car management app.

## 🚀 Quick Deploy to Render

**Deploy in minutes!** See the [Quick Deploy Guide](../RENDER_DEPLOY.md) or [Full Deployment Guide](../DEPLOYMENT.md)

The backend is configured for one-click deployment to Render.com using Blueprint.

## 🚀 Features

- RESTful API for car management
- **Swagger/OpenAPI documentation** - Interactive API docs at `/api-docs`
- PostgreSQL database with Sequelize ORM
- TypeScript for type safety
- Render & AWS RDS ready configuration
- CORS enabled for mobile app integration
- Request validation and error handling
- Automatic SSL/TLS in production

## 📋 Prerequisites

- Node.js v18 or higher
- PostgreSQL 12 or higher
- npm or yarn

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Database Setup

#### Local PostgreSQL

```bash
# Install PostgreSQL (if not already installed)
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
# macOS
brew services start postgresql

# Ubuntu/Debian
sudo systemctl start postgresql

# Create database
createdb motor_db
```

#### AWS RDS (Production)

1. Create a PostgreSQL instance in AWS RDS
2. Configure security groups to allow connections
3. Note the endpoint, port, database name, username, and password
4. Update `.env` file with RDS credentials

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000

# Local Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=motor_db
DB_USER=postgres
DB_PASSWORD=your_password

# For AWS RDS (Production)
# DB_HOST=your-instance.region.rds.amazonaws.com
# DB_PORT=5432
# DB_NAME=motor_db
# DB_USER=admin
# DB_PASSWORD=your_rds_password
```

### 4. Run Database Migrations

```bash
npm run migrate
```

### 5. Start the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Swagger Documentation
Access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

The Swagger UI provides:
- Complete API reference with request/response examples
- Interactive testing interface
- Schema definitions for all data models
- Authentication testing (when applicable)

For more details, see [SWAGGER_DOCUMENTATION.md](./SWAGGER_DOCUMENTATION.md)

### Health Check
```
GET /health
```

### Cars
```
GET    /api/cars              # Get all cars
GET    /api/cars/:carId       # Get car details
POST   /api/cars              # Create new car
PUT    /api/cars/:carId       # Update car
DELETE /api/cars/:carId       # Delete car
```

### Oil Changes
```
GET    /api/cars/:carId/oil-changes      # Get oil changes
POST   /api/cars/:carId/oil-changes      # Create oil change
DELETE /api/cars/oil-changes/:id         # Delete oil change
```

### Fuel Logs
```
GET    /api/cars/:carId/fuel-logs        # Get fuel logs
GET    /api/cars/:carId/fuel-average     # Get fuel average
POST   /api/cars/:carId/fuel-logs        # Create fuel log
DELETE /api/cars/fuel-logs/:id           # Delete fuel log
```

### Expenses
```
GET    /api/cars/:carId/expenses         # Get expenses
POST   /api/cars/:carId/expenses         # Create expense
DELETE /api/cars/expenses/:id            # Delete expense
```

## 📊 Database Schema

### car_details
```sql
id              UUID PRIMARY KEY
userId          UUID
name            VARCHAR
make            VARCHAR
model           VARCHAR
year            INTEGER
color           VARCHAR
licensePlate    VARCHAR
vin             VARCHAR
purchaseDate    DATE
currentMileage  FLOAT
images          TEXT[]
emoji           VARCHAR
backgroundStyle ENUM('solid', 'gradient', 'animated')
backgroundColor VARCHAR
secondaryColor  VARCHAR
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

### oil_changes
```sql
id                UUID PRIMARY KEY
carId             UUID FOREIGN KEY
date              DATE
mileage           FLOAT
cost              FLOAT
notes             TEXT
nextChangeMileage FLOAT
nextChangeDate    DATE
createdAt         TIMESTAMP
updatedAt         TIMESTAMP
```

### fuel_logs
```sql
id             UUID PRIMARY KEY
carId          UUID FOREIGN KEY
date           DATE
mileage        FLOAT
liters         FLOAT
cost           FLOAT
pricePerLiter  FLOAT
fuelType       ENUM('Regular', 'Premium', 'Diesel', 'Electric')
fullTank       BOOLEAN
notes          TEXT
createdAt      TIMESTAMP
updatedAt      TIMESTAMP
```

### expenses
```sql
id          UUID PRIMARY KEY
carId       UUID FOREIGN KEY
date        DATE
category    ENUM('Maintenance', 'Fuel', 'Insurance', 'Repair', 'Registration', 'Other')
description VARCHAR
amount      FLOAT
mileage     FLOAT
notes       TEXT
createdAt   TIMESTAMP
updatedAt   TIMESTAMP
```

## 🔒 Security

- Helmet.js for security headers
- CORS configured for mobile app
- Environment variables for sensitive data
- Input validation with express-validator
- SQL injection prevention via Sequelize ORM

## 🌩️ AWS RDS Deployment

### 1. Create RDS Instance

```bash
# Using AWS CLI
aws rds create-db-instance \
  --db-instance-identifier motor-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password YourSecurePassword \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxx \
  --publicly-accessible
```

### 2. Update Environment Variables

Update `.env` with RDS endpoint:

```env
NODE_ENV=production
DB_HOST=motor-db.xxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=motor_db
DB_USER=admin
DB_PASSWORD=YourSecurePassword
```

### 3. Deploy to EC2/ECS/Elastic Beanstalk

Choose your preferred AWS deployment method:

- **EC2**: Traditional VM deployment
- **ECS**: Container-based deployment
- **Elastic Beanstalk**: Managed platform
- **Lambda + API Gateway**: Serverless option

## 🧪 Testing

```bash
npm test
```

## 📝 Development

### Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.ts       # Database connection
│   ├── models/
│   │   ├── CarDetails.ts     # Car model
│   │   ├── OilChange.ts      # Oil change model
│   │   ├── FuelLog.ts        # Fuel log model
│   │   ├── Expense.ts        # Expense model
│   │   └── index.ts          # Model associations
│   ├── controllers/
│   │   ├── carController.ts
│   │   ├── oilChangeController.ts
│   │   ├── fuelLogController.ts
│   │   └── expenseController.ts
│   ├── routes/
│   │   ├── carRoutes.ts
│   │   ├── oilChangeRoutes.ts
│   │   ├── fuelLogRoutes.ts
│   │   └── expenseRoutes.ts
│   ├── middleware/           # Custom middleware
│   └── index.ts              # Express app entry point
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

### Adding New Features

1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Create routes in `src/routes/`
4. Register routes in `src/index.ts`

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check if database exists
psql -U postgres -l | grep motor_db

# Create database if missing
createdb motor_db
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 <PID>
```

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)

## 📧 Support

For issues or questions, please open an issue in the GitHub repository.
