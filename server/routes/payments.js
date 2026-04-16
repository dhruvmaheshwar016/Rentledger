import { Router } from 'express';
import { getPayments, createPayment, updatePayment, deletePayment, getPaymentStats } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/stats', getPaymentStats);
router.get('/', getPayments);
router.post('/', createPayment);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

export default router;
