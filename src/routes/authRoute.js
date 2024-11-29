import express from 'express';
import { signup, login } from '../controller/authController.js';
import { staffLogin, getStaffProfile } from '../controller/staffController.js';
import { authenticateToken } from '../middleware/tokenVerify.js';
import { checkRole, ROLES } from '../middleware/roleCheck.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', signup); // Public registration for business admins

// Staff routes
router.post('/staff/login', staffLogin);
router.get('/staff/profile', authenticateToken, checkRole([ROLES.USER]), getStaffProfile);

// Protected routes
// Admin routes
router.post('/admin/create', authenticateToken, checkRole([ROLES.SUPER_ADMIN]), signup); // Super admin creates admin
router.post('/staff/create', authenticateToken, checkRole([ROLES.ADMIN]), signup); // Admin creates staff

// Service Provider routes
router.post('/service-provider/create', authenticateToken, checkRole([ROLES.SUPER_ADMIN]), signup); // Super admin creates service provider

export default router;