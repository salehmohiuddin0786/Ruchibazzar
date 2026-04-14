// User Roles
const ROLES = {
  ADMIN: "admin",
  PARTNER: "partner",
  CUSTOMER: "customer",
  DELIVERY: "delivery",
};

// Order Status
const ORDER_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  PREPARING: "preparing",
  READY: "ready",
  PICKED_UP: "picked_up",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Payment Status
const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

// Commission %
const PLATFORM_COMMISSION_PERCENT = 20;

// Pagination Default
const DEFAULT_PAGE_SIZE = 10;

// JWT Expiry
const JWT_EXPIRES_IN = "7d";

module.exports = {
  ROLES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PLATFORM_COMMISSION_PERCENT,
  DEFAULT_PAGE_SIZE,
  JWT_EXPIRES_IN,
};