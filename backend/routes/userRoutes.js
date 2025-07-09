const express = require("express");
const router = express.Router();
const authenticateUser = require("../config/auth");
const {
  registerUser,
  loginUser,
  updateUsername,
  changePassword,
  getProfile,
  getRole
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update-username", authenticateUser, updateUsername);
router.put("/change-password", authenticateUser, changePassword);
router.get("/my-profile",authenticateUser,getProfile);
router.get("/get-role/:id", getRole);

module.exports = router;
