const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  deleteUsers,
  getUsers,
  getSpecificUser,
  forgotPasswordMail,
  updateAccount,
  changePassword,
} = require("../controllers/auth_controller");
const { altVerifyToken } = require("../middlewares/verifyToken");
// login

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/sendmail", forgotPasswordMail);
// delete user route
router.delete("/delete", deleteUsers);
//get routes
router.get("/", getUsers);
router.get("/:userId", getSpecificUser);
// update routes
router.put("/", altVerifyToken, updateAccount);
router.put("/changepassword", altVerifyToken, changePassword);
module.exports = router;
