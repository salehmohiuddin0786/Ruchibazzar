const bcrypt = require("bcryptjs");
const { User } = require("../models");
const generateToken = require("../utils/generateToken");

/*
---------------------------------------
🚚 DELIVERY PARTNER SIGNUP
---------------------------------------
*/
const registerDeliveryPartner = async (req, res) => {
  try {
    const { name, email, phone, password, vehicleType } = req.body;

    // ✅ Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // ✅ Phone validation (10 digit)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    // ✅ Password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create partner
    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      phone,
      password: hashedPassword,
      role: "partner",
      vehicleType: vehicleType || "bike",
      isAvailable: false,
      isActive: true,
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: "Delivery partner registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        vehicleType: user.vehicleType,
      },
    });

  } catch (error) {
    console.error("PARTNER REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/*
---------------------------------------
🚚 DELIVERY PARTNER LOGIN
---------------------------------------
*/
const loginDeliveryPartner = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ Find user
    const user = await User.findOne({
      where: { email, role: "partner" },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    // ✅ Check active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked",
      });
    }

    // ✅ Password match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        vehicleType: user.vehicleType,
      },
    });

  } catch (error) {
    console.error("PARTNER LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/*
---------------------------------------
📦 EXPORTS
---------------------------------------
*/
module.exports = {
  registerDeliveryPartner,
  loginDeliveryPartner,
};