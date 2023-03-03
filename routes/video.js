const express = require('express');
const { createVideo, deleteVideo, getSpecficVideoUsingIndex } = require('../controllers/course_controller');
const router = express.Router()
const upload = require('../middlewares/multer_config');
const { altVerifyToken } = require('../middlewares/verifyToken');

router.get('/:id', altVerifyToken, getSpecficVideoUsingIndex);
router.post("/:id", altVerifyToken,upload.array("videos"), createVideo);
router.put('/:id', altVerifyToken, deleteVideo);


module.exports = router;