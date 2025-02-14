import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import './src/config/passport.js';
import authRouter from './src/routes/authRoute.js';
import { authenticateToken } from './src/middleware/tokenVerify.js';
import db from './src/models/index.js';
import { seedInitialSetup } from './src/seeders/initialSetup.js';
import customerRouter from './src/routes/customerRoute.js';
import { Sequelize } from 'sequelize';
import invoiceRoutes from './src/routes/invoiceRoute.js';

dotenv.config();

// ES module dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
}));
// Configure CORS with credentials
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie']
}));

// Global middleware for cookie settings
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));         
// Initialize Passport for authentication with Google
app.use(passport.initialize());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/customers', customerRouter);
// Use the invoice routes
app.use('/invoices', invoiceRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: "Woohoo!! this is working..."
    });
});

app.get('/protected-route', authenticateToken, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: "You have access to this protected route!"
    });
});


// Handle 404 routes
app.use("*", (req, res) => {
    res.status(404).json({
        message: "API URL Not Found"
    });
});

const PORT = process.env.PORT || 3000;
console.log('Using port:', PORT);

// Sync database and start server
async function startServer() {
    try {
        // Create database if it doesn't exist
        const sequelize = new Sequelize(
            'postgres',
            process.env.DB_USER,
            process.env.DB_PASS,
            {
                host: process.env.DB_HOST,
                dialect: 'postgres',
                logging: false
            }
        );

        await sequelize.query(`CREATE DATABASE "${process.env.DB_NAME}";`)
        .catch(error => {
            if (error.original.code !== '42P04') { // 42P04 is the error code for "database already exists"
                throw error;
            }
        });
        console.log(`Database "${process.env.DB_NAME}" created or already exists.`);
        // Make sure database is connected
        await db.sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Sync database tables without dropping
        await db.sequelize.sync();
        console.log('Database tables synced successfully.');

        // Only run initial setup if needed (you might want to check if roles exist first)
        const Role = db.Role;
        const adminRole = await Role.findOne();
        if (!adminRole) {
            await seedInitialSetup();
            console.log('Initial setup completed successfully.');
        }
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();