const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

// ✅ Register (customer / partner)
router.post("/register", authController.register);

// ✅ Customer Login
router.post("/login", authController.login);

// ✅ Partner Login
router.post("/partner/login", authController.loginPartner);

module.exports = router;