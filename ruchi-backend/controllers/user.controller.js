const { User, Restaurant } = require("../models");

/*
|--------------------------------------------------------------------------
| GET PROFILE
|--------------------------------------------------------------------------
*/
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "role",
        "isVerified",
        "authProvider",
        "isActive",
        "vehicleType",
        "isAvailable",
        "currentLat",
        "currentLng",
        "rating",
        "totalDeliveries",
        "createdAt"
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is deactivated",
      });
    }

    let restaurant = null;

    // 🍽️ Partner → fetch restaurant
    if (user.role === "partner") {
      restaurant = await Restaurant.findOne({
        where: { ownerId: user.id },
      });
    }

    res.json({
      message: "Profile fetched successfully",
      user,
      restaurant,
    });

  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
*/
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Email uniqueness check
    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });

      if (exists) {
        return res.status(400).json({
          message: "Email already in use",
        });
      }
    }

    // ✅ Update fields safely
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE LOCATION (Delivery Tracking)
|--------------------------------------------------------------------------
*/
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // ✅ Validate input
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Only partners/delivery users should update location
    if (user.role !== "partner") {
      return res.status(403).json({
        message: "Only delivery partners can update location",
      });
    }

    user.currentLat = lat;
    user.currentLng = lng;

    await user.save();

    res.json({
      message: "Location updated successfully",
      location: {
        lat: user.currentLat,
        lng: user.currentLng,
      },
    });

  } catch (error) {
    console.error("Location Error:", error);
    res.status(500).json({
      message: "Failed to update location",
    });
  }
};