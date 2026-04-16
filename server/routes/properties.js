import { Router } from 'express';
import { getProperties, getProperty, createProperty, updateProperty, deleteProperty } from '../controllers/propertyController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/', getProperties);
router.get('/:id', getProperty);
router.post('/', createProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

export default router;
