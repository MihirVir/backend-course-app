const express = require('express');
const { createTestCourse } = require('../controllers/test_controller');
const router = express.Router();
const upload = require('../middlewares/multer_templates_config');
const { altVerifyToken } = require('../middlewares/verifyToken');

router.post("/", altVerifyToken,upload.single('template'), createTestCourse);

module.exports = router;