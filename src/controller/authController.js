'use strict';
import { models } from '../models';
const { User } = models;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Signup Function
export const signup = async (req, res) => {
    const { first_name, middle_name, last_name, email, password, gender, phone, country_code, role_id, address_line1, address_line2, city, state, postal_code, country } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({
            first_name,
            middle_name,
            last_name,
            email,
            password: hashedPassword,
            gender,
            phone,
            country_code,
            role_id,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            created_by: null, // Set this according to your logic
            updated_by: null, // Set this according to your logic
            deleted_by: null, // Set this according to your logic
        });

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            user: {
                id: user.id,
                first_name: user.first_name,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};


// Login Function
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, 'your_jwt_secret', {
            expiresIn: '1h', // Token expires in 1 hour
        });

        res.status(200).json({
            status: 'success',
            message: 'Successfully logged in',
            token,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};