const express = require("express");
const router = express.Router();
const {
  getYearDataPurchase,
  getNumberOfCourses,
  getPieData,
  getTotalNumberOfStudents,
} = require("../controllers/dashboard_controller");
const { verifyUser, altVerifyToken } = require("../middlewares/verifyToken");

router.get("/", altVerifyToken, getYearDataPurchase);
router.get("/count", altVerifyToken, getNumberOfCourses);
router.get("/graphs", altVerifyToken, getPieData);
router.get("/users/:page", altVerifyToken, getTotalNumberOfStudents);
module.exports = router;
