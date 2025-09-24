import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Knock from '@knocklabs/node';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const knock = new Knock({
    apiKey: process.env.KNOCK_SECRET_KEY,
});

app.use(cors());
app.use(express.json());
app.locals.knock = knock;

app.use('/api/users', usersRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', knock_configured: !!process.env.KNOCK_SECRET_KEY });
});

app.use((error, req, res, next) => {
    res.status(500).json({ error: 'Internal server error', message: error.message });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});