// src/routes/auth.routes.ts

import express, { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router: Router = express.Router();

// Registration endpoint
router.post('/register', AuthController.registerUser);


export default router;
