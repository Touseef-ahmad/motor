# Motor API - Swagger Documentation

This document describes the Swagger/OpenAPI documentation that has been added to the Motor backend API.

## Overview

The Motor API now includes comprehensive Swagger documentation that provides:
- Interactive API documentation
- Request/response examples
- Schema definitions for all data models
- Easy API testing interface

## Accessing the Documentation

Once the server is running, you can access the Swagger UI at:

```
http://localhost:3000/api-docs
```

Or in production:
```
https://your-domain.com/api-docs
```

## Features

### 1. API Endpoints Documentation

The documentation includes all API endpoints organized by resource:

#### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/{carId}` - Get car details with related records
- `POST /api/cars` - Create a new car
- `PUT /api/cars/{carId}` - Update car information
- `DELETE /api/cars/{carId}` - Delete a car

#### Oil Changes
- `GET /api/cars/{carId}/oil-changes` - Get oil change records
- `POST /api/cars/{carId}/oil-changes` - Create oil change record
- `DELETE /api/cars/oil-changes/{id}` - Delete oil change record

#### Fuel Logs
- `GET /api/cars/{carId}/fuel-logs` - Get fuel log records
- `GET /api/cars/{carId}/fuel-average` - Get fuel consumption average
- `POST /api/cars/{carId}/fuel-logs` - Create fuel log record
- `DELETE /api/cars/fuel-logs/{id}` - Delete fuel log record

#### Expenses
- `GET /api/cars/{carId}/expenses` - Get expense records
- `POST /api/cars/{carId}/expenses` - Create expense record
- `DELETE /api/cars/expenses/{id}` - Delete expense record

#### Health
- `GET /health` - Health check endpoint

### 2. Data Models

Complete schema definitions for:
- **CarDetails** - Car information with styling options
- **OilChange** - Oil change maintenance records
- **FuelLog** - Fuel consumption tracking
- **Expense** - General expense tracking
- **FuelAverage** - Fuel consumption statistics
- **Error** - Standard error responses
- **HealthCheck** - Health status response

### 3. Interactive Testing

The Swagger UI provides:
- "Try it out" functionality for each endpoint
- Request body editors with schema validation
- Response display with status codes
- Example values for all fields

## Technical Details

### Dependencies Added

```json
{
  "dependencies": {
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1"
  },
  "devDependencies": {
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.8"
  }
}
```

### Configuration

The Swagger configuration is located at:
- Source: `src/config/swagger.ts`
- Compiled: `dist/config/swagger.js`

### OpenAPI Specification

The API follows OpenAPI 3.0.0 specification with:
- Comprehensive schema definitions
- Request/response examples
- Parameter descriptions
- Error response definitions

## Customization

The Swagger UI has been customized to:
- Hide the default top bar
- Use a custom site title: "Motor API Documentation"
- Match the Motor app branding

## Benefits

1. **Developer Experience**: Easy-to-understand API reference
2. **Testing**: Interactive testing without external tools
3. **Documentation**: Always up-to-date with the code
4. **Integration**: Helps frontend developers understand endpoints
5. **Standards**: Follows OpenAPI 3.0.0 specification

## Maintenance

When adding new endpoints:
1. Add JSDoc comments above route definitions
2. Follow the existing pattern in route files
3. Update schema definitions in `swagger.ts` if needed
4. Run `npm run build` to compile changes
5. Restart the server to see updated documentation

## Example Request

Using the Swagger UI, you can test endpoints like creating a new car:

```bash
POST /api/cars
{
  "name": "My Honda",
  "make": "Honda",
  "model": "Civic",
  "year": 2020,
  "color": "Blue",
  "licensePlate": "ABC-1234",
  "currentMileage": 25000,
  "emoji": "🚗",
  "backgroundStyle": "gradient",
  "backgroundColor": "#007AFF"
}
```

The documentation will show the expected response format and status codes.

## Security Note

The Swagger documentation is publicly accessible. Ensure proper authentication is implemented for production endpoints as needed.
