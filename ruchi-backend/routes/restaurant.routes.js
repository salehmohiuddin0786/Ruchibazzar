const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurant.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

// Create restaurant
router.post(
  "/",
  protect,
  authorize("partner", "admin"),
  restaurantController.createRestaurant
);

// Get all restaurants
router.get("/", restaurantController.getAllRestaurants);

// Get single restaurant by ID
router.get("/:id", restaurantController.getRestaurantById);

module.exports = router;