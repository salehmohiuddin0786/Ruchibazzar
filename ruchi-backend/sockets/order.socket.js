let io;

exports.initSocket = (server) => {
  const socketIO = require("socket.io");

  io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User Connected:", socket.id);

    // Join user room
    socket.on("joinUserRoom", (userId) => {
      socket.join(`user_${userId}`);
    });

    // Join restaurant room
    socket.on("joinRestaurantRoom", (restaurantId) => {
      socket.join(`restaurant_${restaurantId}`);
    });

    // Join delivery partner room
    socket.on("joinDeliveryRoom", (partnerId) => {
      socket.join(`delivery_${partnerId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User Disconnected:", socket.id);
    });
  });

  return io;
};

// Emit functions
exports.emitOrderCreated = (order) => {
  if (!io) return;

  // Notify restaurant
  io.to(`restaurant_${order.restaurantId}`).emit(
    "newOrder",
    order
  );

  // Notify customer
  io.to(`user_${order.userId}`).emit(
    "orderPlaced",
    order
  );
};

exports.emitOrderStatusUpdate = (order) => {
  if (!io) return;

  // Notify customer
  io.to(`user_${order.userId}`).emit(
    "orderStatusUpdated",
    order
  );

  // Notify delivery
  if (order.deliveryPartnerId) {
    io.to(`delivery_${order.deliveryPartnerId}`).emit(
      "deliveryUpdate",
      order
    );
  }
};