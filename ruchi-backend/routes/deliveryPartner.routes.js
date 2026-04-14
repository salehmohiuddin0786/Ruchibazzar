const express = require("express");
const router = express.Router();

const {
  registerDeliveryPartner,
  loginDeliveryPartner,
} = require("../controllers/deliveryPartner.controller");

// ✅ Signup
router.post("/signup", registerDeliveryPartner);

// ✅ Login
router.post("/login", loginDeliveryPartner);

module.exports = router;