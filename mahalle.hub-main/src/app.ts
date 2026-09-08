import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import { errorHandler, AppError } from './middlewares/error.middleware.js';

dotenv.config();

const app: Express = express();

// Enable CORS for frontend integration
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(new Error('CORS politikanız bu kökene izin vermiyor.'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-role', 'x-admin-type'],
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger in dev
if (process.env.NODE_ENV !== 'test') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

// Welcome route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: "MahalleHub Hyperlocal Marketplace API'sine Hoş Geldiniz.",
    docs: '/api/health',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api', apiRouter);

// Handle 404
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Aradığınız rota bulunamadı: ${req.method} ${req.originalUrl}`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
