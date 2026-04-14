const db = require("../models");

const Cart = db.Cart;
const Dish = db.Dish;


// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { cartId, dishId, quantity } = req.body;

    const existing = await Cart.findOne({
      where: { cartId, dishId }
    });

    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();
      return res.json(existing);
    }

    const item = await Cart.create({
      cartId,
      dishId,
      quantity: quantity || 1
    });

    res.status(201).json(item);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get Cart
exports.getCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await Cart.findAll({
      where: { cartId },
      include: [
        {
          model: Dish,
        }
      ]
    });

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update Quantity
exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = await Cart.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = quantity;
    await item.save();

    res.json(item);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete Item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    await Cart.destroy({
      where: { id }
    });

    res.json({ message: "Item removed" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};