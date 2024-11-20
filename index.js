import express from 'express';
import { connection } from './src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to the database
await connection();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})