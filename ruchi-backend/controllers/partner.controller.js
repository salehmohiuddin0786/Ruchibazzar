const { Restaurant, Order } = require("../models");

exports.getPartnerDashboard = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      where: { ownerId: req.user.id },
    });

    const orders = await Order.count({
      where: { restaurantId: restaurant.id },
    });

    res.json({ restaurant, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};