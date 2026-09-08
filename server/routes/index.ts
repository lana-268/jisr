import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import categoryRoutes from './category.routes.js';
import catalogRoutes from './catalog.routes.js';
import providerRoutes from './provider.routes.js';
import orderRoutes from './order.routes.js';
import customerRoutes from './customer.routes.js';
import chatRoutes from './chat.routes.js';
import adminRoutes from './admin.routes.js';

const apiRouter = Router();

// Health Check Endpoint
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Jisr API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Modular Routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/catalog', catalogRoutes);
apiRouter.use('/providers', providerRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/chats', chatRoutes);
apiRouter.use('/admin', adminRoutes);

export default apiRouter;
