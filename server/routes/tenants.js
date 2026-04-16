import { Router } from 'express';
import { getTenants, getTenant, createTenant, updateTenant, deleteTenant } from '../controllers/tenantController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/', getTenants);
router.get('/:id', getTenant);
router.post('/', createTenant);
router.put('/:id', updateTenant);
router.delete('/:id', deleteTenant);

export default router;
