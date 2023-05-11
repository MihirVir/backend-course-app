const express = require("express");
const {
  createNewPurchase,
  listOfCoursesPurchased,
  deleteAllPurchase,
} = require("../controllers/purchase_new_controller");
const router = express.Router();
const { altVerifyToken } = require("../middlewares/verifyToken");

router.get("/", altVerifyToken, listOfCoursesPurchased);
router.post("/:id", altVerifyToken, createNewPurchase);
router.delete("/", deleteAllPurchase);
module.exports = router;
