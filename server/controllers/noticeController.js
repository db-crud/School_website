const db = require('../config/db');

exports.getAllNotices = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM notices ORDER BY date DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.getNoticeById = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM notices WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Notice not found' });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.createNotice = async (req, res) => {
    const { title, content, date, type, attachment_url } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO notices (title, content, date, type, attachment_url) VALUES (?, ?, ?, ?, ?)',
            [title, content, date, type || 'General', attachment_url || null]
        );
        res.json({ success: true, message: 'Notice created', id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.updateNotice = async (req, res) => {
    const { title, content, date, type, attachment_url } = req.body;
    try {
        await db.execute(
            'UPDATE notices SET title = ?, content = ?, date = ?, type = ?, attachment_url = ? WHERE id = ?',
            [title, content, date, type, attachment_url, req.params.id]
        );
        res.json({ success: true, message: 'Notice updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteNotice = async (req, res) => {
    try {
        await db.execute('DELETE FROM notices WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Notice deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
