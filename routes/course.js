const express = require('express')
const router = express.Router();
const {uploadVideo, removeAllCourses, deleteSpecificVideo, updateCourse, getVideoByTags, searchVideoUsingRegEx, getRecommendedCourse, getWithoutVideos, sendingVideoIndex} = require('../controllers/video_controller');
const upload = require('../middlewares/multer_config')
const {verifyIsAdmin, verifyUser, altVerifyToken} = require('../middlewares/verifyToken');
const uploadImage = require('../middlewares/multer_templates_config')

// get routes
router.get('/tags', getVideoByTags);
router.get('/search', searchVideoUsingRegEx);
router.get('/recommended', altVerifyToken, getRecommendedCourse);
router.get("/:id/:videoIndex", verifyUser, sendingVideoIndex)
router.get('/:id', altVerifyToken, getWithoutVideos);

// post routes
router.post('/upload', verifyUser, upload.array('files'), uploadVideo);

// delete routes
router.delete('/', removeAllCourses);

// update course
router.patch('/video/:id', deleteSpecificVideo);
router.patch('/:id', uploadImage.single('img'), updateCourse);
// router.patch('/title/:id', changeTitle);

module.exports = router;