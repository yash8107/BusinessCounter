import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} from '../controller/productController.js';
import { authenticateToken } from '../middleware/tokenVerify.js';
import { checkRole, ROLES } from '../middleware/roleCheck.js';
const router = express.Router();

router.post('/', authenticateToken, checkRole([ROLES.ADMIN]), createProduct);
router.put('/:uuid', authenticateToken, checkRole([ROLES.ADMIN]), updateProduct);
router.delete('/:uuid', authenticateToken, checkRole([ROLES.ADMIN]), deleteProduct);
router.get('/:uuid?', authenticateToken, checkRole([ROLES.ADMIN]), getProduct);
router.get('/', authenticateToken, checkRole([ROLES.ADMIN]), getProduct);

export default router;
