import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Auth Header:', authHeader);

    if (!authHeader) {
        return res.status(401).json({
            status: 'error',
            message: 'No authorization header found'
        });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);
    console.log('JWT Secret:', process.env.JWT_SECRET);

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(403).json({
            status: 'error',
            message: 'Invalid or expired token'
        });
    }
};