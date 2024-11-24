import express from 'express';
import { sequelize } from './src/config/database.js';
import dotenv from 'dotenv';
import authRouter from './src/routes/authRoute.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: "Woohoo!! this is working..."
    });
})
app.get('/protected-route', authenticateToken, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'You have accessed a protected route!',
        user: req.user,
    });
});

// Connect to the database
sequelize.sync().then(() => {
    console.log("Databased synced");
}).catch(err => console.error("Error syncing Database:-", err));

// All Routs will be here
app.use('/api/v1/auth', authRouter);

//this for if we pass worng url or additional param
app.use("*", (req, res, next) => {
    res.status(404).json({
        status: "Request is Failed.",
        Message: 'Route/Endpoint not Found'
    })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})