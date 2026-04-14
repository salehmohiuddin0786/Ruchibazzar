const bcrypt = require("bcryptjs");
const { User, Restaurant } = require("../models");
const generateToken = require("../utils/generateToken");

// Roles
const ROLES = {
  CUSTOMER: "customer",
  PARTNER: "partner",
  ADMIN: "admin",
};

/*
|--------------------------------------------------------------------------
| Register (Customer / Restaurant Owner)
|--------------------------------------------------------------------------
*/
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, restaurantName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let userRole = role === ROLES.PARTNER ? ROLES.PARTNER : ROLES.CUSTOMER;

    if (role === ROLES.ADMIN) {
      return res.status(403).json({
        message: "Admin registration not allowed",
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
    });

    let restaurant = null;

    // ✅ Auto create restaurant
    if (userRole === ROLES.PARTNER) {
      if (!restaurantName) {
        return res.status(400).json({
          message: "Restaurant name is required",
        });
      }

      restaurant = await Restaurant.create({
        name: restaurantName,
        ownerId: user.id,
      });
    }

    const token = generateToken(user.id);

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      restaurant,
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
|--------------------------------------------------------------------------
| UNIVERSAL LOGIN (SMART LOGIN 🔥)
|--------------------------------------------------------------------------
*/
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user.id);

    // 🔥 IF CUSTOMER
    if (user.role === ROLES.CUSTOMER) {
      return res.json({
        message: "Customer login successful",
        token,
        role: "customer",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }

    // 🔥 IF RESTAURANT OWNER
    if (user.role === ROLES.PARTNER) {
      const restaurant = await Restaurant.findOne({
        where: { ownerId: user.id },
      });

      return res.json({
        message: "Restaurant login successful",
        token,
        role: "partner",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        restaurant,
      });
    }

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
|--------------------------------------------------------------------------
| OPTIONAL: Partner Login (if you still want separate)
|--------------------------------------------------------------------------
*/
exports.loginPartner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email, role: ROLES.PARTNER },
    });

    if (!user) {
      return res.status(400).json({
        message: "Restaurant account not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const restaurant = await Restaurant.findOne({
      where: { ownerId: user.id },
    });

    const token = generateToken(user.id);

    res.json({
      message: "Restaurant login successful",
      token,
      role: "partner",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      restaurant,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};