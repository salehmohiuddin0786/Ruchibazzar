const bcrypt = require("bcryptjs");
const { User, DeliveryPartner } = require("../models");
const generateToken = require("../utils/generateToken");

/*
---------------------------------------
🚚 DELIVERY PARTNER SIGNUP
---------------------------------------
*/
const registerDeliveryPartner = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,

      dob,
      age,
      gender,
      address,
      city,
      pincode,
      preferredZone,

      aadhaarNumber,
      panNumber,
      voterId,

      vehicleType,
      vehicleNumber,
      drivingLicenseNumber,
      drivingLicenseExpiry,
      vehicleRegistrationNumber,
      vehicleInsurance,
      pucCertificate,

      bankAccountNumber,
      ifscCode,
      accountHolderName,
      upiId,

      referralCode,
      educationQualification,
      experience,
      emergencyContact,
    } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and password are required",
      });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (age && Number(age) < 18) {
      return res.status(400).json({
        success: false,
        message: "Delivery partner must be 18 or above",
      });
    }

    if (aadhaarNumber && !/^[0-9]{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Aadhaar number",
      });
    }

    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid PAN number",
      });
    }

    if (emergencyContact && !/^[0-9]{10}$/.test(emergencyContact)) {
      return res.status(400).json({
        success: false,
        message: "Invalid emergency contact number",
      });
    }

    const existingPhone = await User.findOne({ where: { phone } });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    if (email) {
      const existingEmail = await User.findOne({ where: { email } });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email ? email.trim() : null,
      phone,
      password: hashedPassword,
      role: "partner",
      isAvailable: false,
      isActive: true,
    });

    const partner = await DeliveryPartner.create({
      userId: user.id,

      name: name.trim(),
      phone,
      email: email ? email.trim() : null,

      dob: dob || null,
      age: age || null,
      gender: gender || null,
      address: address || null,
      city: city || null,
      pincode: pincode || null,
      preferredZone: preferredZone || null,

      aadhaarNumber: aadhaarNumber || null,
      panNumber: panNumber ? panNumber.toUpperCase() : null,
      voterId: voterId || null,

      vehicleType: vehicleType || "bike",
      vehicleNumber: vehicleNumber || vehicleRegistrationNumber || null,
      drivingLicenseNumber: drivingLicenseNumber || null,
      drivingLicenseExpiry: drivingLicenseExpiry || null,
      vehicleRegistrationNumber: vehicleRegistrationNumber || null,
      vehicleInsurance: vehicleInsurance || null,
      pucCertificate: pucCertificate || null,

      bankAccountNumber: bankAccountNumber || null,
      ifscCode: ifscCode ? ifscCode.toUpperCase() : null,
      accountHolderName: accountHolderName || null,
      upiId: upiId || null,

      referralCode: referralCode || null,
      educationQualification: educationQualification || null,
      experience: experience || null,
      emergencyContact: emergencyContact || null,

      isAvailable: false,
      isVerified: false,
      kycStatus: "pending",
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
      },
      partner,
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
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/phone and password are required",
      });
    }

    const whereCondition = email
      ? { email, role: "partner" }
      : { phone, role: "partner" };

    const user = await User.findOne({
      where: whereCondition,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const partner = await DeliveryPartner.findOne({
      where: { userId: user.id },
    });

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      partner,
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