import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../models/index.js';
const { User, Role } = db;
import { ROLES } from '../middleware/roleCheck.js';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id, {
            include: [{
                model: Role,
                as: 'role'
            }]
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback",
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google profile:', profile);
        
        // Check if user already exists
        let user = await User.findOne({
            where: { 
                email: profile.emails[0].value 
            },
            include: [{
                model: Role,
                as: 'role'
            }]
        });

        if (user) {
            console.log('Existing user found:', user.id);
            return done(null, user);
        }

        // Find the ADMIN role
        const adminRole = await Role.findOne({
            where: { role_name: ROLES.ADMIN }
        });

        if (!adminRole) {
            console.error('Admin role not found');
            return done(new Error('Admin role not found'), null);
        }

        // Create new user with Google profile data
        const newUser = await User.create({
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            email: profile.emails[0].value,
            google_id: profile.id,
            role_id: adminRole.id,
            phone: '0000000000', // Default phone number
            business_name: 'Default Business', // Default business name
            business_type: 'Default', // Default business type
            status: 'active'
        });

        // Fetch the user with role included
        const userWithRole = await User.findByPk(newUser.id, {
            include: [{
                model: Role,
                as: 'role'
            }]
        });

        console.log('New user created:', userWithRole.id);
        return done(null, userWithRole);
    } catch (error) {
        console.error('Google auth error:', error);
        return done(error, null);
    }
}));
