// src/index.ts

import express, { Express, Request, Response, Application} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'
import prisma from './db/prisma.js';
import { userCache } from './model/user.model.js';

dotenv.config();

const app: Express = express();

const PORT: number = parseInt(process.env.BACKEND_PORT || '5000', 10);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth/', authRoutes);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello Worlds!');
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok'
  });
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