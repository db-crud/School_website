const express = require('express');
const app = express();

// Mock dependencies to avoid DB/Auth issues during route inspection
process.env.JWT_SECRET = 'test';
const auth = (req, res, next) => next();

// Import routes exactly as index.js does
try {
    const uploadRoute = require('./routes/upload');
    console.log('Upload route file loaded successfully');
    
    const router = express.Router();
    router.use('/upload', uploadRoute);
    
    console.log('--- Registered Routes ---');
    router.stack.forEach(r => {
        if (r.route && r.route.path) {
            console.log(`${Object.keys(r.route.methods).join(',').toUpperCase()} ${r.route.path}`);
        } else if (r.name === 'router') {
            r.handle.stack.forEach(sr => {
                if (sr.route) {
                    console.log(`${Object.keys(sr.route.methods).join(',').toUpperCase()} /upload${sr.route.path}`);
                }
            });
        }
    });
} catch (err) {
    console.error('Error loading upload route:', err.message);
}
