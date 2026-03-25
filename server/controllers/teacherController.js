const db = require('../config/db');

exports.getAllTeachers = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM teachers ORDER BY display_order ASC, name ASC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.createTeacher = async (req, res) => {
    const { name, subject, qualification, photo_url, contact_number, display_order } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO teachers (name, subject, qualification, photo_url, contact_number, display_order) VALUES (?, ?, ?, ?, ?, ?)',
            [name, subject, qualification, photo_url || null, contact_number || null, display_order || 0]
        );
        res.json({ success: true, message: 'Teacher added', id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateTeacher = async (req, res) => {
    const { name, subject, qualification, photo_url, contact_number, display_order } = req.body;
    try {
        await db.execute(
            'UPDATE teachers SET name = ?, subject = ?, qualification = ?, photo_url = ?, contact_number = ?, display_order = ? WHERE id = ?',
            [name, subject, qualification, photo_url, contact_number, display_order, req.params.id]
        );
        res.json({ success: true, message: 'Teacher updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        await db.execute('DELETE FROM teachers WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Teacher deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.reorderTeachers = async (req, res) => {
    const { updates } = req.body;
    try {
        for (const update of updates) {
            await db.execute('UPDATE teachers SET display_order = ? WHERE id = ?', [update.display_order, update.id]);
        }
        res.json({ success: true, message: 'Order updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
