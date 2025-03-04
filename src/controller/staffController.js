import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
const { User, StaffProfile, Role } = db;
import { ROLES } from '../middleware/roleCheck.js';

// Staff Login
export const staffLogin = async (req, res) => {
    try {
        const { work_email, password } = req.body;

        // Validate input
        if (!work_email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide work email and password'
            });
        }

        // Find staff profile by work email
        const staffProfile = await StaffProfile.findOne({
            where: { 
                work_email,
                status: 'active'  // Only active staff can login
            },
            include: [{
                model: User,
                as: 'user',
                include: [{
                    model: Role,
                    as: 'role'
                }]
            }]
        });

        if (!staffProfile) {
            return res.status(404).json({
                status: 'error',
                message: 'Staff not found or inactive'
            });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, staffProfile.user.password);
        if (!validPassword) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                user_providerId: staffProfile.user.id,
                staffId: staffProfile.id,
                role: staffProfile.user.role.role_name,
                email: staffProfile.user.email,
                work_email: staffProfile.work_email
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            status: 'success',
            message: 'Staff logged in successfully',
            data: {
                token,
                user: {
                    id: staffProfile.user.id,
                    staffId: staffProfile.id,
                    first_name: staffProfile.user.first_name,
                    last_name: staffProfile.user.last_name,
                    email: staffProfile.user.email,
                    work_email: staffProfile.work_email,
                    role: staffProfile.user.role.role_name,
                    designation: staffProfile.designation,
                    department: staffProfile.department
                }
            }
        });

    } catch (error) {
        console.error('Staff login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error during staff login'
        });
    }
};

// Get Staff Profile
export const getStaffProfile = async (req, res) => {
    try {
        const staffId = req.user.staffId;

        const staffProfile = await StaffProfile.findOne({
            where: { id: staffId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'email'],
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['role_name']
                }]
            }]
        });

        if (!staffProfile) {
            return res.status(404).json({
                status: 'error',
                message: 'Staff profile not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                id: staffProfile.id,
                user: staffProfile.user,
                designation: staffProfile.designation,
                department: staffProfile.department,
                employee_id: staffProfile.employee_id,
                joining_date: staffProfile.joining_date,
                work_email: staffProfile.work_email,
                work_phone: staffProfile.work_phone,
                permissions: staffProfile.permissions,
                status: staffProfile.status
            }
        });

    } catch (error) {
        console.error('Get staff profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching staff profile'
        });
    }
};
