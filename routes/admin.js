const express = require("express");
const router = express.Router();
const {
  getYearDataPurchase,
  getNumberOfCourses,
  getPieData,
} = require("../controllers/dashboard_controller");
const { verifyUser, altVerifyToken } = require("../middlewares/verifyToken");

router.get("/", altVerifyToken, getYearDataPurchase);
router.get("/count", altVerifyToken, getNumberOfCourses);
router.get("/graphs", altVerifyToken, getPieData);

module.exports = router;
