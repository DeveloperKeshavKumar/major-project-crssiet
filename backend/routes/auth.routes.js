import { Router } from "express";
import { body } from "express-validator";

import { register, login } from '../controllers/auth.controller.js'

const router = Router();

router.post(
   '/register',
   [
      body('email').isEmail().withMessage('Please enter a valid email address'),
      body('password').isLength({ min: 8 }).withMessage('Password must be at least 6 characters long'),
      body('name').isString().isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
      body('role').isString().isIn(['student', 'professor']).withMessage('Role must be either Student or Professor'),
   ],
   register
);

router.post(
   '/login',
   [
      body('email').isEmail().withMessage('Please enter a valid email address'),
      body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
      body('privateKey').notEmpty().withMessage('Private key is required'),
   ],
   login
);

export default router;