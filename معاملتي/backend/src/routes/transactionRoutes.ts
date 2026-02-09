import express from 'express';
import * as transactionController from '../controllers/transactionController';
import { authenticate, authorize } from '../middleware/auth';
import { createTransactionValidation, updateTransactionValidation } from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create transaction (citizens only)
router.post('/', 
  authorize('citizen'), 
  createTransactionValidation,
  transactionController.createTransaction
);

// Submit transaction (citizens only)
router.post('/:id/submit',
  authorize('citizen'),
  transactionController.submitTransaction
);

// Get all transactions (filtered by role)
router.get('/', transactionController.getTransactions);

// Get single transaction
router.get('/:id', transactionController.getTransaction);

// Update transaction (government employees, supervisors, admins)
router.put('/:id',
  authorize('government_employee', 'supervisor', 'admin'),
  updateTransactionValidation,
  transactionController.updateTransaction
);

// Delete transaction
router.delete('/:id', transactionController.deleteTransaction);

export default router;
