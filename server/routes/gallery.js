const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const auth = require('../middleware/auth');

router.get('/', galleryController.getGallery);
router.post('/', auth, galleryController.addGalleryImage);
router.delete('/:id', auth, galleryController.deleteGalleryImage);

module.exports = router;
