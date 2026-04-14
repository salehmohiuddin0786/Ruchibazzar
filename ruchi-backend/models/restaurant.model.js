const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Restaurant", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    address: { type: DataTypes.STRING },
    latitude: { type: DataTypes.FLOAT },
    longitude: { type: DataTypes.FLOAT },
    image: { type: DataTypes.STRING },
    isOpen: { type: DataTypes.BOOLEAN, defaultValue: true },

    // 🔥 ADD THIS ONLY
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};