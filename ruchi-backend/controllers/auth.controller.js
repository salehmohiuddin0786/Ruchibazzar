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
| REGISTER (Password OR OTP)
|--------------------------------------------------------------------------
*/
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      restaurantName,
      isOtpUser = false,
    } = req.body;

    // ✅ VALIDATION
    if (!name || (!email && !phone)) {
      return res.status(400).json({
        message: "Name and (email or phone) are required",
      });
    }

    // 🔍 CHECK EXISTING USER
    let existingUser = null;

    if (email) {
      existingUser = await User.findOne({ where: { email } });
    }
    if (!existingUser && phone) {
      existingUser = await User.findOne({ where: { phone } });
    }

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 🔐 PASSWORD HANDLING
    let hashedPassword = null;

    if (!isOtpUser) {
      if (!password) {
        return res.status(400).json({
          message: "Password is required",
        });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // 🎭 ROLE LOGIC
    let userRole = role === ROLES.PARTNER ? ROLES.PARTNER : ROLES.CUSTOMER;

    if (role === ROLES.ADMIN) {
      return res.status(403).json({
        message: "Admin registration not allowed",
      });
    }

    // 👤 CREATE USER
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
      isVerified: isOtpUser ? true : false,
      authProvider: isOtpUser ? "otp" : "password",
    });

    let restaurant = null;

    // 🍽️ CREATE RESTAURANT FOR PARTNER
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
      user,
      restaurant,
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
|--------------------------------------------------------------------------
| LOGIN (Password OR OTP)
|--------------------------------------------------------------------------
*/
exports.login = async (req, res) => {
  try {
    const { email, password, phone, isOtpLogin = false } = req.body;

    let user;

    // 🔥 OTP LOGIN
    if (isOtpLogin) {
      if (!phone) {
        return res.status(400).json({
          message: "Phone is required",
        });
      }

      user = await User.findOne({ where: { phone } });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          message: "Phone not verified",
        });
      }
    }

    // 🔐 PASSWORD LOGIN
    else {
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      if (!user.password) {
        return res.status(400).json({
          message: "Use OTP login for this account",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
    }

    const token = generateToken(user.id);

    // 🎯 CUSTOMER RESPONSE
    if (user.role === ROLES.CUSTOMER) {
      return res.json({
        message: "Customer login successful",
        token,
        role: "customer",
        user,
      });
    }

    // 🎯 PARTNER RESPONSE
    if (user.role === ROLES.PARTNER) {
      const restaurant = await Restaurant.findOne({
        where: { ownerId: user.id },
      });

      return res.json({
        message: "Partner login successful",
        token,
        role: "partner",
        user,
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
| OPTIONAL: Partner Login (Password only)
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

    if (!user.password) {
      return res.status(400).json({
        message: "Use OTP login",
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
      user,
      restaurant,
    });

  } catch (error) {
    console.error("Partner Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};