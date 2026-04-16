import { Router } from 'express';
import { getLeases, createLease, updateLeaseStatus, deleteLease } from '../controllers/leaseController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/', getLeases);
router.post('/', createLease);
router.put('/:id/status', updateLeaseStatus);
router.delete('/:id', deleteLease);

export default router;
