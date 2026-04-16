const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  updateLocation
} = require("../controllers/user.controller");

const { protect } = require("../middlewares/auth.middleware");

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/

// 👤 Get Profile
router.get("/profile", protect, getProfile);

// ✏️ Update Profile (name, email)
router.put("/profile", protect, updateProfile);

// 📍 Update Live Location (for delivery tracking)
router.put("/location", protect, updateLocation);

module.exports = router;