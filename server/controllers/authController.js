const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }

        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, username, role FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user: users[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Both current and new passwords are required' });
        }

        const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);
        
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
        
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ success: false, message: 'Server error changing password' });
    }
};
