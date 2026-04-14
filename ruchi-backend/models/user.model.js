const { DataTypes } = require("sequelize");

// ✅ ROLES (centralized & reusable)
const ROLES = {
  CUSTOMER: "customer",
  PARTNER: "partner",
  ADMIN: "admin",
};

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      // 👤 BASIC INFO
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // 🔐 ROLE SYSTEM
      role: {
        type: DataTypes.ENUM(...Object.values(ROLES)),
        allowNull: false,
        defaultValue: ROLES.CUSTOMER,
      },

      // 🟢 ACCOUNT STATUS
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      // =========================
      // 🚚 DELIVERY PARTNER FIELDS
      // =========================

      vehicleType: {
        type: DataTypes.ENUM("bike", "scooter", "car"),
        allowNull: true,
      },

      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // 📍 CURRENT LOCATION (for live tracking)
      currentLat: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      currentLng: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      // ⭐ OPTIONAL: rating system
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 5.0,
      },

      // 📦 OPTIONAL: total deliveries count
      totalDeliveries: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
      tableName: "Users",

      // 🔥 IMPORTANT INDEXES (performance)
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
        {
          unique: true,
          fields: ["phone"],
        },
      ],
    }
  );

  // ✅ EXPORT ROLES (reuse everywhere)
  User.ROLES = ROLES;

  return User;
};