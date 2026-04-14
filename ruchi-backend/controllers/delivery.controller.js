const { Order, User } = require("../models");

/*
---------------------------------------
ASSIGN DELIVERY PARTNER
---------------------------------------
*/
exports.assignDeliveryPartner = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { deliveryPartnerId } = req.body;

    if (!orderId || isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    if (!deliveryPartnerId) {
      return res.status(400).json({
        success: false,
        message: "Delivery partner ID is required",
      });
    }

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.deliveryPartnerId) {
      return res.status(400).json({
        success: false,
        message: "Order already assigned",
      });
    }

    const partner = await User.findByPk(deliveryPartnerId);

    if (!partner || partner.role !== "partner") {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    if (!partner.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Delivery partner is not available",
      });
    }

    order.deliveryPartnerId = partner.id;
    order.deliveryStatus = "assigned";

    await order.save();

    partner.isAvailable = false;
    await partner.save();

    return res.status(200).json({
      success: true,
      message: "Order assigned successfully",
      order,
    });

  } catch (error) {
    console.error("ASSIGN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
---------------------------------------
OTHER REQUIRED FUNCTIONS (IMPORTANT)
---------------------------------------
*/

exports.getMyDeliveries = async (req, res) => {
  res.json({ message: "my deliveries working" });
};

exports.pickOrder = async (req, res) => {
  res.json({ message: "pick order working" });
};

exports.startDelivery = async (req, res) => {
  res.json({ message: "start delivery working" });
};

exports.completeDelivery = async (req, res) => {
  res.json({ message: "complete delivery working" });
};

exports.updateLocation = async (req, res) => {
  res.json({ message: "location updated" });
};