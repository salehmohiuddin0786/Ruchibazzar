const express = require("express");
const router = express.Router();

const deliveryController = require("../controllers/delivery.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

/*
---------------------------------------
🚚 DELIVERY ROUTES (SECURE + CLEAN)
---------------------------------------
*/

// ✅ Assign Delivery Partner (ADMIN ONLY)
router.put(
  "/assign/:id",
  protect,
  authorize("admin"),
  deliveryController.assignDeliveryPartner
);

// ✅ Get My Deliveries (PARTNER)
router.get(
  "/my-orders",
  protect,
  authorize("partner"),
  deliveryController.getMyDeliveries
);

// ✅ Pickup Order
router.put(
  "/pick/:id",
  protect,
  authorize("partner"),
  deliveryController.pickOrder
);

// ✅ Start Delivery
router.put(
  "/start/:id",
  protect,
  authorize("partner"),
  deliveryController.startDelivery
);

// ✅ Complete Delivery
router.put(
  "/complete/:id",
  protect,
  authorize("partner"),
  deliveryController.completeDelivery
);

// ✅ Update Live Location
router.put(
  "/location/:id",
  protect,
  authorize("partner"),
  deliveryController.updateLocation
);

module.exports = router;