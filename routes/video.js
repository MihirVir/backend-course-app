const express = require('express');
const { createVideo } = require('../controllers/course_controller');
const router = express.Router()
const upload = require('../middlewares/multer_config');
const { altVerifyToken } = require('../middlewares/verifyToken');

router.post("/:id", altVerifyToken,upload.array("videos"), createVideo);

module.exports = router;