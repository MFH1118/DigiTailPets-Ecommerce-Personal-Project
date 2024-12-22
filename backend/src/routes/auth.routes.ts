// src/routes/auth.routes.ts
import express, { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateRegistrationInput } from '../middleware/validate.middleware.js';

const router: Router = express.Router();

// Registration endpoint
router.post('/register', validateRegistrationInput, AuthController.registerUser);


export default router;
