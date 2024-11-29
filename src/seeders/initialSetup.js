import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    USER: 'USER'
};

const seedInitialSetup = async () => {
    try {
        // Validate environment variables
        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@businesscounter.com';
        const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123';

        if (!superAdminPassword) {
            throw new Error('Super admin password is required');
        }

        // Create roles
        const roles = await db.Role.bulkCreate([
            {
                role_name: ROLES.SUPER_ADMIN,
                status: 'active',
                created_by: null
            },
            {
                role_name: ROLES.ADMIN,
                status: 'active',
                created_by: null
            },
            {
                role_name: ROLES.USER,
                status: 'active',
                created_by: null
            }
        ]);

        // Get SUPER_ADMIN role
        const superAdminRole = await db.Role.findOne({
            where: {
                role_name: ROLES.SUPER_ADMIN
            }
        });

        if (!superAdminRole) {
            throw new Error('Super Admin role not found');
        }

        // Check if super admin already exists
        const existingSuperAdmin = await db.ServiceProviderProfile.findOne({
            where: { email: superAdminEmail }
        });

        if (existingSuperAdmin) {
            console.log('Super admin already exists, skipping creation');
            return { roles, superAdmin: existingSuperAdmin };
        }

        // Hash the super admin password
        const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

        // Create super admin in ServiceProviderProfile
        const superAdmin = await db.ServiceProviderProfile.create({
            first_name: 'Super',
            last_name: 'Admin',
            email: superAdminEmail,
            password: hashedPassword,
            phone: '1234567890',
            company_name: 'Business Counter',
            company_registration_number: 'BC123456',
            company_address: 'Business Counter HQ',
            company_phone: '9876543210',
            company_email: superAdminEmail,
            role_id: superAdminRole.id,
            status: 'active',
            subscription_plan: 'Enterprise',
            subscription_status: 'active',
            subscription_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
            created_by: null
        });

        console.log('Initial setup completed successfully');
        console.log('Super Admin Credentials:');
        console.log('Email:', superAdminEmail);
        console.log('Password:', superAdminPassword);
        
        return { roles, superAdmin };
    } catch (error) {
        console.error('Error in initial setup:', error);
        throw error;
    }
};

export { ROLES, seedInitialSetup };
