// src/routes/customerRoute.js
import express from 'express';
import { createCustomer, updateCustomer, deleteCustomer, getCustomer } from '../controller/customerController.js';
import { authenticateToken } from '../middleware/tokenVerify.js';
import { checkRole, ROLES } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/', authenticateToken, checkRole([ROLES.ADMIN]), createCustomer);
router.put('/:uuid', authenticateToken, checkRole([ROLES.ADMIN]), updateCustomer);
router.delete('/:uuid', authenticateToken, checkRole([ROLES.ADMIN]), deleteCustomer);
router.get('/:uuid', authenticateToken, checkRole([ROLES.ADMIN]), getCustomer);
router.get('/', authenticateToken, checkRole([ROLES.ADMIN]), getCustomer); // this line to handle fetching all customers

export default router;