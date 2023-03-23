const express = require("express");
const {
  createVideo,
  deleteVideo,
  getSpecficVideoUsingIndex,
  getSpecificCourseVideo,
} = require("../controllers/course_controller");
const router = express.Router();
const upload = require("../middlewares/multer_config");
const { altVerifyToken } = require("../middlewares/verifyToken");

router.get("/:id/:idx", altVerifyToken, getSpecficVideoUsingIndex);
router.get("/:id", altVerifyToken, getSpecificCourseVideo);
router.post("/:id", altVerifyToken, upload.array("videos"), createVideo);
router.put("/:id", altVerifyToken, deleteVideo);

module.exports = router;
