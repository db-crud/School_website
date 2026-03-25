const db = require('../config/db');

exports.sendMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        await db.execute(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await db.execute('UPDATE contact_messages SET is_read = TRUE WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        await db.execute('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
