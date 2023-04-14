const express = require("express");
const router = express.Router();
const {
  createReview,
  getReview,
  getReviews,
  updateReview,
  deleteReview,
  getReviewAvgByCourseId,
} = require("../controllers/review_controller");
const { verifyUser, altVerifyToken } = require("../middlewares/verifyToken");

router.post("/:id", altVerifyToken, createReview);
router.get("/", getReviews);
router.get(":id", getReview);
router.patch("/", updateReview);
router.delete("/:id", deleteReview);
router.get("/avg/:courseId", getReviewAvgByCourseId);

module.exports = router;
