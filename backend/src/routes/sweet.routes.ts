import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';
import {
  createSweet,
  getSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from '../controllers/sweet.controller';

const router = Router();

const createSweetValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
];

const updateSweetValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
];

const restockValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

// All routes require authentication
router.use(authenticate);

// Public routes (authenticated users)
router.get('/', getSweets);
router.post('/:id/purchase', purchaseSweet);

// Admin-only routes
router.post('/', authorize(Role.ADMIN), createSweetValidation, createSweet);
router.put('/:id', authorize(Role.ADMIN), updateSweetValidation, updateSweet);
router.delete('/:id', authorize(Role.ADMIN), deleteSweet);
router.post('/:id/restock', authorize(Role.ADMIN), restockValidation, restockSweet);

export default router;

