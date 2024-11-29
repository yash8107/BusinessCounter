import db from '../models/index.js';
const { User, Role, ServiceProviderProfile } = db;

export const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    USER: 'USER'
};

export const checkRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Unauthorized access'
                });
            }

            // Check both User and ServiceProviderProfile tables
            const admin = await User.findOne({
                where: { id: req.user.id },
                include: [{
                    model: Role,
                    as: 'role'
                }]
            });

            const serviceProvider = await ServiceProviderProfile.findOne({
                where: { id: req.user.id },
                include: [{
                    model: Role,
                    as: 'role'
                }]
            });

            const user = admin || serviceProvider;

            if (!user || !user.role) {
                return res.status(403).json({
                    status: 'error',
                    message: 'User role not found'
                });
            }

            const userRole = user.role.role_name;

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'You do not have permission to perform this action'
                });
            }

            // Add user type to request for later use
            req.userType = admin ? 'admin' : 'serviceProvider';
            next();

        } catch (error) {
            console.error('Role check error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    };
};

export const isSuperAdmin = checkRole([ROLES.SUPER_ADMIN]);
export const isAdmin = checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
export const isUser = checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER]);
