const { sequelize, Order, OrderItem, Offer } = require("../models");
const { ORDER_STATUS } = require("../config/constants");
const { calculateAndCreateEarning } = require("../services/commission.service");
const { assignDeliveryPartner } = require("../services/orderAssignment.service");
const { sendNotification } = require("../services/notification.service");

/*
---------------------------------------
CREATE ORDER
---------------------------------------
*/
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { items, restaurantId, deliveryAddress, couponCode } = req.body;

    // ✅ VALIDATION (FIXED → return 400 instead of throw)
    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "Items required" });
    }

    if (!restaurantId) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "Restaurant ID required" });
    }

    if (!deliveryAddress) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "Delivery address required" });
    }

    if (!req.user?.id) {
      await transaction.rollback();
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user.id;

    // ==========================
    // 💰 CALCULATE AMOUNT
    // ==========================
    let originalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    let discount = 0;
    let finalAmount = originalAmount;
    let appliedCoupon = null;

    // ==========================
    // 🎟️ COUPON LOGIC (SAFE)
    // ==========================
    if (couponCode) {
      const offer = await Offer.findOne({
        where: { couponCode: couponCode.trim(), isActive: true },
      });

      if (!offer) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: "Invalid coupon" });
      }

      const now = new Date();

      if (offer.validFrom && now < new Date(offer.validFrom)) {
        await transaction.rollback();
        return res.status(400).json({ message: "Offer not started yet" });
      }

      if (offer.validTo && now > new Date(offer.validTo)) {
        await transaction.rollback();
        return res.status(400).json({ message: "Offer expired" });
      }

      if (
        offer.minOrderAmount &&
        originalAmount < Number(offer.minOrderAmount)
      ) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Minimum order ₹${offer.minOrderAmount}`,
        });
      }

      if (offer.usageLimit && offer.usedCount >= offer.usageLimit) {
        await transaction.rollback();
        return res.status(400).json({ message: "Coupon limit reached" });
      }

      discount =
        (originalAmount * Number(offer.discountPercent)) / 100;

      if (offer.maxDiscount && discount > offer.maxDiscount) {
        discount = offer.maxDiscount;
      }

      finalAmount = originalAmount - discount;
      appliedCoupon = offer.couponCode;

      await offer.increment("usedCount", { transaction });
    }

    // ==========================
    // 🧾 CREATE ORDER
    // ==========================
    const order = await Order.create(
      {
        userId,
        restaurantId,
        originalAmount,
        totalAmount: finalAmount,
        discount,
        couponCode: appliedCoupon,
        deliveryAddress,
        status: ORDER_STATUS.PENDING,
      },
      { transaction }
    );

    // ==========================
    // 🧾 CREATE ITEMS
    // ==========================
    await OrderItem.bulkCreate(
      items.map((item) => ({
        orderId: order.id,
        dishId: item.dishId,
        quantity: item.quantity,
        price: item.price,
      })),
      { transaction }
    );

    await transaction.commit();

    // ==========================
    // 🚀 AFTER COMMIT SERVICES
    // ==========================
    calculateAndCreateEarning(order).catch(() => {});

    sendNotification({
      userId,
      title: "Order Placed",
      message: `Order #${order.id} placed successfully`,
    }).catch(() => {});

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
      breakdown: {
        originalAmount,
        discount,
        finalAmount,
        couponCode: appliedCoupon,
      },
    });

  } catch (error) {
    await transaction.rollback();

    console.error("Order creation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/*
---------------------------------------
GET USER ORDERS
---------------------------------------
*/
exports.getUserOrders = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [OrderItem],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, orders });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
---------------------------------------
GET RESTAURANT ORDERS (SECURED)
---------------------------------------
*/
exports.getRestaurantOrders = async (req, res) => {
  try {
    if (!["admin", "restaurant"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.findAll({
      where: { restaurantId: req.params.restaurantId },
      include: [OrderItem],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, orders });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
---------------------------------------
GET ORDER BY ID
---------------------------------------
*/
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [OrderItem],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.json({ success: true, order });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
---------------------------------------
UPDATE ORDER STATUS (DELIVERY READY)
---------------------------------------
*/
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!Object.values(ORDER_STATUS).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔐 SECURITY
    if (req.user.role === "customer") {
      return res.status(403).json({
        message: "Customers cannot update order",
      });
    }

    await order.update({ status });

    // 🚚 AUTO ASSIGN DELIVERY WHEN CONFIRMED
    if (status === ORDER_STATUS.CONFIRMED) {
      try {
        await assignDeliveryPartner(order.id);
      } catch (err) {
        console.log("No delivery partner available");
      }
    }

    // 🔔 NOTIFICATION
    sendNotification({
      userId: order.userId,
      title: "Order Update",
      message: `Order #${order.id} is now ${status}`,
    }).catch(() => {});

    return res.json({
      success: true,
      message: "Order updated",
      order,
    });

  } catch (error) {
    console.error("Status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};