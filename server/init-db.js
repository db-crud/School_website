const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const initDb = async () => {
    // Connection without database to create it first
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
    });

    try {
        console.log('Connecting to MySQL...');
        
        // 1. Create Database
        const dbName = process.env.DB_NAME || 'gmss_khajura';
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`Database "${dbName}" created or already exists.`);
        
        await connection.query(`USE ${dbName}`);

        // 2. Read and Execute schema.sql
        const schemaPath = path.join(__dirname, '..', 'schema.sql');
        let schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Remove comments
        schema = schema.replace(/\-\-.*$/gm, '');

        // Split by semicolon
        const queries = schema
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        console.log('Executing schema queries...');
        for (let query of queries) {
            console.log(`Executing: ${query.substring(0, 50)}...`);
            await connection.query(query);
        }
        console.log('Schema setup complete.');

        // 3. Insert Admin User
        const adminUsername = 'admin';
        const adminPasswordHash = '$2b$10$1mnCD65wFWSohXAjD6Tw4e/MogJkXPlu1FN854JH8dMqdYodvBDFy'; // admin123
        
        const [existing] = await connection.query('SELECT * FROM users WHERE username = ?', [adminUsername]);
        if (existing.length === 0) {
            await connection.query(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [adminUsername, adminPasswordHash, 'superadmin']
            );
            console.log('Default admin user created (admin / admin123).');
        } else {
            console.log('Admin user already exists.');
        }

        console.log('Database initialization successful!');
    } catch (err) {
        console.error('Initialization failed:', err.message);
    } finally {
        await connection.end();
    }
};

initDb();
