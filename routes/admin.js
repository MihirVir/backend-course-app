const express = require("express");
const router = express.Router();
const {
  getYearDataPurchase,
  getNumberOfCourses,
} = require("../controllers/dashboard_controller");
const { verifyUser, altVerifyToken } = require("../middlewares/verifyToken");

router.get("/", verifyUser, getYearDataPurchase);
router.get("/count", altVerifyToken, getNumberOfCourses);

module.exports = router;
