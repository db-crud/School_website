const db = require('../config/db');

exports.getContent = async (req, res) => {
    try {
        const { page } = req.query;
        let query = 'SELECT * FROM site_content';
        let params = [];
        
        if (page) {
            query += ' WHERE page_name = ?';
            params.push(page);
        }

        const [rows] = await db.execute(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateContent = async (req, res) => {
    const { page_name, section_key, section_value } = req.body;
    try {
        await db.execute(
            'INSERT INTO site_content (page_name, section_key, section_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE section_value = ?',
            [page_name, section_key, section_value, section_value]
        );
        res.json({ success: true, message: 'Content updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
