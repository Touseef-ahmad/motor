import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/database';
import swaggerSpec from './config/swagger';
import carRoutes from './routes/carRoutes';
import oilChangeRoutes from './routes/oilChangeRoutes';
import fuelLogRoutes from './routes/fuelLogRoutes';
import expenseRoutes from './routes/expenseRoutes';

dotenv.config();

const app: Application = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Motor API Documentation',
}));

// Health check route
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Motor API is running' });
});

// API Routes
app.use('/api/cars', carRoutes);
app.use('/api/cars', oilChangeRoutes);
app.use('/api/cars', fuelLogRoutes);
app.use('/api/cars', expenseRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    // Listen on all interfaces (required for Render and other PaaS providers)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚗 Motor API server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
