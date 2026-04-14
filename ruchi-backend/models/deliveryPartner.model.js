const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("DeliveryPartner", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, unique: true },
    vehicleNumber: { type: DataTypes.STRING },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
  });
};