const express = require("express");
const router = express.Router();
const UserProfile = require("../models/UserProfile");

// Create or update user profile
router.post("/", async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const updated = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { new: true, upsert: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error("Profile save error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user profile
router.get("/:userId", async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

module.exports = router;
