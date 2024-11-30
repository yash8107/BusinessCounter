import express from 'express';
import { signup, login } from '../controller/authController.js';
import { staffLogin, getStaffProfile } from '../controller/staffController.js';
import { authenticateToken } from '../middleware/tokenVerify.js';
import { checkRole, ROLES } from '../middleware/roleCheck.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', signup); // Public registration for business admins

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        session: false 
    }),
    (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Authentication failed'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role ? req.user.role.role_name : ROLES.ADMIN
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Redirect to success page
            res.redirect(`/auth/google/success.html?token=${token}`);
        } catch (error) {
            console.error('Callback error:', error);
            res.redirect('/login?error=callback_failed');
        }
    }
);

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