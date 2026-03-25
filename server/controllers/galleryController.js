const db = require('../config/db');

exports.getGallery = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM gallery ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.addGalleryImage = async (req, res) => {
    const { title, image_url, category } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO gallery (title, image_url, category) VALUES (?, ?, ?)',
            [title || null, image_url, category || 'General']
        );
        res.json({ success: true, message: 'Image added', id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteGalleryImage = async (req, res) => {
    try {
        await db.execute('DELETE FROM gallery WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Image deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
