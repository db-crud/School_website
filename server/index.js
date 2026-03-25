const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
    res.send('GMSS Khajura School API is running...');
});

app.get('/ping', (req, res) => {
    res.json({ success: true, message: 'pong', time: new Date() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/content', require('./routes/content'));
app.use('/api/upload', require('./routes/upload'));

// Serve uploads folder statically
app.use('/uploads', express.static('uploads'));

// 404 Handler for API
app.use('/api', (req, res) => {
    console.log(`404 at ${req.method} ${req.originalUrl}`);
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
