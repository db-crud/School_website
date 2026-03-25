const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only images (JPGE/JPG/PNG) and PDFs are allowed!'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

router.post('/', auth, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
    } else if (err) {
      console.error('Unknown upload error:', err);
      return res.status(500).json({ success: false, message: `Server Error: ${err.message}` });
    }

    if (!req.file) {
      console.log('No file received in request');
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    console.log('File received:', req.file.filename);
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      message: 'File uploaded successfully', 
      url: fileUrl,
      filename: req.file.filename
    });
  });
});

module.exports = router;
