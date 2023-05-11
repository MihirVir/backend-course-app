const express = require("express");
const {
  createVideo,
  deleteVideo,
  getSpecficVideoUsingIndex,
  getSpecificCourseVideo,
  updateVideoTitle,
  updateVideoAtIndex,
  deleteAllVideos,
} = require("../controllers/course_controller");
const router = express.Router();
const upload = require("../middlewares/multer_config");
const { altVerifyToken } = require("../middlewares/verifyToken");

router.get("/:id/:idx", altVerifyToken, getSpecficVideoUsingIndex);
router.get("/:id", altVerifyToken, getSpecificCourseVideo);
router.post("/:id", altVerifyToken, upload.array("videos"), createVideo);
router.put("/:id", altVerifyToken, deleteVideo);
router.put("/title/:id", altVerifyToken, updateVideoTitle);
router.put(
  "/video/:id",
  altVerifyToken,
  upload.single("video"),
  updateVideoAtIndex
);
router.delete("/", deleteAllVideos);
module.exports = router;
