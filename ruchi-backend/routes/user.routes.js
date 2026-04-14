const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

router.get("/profile", protect, getProfile);

module.exports = router;