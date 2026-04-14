const { sequelize } = require("../config/db");

const User = require("./user.model")(sequelize);
const Restaurant = require("./restaurant.model")(sequelize);
const Dish = require("./dish.model")(sequelize);
const Order = require("./order.model")(sequelize);
const OrderItem = require("./orderItem.model")(sequelize);
const DeliveryPartner = require("./deliveryPartner.model")(sequelize);
const Earning = require("./earning.model")(sequelize);
const Review = require("./review.model")(sequelize);
const Offer = require("./offer.model")(sequelize);
const Banner = require("./banner.model")(sequelize);
const AuditLog = require("./auditLog.model")(sequelize);
const Cart = require("./Cart.model")(sequelize); // ✅ ADD CART MODEL

/* ================= RELATIONS ================= */

// User ↔ Restaurant
User.hasMany(Restaurant, { foreignKey: "ownerId" });
Restaurant.belongsTo(User, { foreignKey: "ownerId" });

// Restaurant ↔ Dish
Restaurant.hasMany(Dish, { foreignKey: "restaurantId" });
Dish.belongsTo(Restaurant, { foreignKey: "restaurantId" });

// User ↔ Order
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// Restaurant ↔ Order
Restaurant.hasMany(Order, { foreignKey: "restaurantId" });
Order.belongsTo(Restaurant, { foreignKey: "restaurantId" });

// Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// Dish ↔ OrderItem
Dish.hasMany(OrderItem, { foreignKey: "dishId" });
OrderItem.belongsTo(Dish, { foreignKey: "dishId" });

// DeliveryPartner ↔ Order
DeliveryPartner.hasMany(Order, { foreignKey: "deliveryPartnerId" });
Order.belongsTo(DeliveryPartner, { foreignKey: "deliveryPartnerId" });

// Restaurant ↔ Review
Restaurant.hasMany(Review, { foreignKey: "restaurantId" });
Review.belongsTo(Restaurant, { foreignKey: "restaurantId" });

// User ↔ Review
User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

// Restaurant ↔ Offer
Restaurant.hasMany(Offer, { foreignKey: "restaurantId" });
Offer.belongsTo(Restaurant, { foreignKey: "restaurantId" });

// Order ↔ Earning
Order.hasOne(Earning, { foreignKey: "orderId" });
Earning.belongsTo(Order, { foreignKey: "orderId" });

// ✅ CART RELATION
Dish.hasMany(Cart, { foreignKey: "dishId" });
Cart.belongsTo(Dish, { foreignKey: "dishId" });

module.exports = {
  sequelize,
  User,
  Restaurant,
  Dish,
  Order,
  OrderItem,
  DeliveryPartner,
  Earning,
  Review,
  Offer,
  Banner,
  AuditLog,
  Cart, // ✅ EXPORT CART
};