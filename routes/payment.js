const express = require("express");
const { paymentAction } = require("../controllers/payment_controller");
const router = express.Router();
const { altVerifyToken } = require("../middlewares/verifyToken");
router.post("/pay/:productId", altVerifyToken, paymentAction);
module.exports = router;
