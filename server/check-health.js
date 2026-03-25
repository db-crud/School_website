const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const diagnostics = async () => {
  console.log('--- Server Diagnostics ---');
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
  });

  try {
    console.log('\n1. Testing Database Connection...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'gmss_khajura'
    });
    console.log('✅ Database connection successful.');

    console.log('\n2. Testing Admin User Existence...');
    const [users] = await connection.query('SELECT username FROM users WHERE username = ?', ['admin']);
    if (users.length > 0) {
      console.log('✅ Admin user "admin" found.');
    } else {
      console.log('❌ Admin user "admin" NOT found.');
    }
    await connection.end();

    console.log('\n3. Testing JWT Signing...');
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET is missing from .env');
    } else {
      const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('✅ JWT signing successful.');
    }

    console.log('\n--- Diagnostics Complete ---');
  } catch (err) {
    console.error('\n❌ Diagnostics Failed:', err.message);
    if (err.stack) console.error(err.stack);
  }
};

diagnostics();
