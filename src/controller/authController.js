'use strict';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from '../models/index.js';
const { User, Role, ServiceProviderProfile, StaffProfile } = db;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ROLES } from '../middleware/roleCheck.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config();

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Signup Function
export const signup = async (req, res) => {
    try {
        console.log('Starting signup process for path:', req.path);
        const { 
            first_name, 
            last_name, 
            email, 
            password,
            phone,
            business_name,
            business_type,
            company_name,
            company_registration_number,
            designation,
            department
        } = req.body;

        // Basic validation for all user types
        if (!first_name || !last_name || !email || !password || !phone) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required personal information. Please provide first name, last name, email, password, and phone.'
            });
        }

        // Hash password early
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');

        let role;
        if (req.path === '/register' || req.path === '/admin/create') {
            // Admin registration
            role = await Role.findOne({ where: { role_name: ROLES.ADMIN } });
            console.log('Found admin role:', role?.id);
            
            // Validate admin fields
            if (!business_name || !business_type) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Missing required business information. Please provide business name and business type.'
                });
            }

            // Check if admin email exists
            const existingAdmin = await User.findOne({ where: { email } });
            if (existingAdmin) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email already registered'
                });
            }

            // Create admin user
            const newAdmin = await User.create({
                first_name,
                last_name,
                email,
                password: hashedPassword,
                phone,
                business_name,
                business_type,
                role_id: role.id,
                created_by: req.user?.id
            });

            console.log('Admin created successfully:', newAdmin.id);

            // Generate JWT token for public registration
            let token;
            if (req.path === '/register') {
                token = jwt.sign(
                    { 
                        id: newAdmin.id,
                        email: newAdmin.email,
                        role: ROLES.ADMIN
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );
            }

            return res.status(201).json({
                status: 'success',
                message: 'Admin registered successfully',
                data: {
                    user: {
                        id: newAdmin.id,
                        email: newAdmin.email,
                        first_name: newAdmin.first_name,
                        last_name: newAdmin.last_name,
                        business_name: newAdmin.business_name,
                        role: ROLES.ADMIN
                    },
                    ...(token && { token })
                }
            });

        } else if (req.path === '/service-provider/create') {
            // Service Provider creation
            role = await Role.findOne({ where: { role_name: ROLES.SUPER_ADMIN } });
            console.log('Found super admin role:', role?.id);
            
            // Validate service provider fields
            if (!company_name || !company_registration_number) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Missing required company information. Please provide company name and registration number.'
                });
            }

            // Check if service provider email exists
            const existingProvider = await ServiceProviderProfile.findOne({ where: { email } });
            if (existingProvider) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email already registered'
                });
            }

            // Create service provider
            const newProvider = await ServiceProviderProfile.create({
                first_name,
                last_name,
                email,
                password: hashedPassword,
                phone,
                company_name,
                company_registration_number,
                role_id: role.id,
                status: 'active',
                subscription_plan: 'Basic',
                subscription_status: 'active',
                subscription_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                created_by: req.user?.id
            });

            console.log('Service provider created successfully:', newProvider.id);

            return res.status(201).json({
                status: 'success',
                message: 'Service Provider created successfully',
                data: {
                    provider: {
                        id: newProvider.id,
                        email: newProvider.email,
                        company_name: newProvider.company_name,
                        role: ROLES.SUPER_ADMIN
                    }
                }
            });

        } else if (req.path === '/staff/create') {
            // Staff creation
            role = await Role.findOne({ where: { role_name: ROLES.USER } });
            console.log('Found staff role:', role?.id);
            
            // Check if staff email exists
            const existingStaff = await StaffProfile.findOne({ where: { work_email: email } });
            if (existingStaff) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email already registered'
                });
            }

            // Get admin ID from token
            const adminId = req.user.id;
            // Create staff profile
            const newStaff = await StaffProfile.create({
                designation: designation || null,
                department: department || null,
                work_email: email,
                work_phone: phone,
                role_id: role.id,
                admin_id: adminId,
                status: 'active',
                created_by: adminId
            });

            console.log('Staff member created successfully:', newStaff.id);

            return res.status(201).json({
                status: 'success',
                message: 'Staff member created successfully',
                data: {
                    user: {
                        id: newStaff.id,
                        staff_id: newStaff.id,
                        email: newStaff.work_email,
                        work_email: newStaff.work_email,
                        first_name: newStaff.first_name,
                        last_name: newStaff.last_name,
                        designation: newStaff.designation,
                        department: newStaff.department,
                        role: ROLES.USER
                    }
                }
            });
        }

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

// Login Function
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }

        // First check User table (Admin)
        const admin = await User.findOne({ 
            where: { email },
            include: [{
                model: Role,
                as: 'role'
            }]
        });

        // Then check ServiceProviderProfile (Super Admin)
        const serviceProvider = await ServiceProviderProfile.findOne({ 
            where: { email },
            include: [{
                model: Role,
                as: 'role'
            }]
        });

        let user = admin || serviceProvider;
        let userRole = null;

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Get role
        if (admin) {
            userRole = ROLES.ADMIN;
        } else if (serviceProvider) {
            userRole = ROLES.SUPER_ADMIN;
        }

        // Check if password exists and is a string
        if (!user.password || typeof user.password !== 'string') {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password.toString(), user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                role: userRole
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Prepare response data
        const responseData = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: userRole
        };

        // Add business info for admin
        if (admin) {
            responseData.business_name = user.business_name;
            responseData.business_type = user.business_type;
        }
        // Add company info for service provider
        else if (serviceProvider) {
            responseData.company_name = user.company_name;
        }

        // Send success response
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: responseData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during login'
        });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'No account found with that email address'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // Save reset token to user
        await user.update({
            reset_token: resetToken,
            reset_token_expiry: resetTokenExpiry
        });

        // Send email
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset Request</h1>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            status: 'success',
            message: 'Password reset instructions sent to your email'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to process password reset request'
        });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        // Find user with valid reset token
        const user = await User.findOne({
            where: {
                reset_token: token,
                reset_token_expiry: {
                    [db.Sequelize.Op.gt]: Date.now()
                }
            }
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid or expired reset token'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update user password and clear reset token
        await user.update({
            password: hashedPassword,
            reset_token: null,
            reset_token_expiry: null
        });

        res.status(200).json({
            status: 'success',
            message: 'Password has been reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to reset password'
        });
    }
};