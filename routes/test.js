const express = require('express');
const { createTestCourse, getSpecificCourse, deleteTestCourse, getAllCourses, searchCourseUsingRegExp, getCourseRecommendation } = require('../controllers/test_controller');
const router = express.Router();
const upload = require('../middlewares/multer_templates_config');
const { altVerifyToken } = require('../middlewares/verifyToken');

router.get('/', getAllCourses);
router.get("/search", searchCourseUsingRegExp);
router.get('/recommendation', getCourseRecommendation);
router.get("/:id", altVerifyToken, getSpecificCourse);
router.post("/", altVerifyToken,upload.single('template'), createTestCourse);
router.delete("/:id", altVerifyToken, deleteTestCourse);

module.exports = router;