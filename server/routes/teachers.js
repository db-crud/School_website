const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const auth = require('../middleware/auth');

router.get('/', teacherController.getAllTeachers);
router.post('/', auth, teacherController.createTeacher);
router.put('/reorder', auth, teacherController.reorderTeachers);
router.put('/:id', auth, teacherController.updateTeacher);
router.delete('/:id', auth, teacherController.deleteTeacher);

module.exports = router;
