import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './src/routes/authRoute.js';
import { authenticateToken } from './src/middleware/tokenVerify.js';
import db from './src/models/index.js';
import { seedInitialSetup } from './src/seeders/initialSetup.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/auth', authRouter);

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