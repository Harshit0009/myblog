const express = require("express");
const { handleSignup, handleLogin, handleGetUserProfile, handleLogOut } = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

// it has all the routes for controlling user authentication
// auth routes
// /api/signup
router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.get("/me", isAuthenticated, handleGetUserProfile);
router.get("/logout", handleLogOut);

module.exports = router;