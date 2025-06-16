import express from 'express';
import { createService, updateService, deleteService, getService } from '../controller/servicesController.js';
import { authenticateToken } from '../middleware/tokenVerify.js';
import { checkRole, ROLES } from '../middleware/roleCheck.js';
const router = express.Router();

router.post('/', authenticateToken, checkRole([ROLES.ADMIN]), createService);
router.put('/:uuid', authenticateToken, checkRole([ROLES.ADMIN]), updateService);
router.delete('/:uuid', authenticateToken, checkRole([ROLES.ADMIN]), deleteService);
router.get('/:uuid?', authenticateToken, checkRole([ROLES.ADMIN]), getService);
router.get('/', authenticateToken, checkRole([ROLES.ADMIN]), getService);

export default router;
