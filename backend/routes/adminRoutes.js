// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("email", email)
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // You can use JWT here instead of just responding with success
    res.json({ message: "Login successful", adminId: admin._id });
  } catch (err) {
    console.error("Admin login failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// routes/adminRoutes.js
router.post("/seed", async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = new Admin({ email, password });
      await admin.save(); // ✅ Will trigger the hashing middleware
      res.status(201).json({ message: "Admin created", adminId: admin._id });
    } catch (error) {
      console.error("Seeding admin failed:", error);
      res.status(500).json({ message: "Failed to create admin" });
    }
  });

module.exports = router;
