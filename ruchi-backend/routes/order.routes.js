const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const deliveryController = require("../controllers/delivery.controller");

const { protect, authorize } = require("../middlewares/auth.middleware");

/*
---------------------------------------
📦 ORDER ROUTES (CUSTOMER)
---------------------------------------
*/

// ✅ Create Order
router.post(
  "/",
  protect,
  authorize("customer"),
  orderController.createOrder
);

// ✅ Get My Orders
router.get(
  "/my-orders",
  protect,
  authorize("customer"),
  orderController.getUserOrders
);

/*
---------------------------------------
🍴 RESTAURANT ROUTES
---------------------------------------
*/

// ✅ Get Restaurant Orders
router.get(
  "/restaurant/:restaurantId",
  protect,
  authorize("admin", "restaurant"),
  orderController.getRestaurantOrders
);

// ✅ Update Order Status
router.put(
  "/:id/status",
  protect,
  authorize("admin", "restaurant"),
  orderController.updateOrderStatus
);

/*
---------------------------------------
🚚 DELIVERY ROUTES (SAFE VERSION)
---------------------------------------
*/

// 🔥 IMPORTANT: Validate controller exists before using

if (!deliveryController) {
  throw new Error("deliveryController not found");
}

// ✅ Assign Delivery Partner (ADMIN)
router.put(
  "/:id/assign",
  protect,
  authorize("admin"),
  deliveryController.assignDeliveryPartner
);

// ✅ Get My Deliveries
router.get(
  "/delivery/my-orders",
  protect,
  authorize("partner"),
  deliveryController.getMyDeliveries
);

// ✅ Pickup Order
router.put(
  "/:id/pick",
  protect,
  authorize("partner"),
  deliveryController.pickOrder
);

// ✅ Start Delivery
router.put(
  "/:id/start",
  protect,
  authorize("partner"),
  deliveryController.startDelivery
);

// ✅ Complete Delivery
router.put(
  "/:id/deliver",
  protect,
  authorize("partner"),
  deliveryController.completeDelivery
);

// ✅ Update Live Location
router.put(
  "/:id/location",
  protect,
  authorize("partner"),
  deliveryController.updateLocation
);

/*
---------------------------------------
📄 COMMON ROUTES
---------------------------------------
*/

// ⚠️ KEEP LAST (VERY IMPORTANT)
router.get(
  "/:id",
  protect,
  orderController.getOrderById
);

module.exports = router;