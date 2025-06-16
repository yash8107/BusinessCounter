import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
    try {
        // Check for token in cookies
        const token = req.cookies.authToken;
        
        // console.log('Cookies received:', req.cookies);
        // console.log('Auth token from cookie:', token);

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No token provided'
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        // Attach user info to request
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        
        // Clear invalid token
        res.clearCookie('authToken');
        
        return res.status(401).json({
            status: 'error',
            message: 'Invalid or expired token'
        });
    }
};
