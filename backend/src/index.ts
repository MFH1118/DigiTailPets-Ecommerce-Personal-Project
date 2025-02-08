// src/index.ts

import express, { Express, Request, Response, Application} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import wishListRoutes from './routes/wishlist.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './admin/index.js';
import prisma from './db/prisma.js';
import { userCache } from './model/user.model.js';
import { getSessionTypeInfo } from './utils/session-type.utils.js';
import useragent from 'express-useragent';
import cookieParser from 'cookie-parser';
import addressRoutes from './routes/address.routes.js';
import cartRoutes from './routes/cart.routes.js';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../src/lib/auth.js';

dotenv.config();

const app: Express = express();

const PORT: number = parseInt(process.env.BACKEND_PORT || '5000', 10);

app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlists', wishListRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use(useragent.express());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello Worlds!');
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok'
  });
});

app.get('/session-type', (req: Request, res: Response) => {
  const sessionTypeInfo = getSessionTypeInfo(req);
  res.status(200).json(sessionTypeInfo);
});

const cleanup = async () => {
  console.log('Cleaning up...');
  userCache.close();
  await prisma.$disconnect();
  console.log('Cleaned up successfully');
}

const run = async (): Promise<void> => {
  try {
    // Test the connection to the database
    await prisma.$connect();
    console.log('Connected to the database');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    
  } catch (error: any) {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM');
  await cleanup();
  process.exit(0);
})

process.on('SIGINT', async () => {
  console.log('Received SIGINT');
  await cleanup();
  process.exit(0);
})

process.on('unhandledRejection', async (error: any) => {
  console.error('Unhandled rejection:', error);
});

process.on('uncaughtException', async (error: any) => {
  console.error('Uncaught exception:', error);
  await cleanup();
  process.exit(1);
});

run().catch(async (error) => {
  console.error('Error during startup:', error);
  await cleanup();
  process.exit(1);
});