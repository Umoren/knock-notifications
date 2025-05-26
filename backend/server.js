import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Knock from '@knocklabs/node';
import notificationRoutes from './routes/notifications.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Knock client
const knock = new Knock({
    apiKey: process.env.KNOCK_SECRET_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Make knock client available to routes
app.locals.knock = knock;

// Routes
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        knock_configured: !!process.env.KNOCK_SECRET_KEY
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📧 Knock configured: ${!!process.env.KNOCK_SECRET_KEY}`);
});