const {
  sequelize,
  Order,
  OrderItem,
  Offer,
  User,
  Restaurant,
  Dish,
} = require("../models");

const { ORDER_STATUS } = require("../config/constants");
const { calculateAndCreateEarning } = require("../services/commission.service");
const { assignDeliveryPartner } = require("../services/orderAssignment.service");
const { sendNotification } = require("../services/notification.service");

/*
---------------------------------------
HELPER: FORMAT ORDER FOR FRONTEND
---------------------------------------
*/
const formatOrder = (order) => ({
  id: order.id,
  orderNumber: `ORD-${order.id}`,
  status: order.status,
  createdAt: order.createdAt,

  totalAmount: Number(order.totalAmount || 0),
  discount: Number(order.discount || 0),
  subtotal: Number(order.originalAmount || 0),
  deliveryFee: 0,

  deliveryAddress: order.deliveryAddress,

  // ✅ Coordinates saved in backend
  deliveryLat: order.deliveryLat,
  deliveryLng: order.deliveryLng,

  customerDetails: {
    name: order.user?.name || "N/A",
    phone: order.user?.phone || "N/A",
    email: order.user?.email || "N/A",
  },

  restaurant: order.restaurant || null,

  items:
    order.orderItems?.map((item) => ({
      id: item.id,
      dishId: item.dishId,
      name: item.dish?.name || "Item",
      image: item.dish?.image || null,
      quantity: Number(item.quantity || 1),
      price: Number(item.price || 0),
      dish: item.dish || null,
    })) || [],
});

/*
---------------------------------------
CREATE ORDER
---------------------------------------
*/
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      items,
      restaurantId,
      deliveryAddress,
      couponCode,
      latitude,
      longitude,
    } = req.body;

    if (!req.user || req.user.role !== "customer") {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "Only customers allowed",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Items required",
      });
    }

    if (!restaurantId || !deliveryAddress) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Restaurant & address required",
      });
    }

    const deliveryLat =
      latitude !== undefined && latitude !== null && latitude !== ""
        ? Number(latitude)
        : null;

    const deliveryLng =
      longitude !== undefined && longitude !== null && longitude !== ""
        ? Number(longitude)
        : null;

    if (
      (deliveryLat !== null && Number.isNaN(deliveryLat)) ||
      (deliveryLng !== null && Number.isNaN(deliveryLng))
    ) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude",
      });
    }

    const userId = req.user.id;

    const originalAmount = items.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);

    let discount = 0;
    let finalAmount = originalAmount;
    let appliedCoupon = null;

    if (couponCode) {
      const offer = await Offer.findOne({
        where: {
          couponCode: couponCode.trim(),
          isActive: true,
        },
      });

      if (!offer) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Invalid coupon",
        });
      }

      const now = new Date();

      if (offer.validFrom && now < new Date(offer.validFrom)) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Offer not started",
        });
      }

      if (offer.validTo && now > new Date(offer.validTo)) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Offer expired",
        });
      }

      if (
        offer.minOrderAmount &&
        originalAmount < Number(offer.minOrderAmount)
      ) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Minimum ₹${offer.minOrderAmount}`,
        });
      }

      discount =
        (originalAmount * Number(offer.discountPercent || 0)) / 100;

      if (offer.maxDiscount && discount > Number(offer.maxDiscount)) {
        discount = Number(offer.maxDiscount);
      }

      finalAmount = originalAmount - discount;
      appliedCoupon = offer.couponCode;

      await offer.increment("usedCount", { transaction });
    }

    const order = await Order.create(
      {
        userId,
        restaurantId,
        originalAmount,
        totalAmount: finalAmount,
        discount,
        couponCode: appliedCoupon,
        deliveryAddress,

        // ✅ Save latitude and longitude here
        deliveryLat,
        deliveryLng,

        status: ORDER_STATUS.PENDING,
      },
      { transaction }
    );

    await OrderItem.bulkCreate(
      items.map((item) => ({
        orderId: order.id,
        dishId: item.dishId,
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
      })),
      { transaction }
    );

    await transaction.commit();

    calculateAndCreateEarning(order).catch(() => {});

    sendNotification({
      userId,
      title: "Order Placed",
      message: `Order #${order.id} placed`,
    }).catch(() => {});

    const fullOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Dish, as: "dish" }],
        },
        { model: User, as: "user" },
        { model: Restaurant, as: "restaurant" },
      ],
    });

    return res.status(201).json({
      success: true,
      order: formatOrder(fullOrder),
    });
  } catch (error) {
    await transaction.rollback();

    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
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
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Dish, as: "dish" }],
        },
        { model: User, as: "user" },
        { model: Restaurant, as: "restaurant" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      orders: orders.map(formatOrder),
    });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
---------------------------------------
GET RESTAURANT ORDERS
---------------------------------------
*/
exports.getRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = Number(req.params.restaurantId);

    if (!restaurantId || Number.isNaN(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurantId",
      });
    }

    const orders = await Order.findAll({
      where: { restaurantId },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Dish, as: "dish" }],
        },
        { model: User, as: "user" },
        { model: Restaurant, as: "restaurant" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      orders: orders.map(formatOrder),
    });
  } catch (error) {
    console.error("GET RESTAURANT ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Dish, as: "dish" }],
        },
        { model: User, as: "user" },
        { model: Restaurant, as: "restaurant" },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order: formatOrder(order),
    });
  } catch (error) {
    console.error("GET ORDER BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
---------------------------------------
UPDATE ORDER STATUS
---------------------------------------
*/
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.update({ status });

    if (status === ORDER_STATUS.CONFIRMED) {
      await assignDeliveryPartner(order.id).catch(() => {});
    }

    sendNotification({
      userId: order.userId,
      title: "Order Update",
      message: `Order #${order.id} is ${status}`,
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      order: formatOrder(order),
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};