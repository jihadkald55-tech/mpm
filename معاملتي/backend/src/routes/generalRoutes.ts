import express from 'express';
import * as generalController from '../controllers/generalController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/provinces', generalController.getProvinces);
router.get('/departments', generalController.getDepartments);
router.get('/transaction-types', generalController.getTransactionTypes);

// Protected routes
router.get('/rejection-reasons', authenticate, generalController.getRejectionReasons);
router.get('/statistics', authenticate, generalController.getStatistics);

export default router;
