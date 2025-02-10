// backend/src/index.ts

import express, { Express, Request, Response, Application} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import useragent from 'express-useragent';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../src/lib/auth.js';

dotenv.config();

const app: Express = express();

const PORT: number = parseInt(process.env.BACKEND_PORT || '5000', 10);



app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
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

const cleanup = async () => {
  console.log('Cleaning up...');
  console.log('Cleaned up successfully');
}

const run = async (): Promise<void> => {
  try {
    // Test the connection to the database

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    
  } catch (error: any) {
    console.error('Failed to start server:', error);
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