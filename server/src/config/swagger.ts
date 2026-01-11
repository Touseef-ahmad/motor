import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Motor API',
      version: '1.0.0',
      description: 'Backend API for Motor car management application',
      contact: {
        name: 'Motor API Support',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'API Server',
      },
    ],
    components: {
      schemas: {
        CarDetails: {
          type: 'object',
          required: ['name', 'make', 'model', 'year', 'color', 'licensePlate', 'currentMileage'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the car',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'User ID who owns the car',
            },
            name: {
              type: 'string',
              description: 'Name/nickname for the car',
              example: 'My Honda',
            },
            make: {
              type: 'string',
              description: 'Car manufacturer',
              example: 'Honda',
            },
            model: {
              type: 'string',
              description: 'Car model',
              example: 'Civic',
            },
            year: {
              type: 'integer',
              description: 'Manufacturing year',
              example: 2020,
            },
            color: {
              type: 'string',
              description: 'Car color',
              example: 'Blue',
            },
            licensePlate: {
              type: 'string',
              description: 'License plate number',
              example: 'ABC-1234',
            },
            vin: {
              type: 'string',
              description: 'Vehicle Identification Number',
              example: '1HGBH41JXMN109186',
            },
            purchaseDate: {
              type: 'string',
              format: 'date',
              description: 'Date of purchase',
              example: '2020-01-15',
            },
            currentMileage: {
              type: 'number',
              format: 'float',
              description: 'Current mileage',
              example: 25000.5,
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Array of image URLs',
              example: ['https://example.com/car1.jpg'],
            },
            emoji: {
              type: 'string',
              description: 'Emoji representation',
              example: '🚗',
            },
            backgroundStyle: {
              type: 'string',
              enum: ['solid', 'gradient', 'animated'],
              description: 'Background style for UI',
              example: 'gradient',
            },
            backgroundColor: {
              type: 'string',
              description: 'Background color (hex)',
              example: '#007AFF',
            },
            secondaryColor: {
              type: 'string',
              description: 'Secondary color for gradients (hex)',
              example: '#00C7FF',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when last updated',
            },
          },
        },
        OilChange: {
          type: 'object',
          required: ['carId', 'date', 'mileage', 'cost'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the oil change record',
            },
            carId: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the car',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Date of oil change',
              example: '2024-01-15',
            },
            mileage: {
              type: 'number',
              format: 'float',
              description: 'Mileage at time of oil change',
              example: 25000,
            },
            cost: {
              type: 'number',
              format: 'float',
              description: 'Cost of oil change',
              example: 45.99,
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
              example: 'Used synthetic oil',
            },
            nextChangeMileage: {
              type: 'number',
              format: 'float',
              description: 'Recommended mileage for next oil change',
              example: 28000,
            },
            nextChangeDate: {
              type: 'string',
              format: 'date',
              description: 'Recommended date for next oil change',
              example: '2024-07-15',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FuelLog: {
          type: 'object',
          required: ['carId', 'date', 'mileage', 'liters', 'cost', 'pricePerLiter', 'fuelType', 'fullTank'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the fuel log',
            },
            carId: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the car',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Date of refueling',
              example: '2024-01-15',
            },
            mileage: {
              type: 'number',
              format: 'float',
              description: 'Mileage at time of refueling',
              example: 25000,
            },
            liters: {
              type: 'number',
              format: 'float',
              description: 'Amount of fuel added in liters',
              example: 40.5,
            },
            cost: {
              type: 'number',
              format: 'float',
              description: 'Total cost of fuel',
              example: 60.75,
            },
            pricePerLiter: {
              type: 'number',
              format: 'float',
              description: 'Price per liter',
              example: 1.50,
            },
            fuelType: {
              type: 'string',
              enum: ['Regular', 'Premium', 'Diesel', 'Electric'],
              description: 'Type of fuel',
              example: 'Regular',
            },
            fullTank: {
              type: 'boolean',
              description: 'Whether tank was filled completely',
              example: true,
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
              example: 'Gas station on Main St',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Expense: {
          type: 'object',
          required: ['carId', 'date', 'category', 'description', 'amount'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the expense',
            },
            carId: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the car',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Date of expense',
              example: '2024-01-15',
            },
            category: {
              type: 'string',
              enum: ['Maintenance', 'Fuel', 'Insurance', 'Repair', 'Registration', 'Other'],
              description: 'Expense category',
              example: 'Maintenance',
            },
            description: {
              type: 'string',
              description: 'Description of the expense',
              example: 'Tire rotation',
            },
            amount: {
              type: 'number',
              format: 'float',
              description: 'Amount of expense',
              example: 50.00,
            },
            mileage: {
              type: 'number',
              format: 'float',
              description: 'Mileage at time of expense',
              example: 25000,
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
              example: 'Discount applied',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FuelAverage: {
          type: 'object',
          properties: {
            averageConsumption: {
              type: 'number',
              format: 'float',
              description: 'Average fuel consumption in liters per 100km',
              example: 7.5,
            },
            totalDistance: {
              type: 'number',
              format: 'float',
              description: 'Total distance covered',
              example: 1500,
            },
            totalFuel: {
              type: 'number',
              format: 'float',
              description: 'Total fuel consumed',
              example: 112.5,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Internal server error',
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
            },
            message: {
              type: 'string',
              example: 'Motor API is running',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/index.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
