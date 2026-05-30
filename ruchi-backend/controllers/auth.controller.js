const bcrypt = require("bcryptjs");
const axios = require("axios");
const { User, Restaurant } = require("../models");
const generateToken = require("../utils/generateToken");

const ROLES = {
  CUSTOMER: "customer",
  PARTNER: "partner",
  ADMIN: "admin",
};

const normalizeIndianPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  const withoutCountryCode =
    digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;

  if (!/^[6-9]\d{9}$/.test(withoutCountryCode)) {
    return null;
  }

  return withoutCountryCode;
};

const verifyFirebasePhoneToken = async (idToken, expectedPhone) => {
  const apiKey = process.env.FIREBASE_WEB_API_KEY;

  if (!apiKey) {
    const error = new Error("Firebase API key missing");
    error.statusCode = 500;
    throw error;
  }

  if (!idToken) {
    const error = new Error("Firebase verification token is required");
    error.statusCode = 400;
    throw error;
  }

  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      { idToken },
      { headers: { "Content-Type": "application/json" } }
    );
    const firebasePhone = normalizeIndianPhone(response.data?.users?.[0]?.phoneNumber);

    if (!firebasePhone || firebasePhone !== expectedPhone) {
      const error = new Error("Firebase phone verification failed");
      error.statusCode = 401;
      throw error;
    }

    return response.data.users[0];
  } catch (error) {
    if (error.statusCode) throw error;

    const firebaseError = new Error(
      error.response?.data?.error?.message || "Firebase phone verification failed"
    );
    firebaseError.statusCode = error.response?.status || 401;
    throw firebaseError;
  }
};

const formatUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isVerified: user.isVerified,
});

const register = async (req, res) => {
  try {
    const { name, email, phone: rawPhone, password, role, firebaseIdToken } = req.body || {};
    const phone = normalizeIndianPhone(rawPhone);

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and valid phone are required",
      });
    }

    if (role === ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Admin registration is not allowed",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password required",
      });
    }

    await verifyFirebasePhoneToken(firebaseIdToken, phone);

    const userRole = role === ROLES.PARTNER ? ROLES.PARTNER : ROLES.CUSTOMER;
    const existingEmail = await User.findOne({ where: { email } });
    const existingPhone = await User.findOne({ where: { phone } });

    if (existingPhone) {
      if (existingEmail && existingEmail.id !== existingPhone.id) {
        return res.status(400).json({
          success: false,
          message: "This email is already used by another account",
        });
      }

      existingPhone.name = name;
      existingPhone.email = email;
      existingPhone.role = userRole;
      existingPhone.isVerified = true;
      existingPhone.authProvider = "password";
      existingPhone.password = await bcrypt.hash(password, 10);

      await existingPhone.save();

      const restaurant = await Restaurant.findOne({
        where: { ownerId: existingPhone.id },
      });
      const token = generateToken(existingPhone.id);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        token,
        user: formatUserResponse(existingPhone),
        restaurant,
      });
    }

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login or use another email.",
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
      role: userRole,
      isVerified: true,
      authProvider: "password",
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: formatUserResponse(user),
      restaurant: null,
    });
  } catch (error) {
    console.error("Register Error:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Email or phone already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password required",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: "Login successful",
      requiresOtp: false,
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const loginWithPhone = async (req, res) => {
  try {
    const phone = normalizeIndianPhone(req.body?.phone);
    const { firebaseIdToken } = req.body || {};

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Valid 10 digit Indian phone number is required",
      });
    }

    await verifyFirebasePhoneToken(firebaseIdToken, phone);

    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Phone Login Error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Phone login failed",
    });
  }
};

const loginPartner = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({
      where: {
        email,
        role: ROLES.PARTNER,
      },
    });

    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Partner not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const restaurant = await Restaurant.findOne({
      where: { ownerId: user.id },
    });

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: "Partner login successful",
      token,
      user,
      restaurant,
    });
  } catch (error) {
    console.error("Partner Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  register,
  login,
  loginWithPhone,
  loginPartner,
};
