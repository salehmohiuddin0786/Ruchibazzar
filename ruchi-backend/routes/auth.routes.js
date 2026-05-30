const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/phone-login", authController.loginWithPhone);
router.post("/partner/login", authController.loginPartner);

module.exports = router;
