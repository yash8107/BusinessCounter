# Google Authentication Integration Guide

This guide explains how to integrate Google Sign-In into the BusinessCounter application.

## 1. Package Installation

Install required packages:
```bash
npm install passport passport-google-oauth20
```

## 2. File Changes

### 2.1 Create Passport Configuration
Create new file: `src/config/passport.js`
```javascript
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../models/index.js';
const { User, Role } = db;
import { ROLES } from '../middleware/roleCheck.js';

// Passport serialization setup
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google Strategy configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback",
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        // User handling logic here
        // Check existing user or create new one
    } catch (error) {
        return done(error, null);
    }
}));
```

### 2.2 Update User Model
In `src/models/user.js`, add Google authentication fields:
```javascript
google_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
},
password: {
    type: DataTypes.STRING,
    allowNull: true  // Made nullable for Google auth users
}
```

### 2.3 Update Auth Routes
In `src/routes/authRoute.js`, add Google authentication routes:
```javascript
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
        // JWT token generation and redirect logic
    }
);
```

### 2.4 Update Server Configuration
In `server.js`, initialize Passport:
```javascript
import passport from 'passport';
import './src/config/passport.js';

// ... other imports

app.use(passport.initialize());
```

### 2.5 Environment Variables
Add to `.env`:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
FRONTEND_URL=http://localhost:3000
```

## 3. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing one
3. Configure OAuth Consent Screen:
   - Choose "External" user type
   - Fill required information:
     - App name: "BusinessCounter"
     - User support email
     - Developer contact information
     - Application home page: http://localhost:3000
     - Authorized domains: localhost

4. Create OAuth 2.0 Client ID:
   - Go to Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Set name: "BusinessCounter Web Client"
   - Add Authorized JavaScript origins:
     ```
     http://localhost:3000
     ```
   - Add Authorized redirect URIs:
     ```
     http://localhost:3000/api/v1/auth/google/callback
     ```

5. Add Test Users:
   - Go to OAuth consent screen
   - Add test users in "Test users" section
   - Add emails of users who will test the application

## 4. Testing

1. Start your server
2. Visit: `http://localhost:3000/api/v1/auth/google`
3. Select Google account
4. You will be redirected back with JWT token

## 5. Production Considerations

Before going to production:
1. Submit app for verification if needed
2. Update authorized domains with production domain
3. Update redirect URIs with production URLs
4. Update environment variables with production values
5. Implement proper error handling and logging
6. Set up proper session management if needed

## 6. Security Notes

- Never commit OAuth credentials to version control
- Always use environment variables for sensitive data
- Implement proper validation and error handling
- Use HTTPS in production
- Regularly rotate secrets and monitor usage
