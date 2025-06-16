import express from 'express';
import { signup, login, forgotPassword, resetPassword, serviceProviderLogin} from '../controller/authController.js';
import { staffLogin, getStaffProfile } from '../controller/staffController.js';
import { authenticateToken } from '../middleware/tokenVerify.js';
import { checkRole, ROLES } from '../middleware/roleCheck.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', signup); // Public registration for business admins
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

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

            res.cookie('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            // Redirect to auth-success page which will then redirect to dashboard
            res.redirect('http://localhost:5173/auth-success');
        } catch (error) {
            console.error('Callback error:', error);
            res.redirect('http://localhost:5173/login?error=callback_failed');
        }
    }
);

// Add verify token endpoint
router.get('/verify-token', authenticateToken, async (req, res) => {
    try {
        let user;
        
        // Check if the token belongs to a service provider
        if (req.user.role === ROLES.SUPER_ADMIN) {
            user = await db.ServiceProviderProfile.findOne({
                where: { id: req.user.id },
                attributes: ['id', 'name', 'email', 'phone', 'company_name'],
                include: [{
                    model: db.Role,
                    as: 'role',
                    attributes: ['role_name']
                }]
            });

            if (user) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Token is valid',
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        company_name: user.company_name,
                        role: ROLES.SUPER_ADMIN,
                        token: req.token
                    }
                });
            }
        }

        // If not a service provider, check User table
        user = await db.User.findOne({
            where: { id: req.user.id },
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'role_id'],
            include: [{
                model: db.Role,
                as: 'role',
                attributes: ['role_name']
            }]
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Token is valid',
            user: {
                id: user.id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                phone: user.phone,
                role: user.role ? user.role.role_name : null,
                token: req.token
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
});

// Add logout endpoint
router.post('/logout', authenticateToken, (req, res) => {
    try {
        // Clear the auth token cookie based on role
            res.clearCookie('authToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                path: '/'
            });

        // Log the logout action
        console.info(`User with role ${req.user.role} logged out successfully`);

        res.status(200).json({
            status: 'success',
            message: 'Successfully logged out',
            role: req.user.role
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to logout',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Staff routes
router.post('/staff/login', staffLogin);
router.get('/staff/profile', authenticateToken, checkRole([ROLES.USER]), getStaffProfile);

// Protected routes
// Admin routes
router.post('/admin/create', authenticateToken, checkRole([ROLES.SUPER_ADMIN]), signup); // Super admin creates admin
router.post('/staff/create', authenticateToken, checkRole([ROLES.ADMIN]), signup); // Admin creates staff

// Service Provider routes
router.post('/service-provider/login', serviceProviderLogin); // Service Provider login
router.post('/service-provider/create', authenticateToken, checkRole([ROLES.SUPER_ADMIN]), signup); // Super admin creates service provider

export default router;