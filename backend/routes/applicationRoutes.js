const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// Middleware to parse JSON
router.use(express.json());

// GET all job applications (admin view)
router.get("/all", async (req, res) => {
  try {
    const applications = await Application.find();

    const populated = await Application.find()
      .sort({ createdAt: -1 })
      .populate("jobId", "title company location techStack")
      .populate("profileId");

    res.status(200).json({
      success: true,
      count: populated.length,
      data: populated,
    });
  } catch (err) {
    console.error("Error fetching all applications:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// POST route to submit application (no file upload)
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      jobId,
      profileId,
      firstName,
      lastName,
      email,
      phone,
      location,
      experience,
      linkedinUrl,
      status,
      portfolioUrl,
      coverLetter,
      availability,
      salaryExpectation,
      willingToRelocate,
      screeningResult,
    } = req.body;

    console.log("data", jobId, firstName, email)

    // Validate required fields
    if (!jobId || !firstName || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const fullName = `${firstName} ${lastName}`.trim();

    const newApp = new Application({
      userId,
      jobId,
      profileId,
      firstName,
      lastName,
      fullName,
      email,
      status,
      phone,
      location,
      experience,
      linkedinUrl,
      portfolioUrl,
      coverLetter,
      availability,
      salaryExpectation,
      willingToRelocate,
      screeningResult,
      // No resumePath since we're skipping file upload
    });

    await newApp.save();

    res.status(201).json({ 
      success: true,
      message: "Application submitted successfully",
      application: newApp 
    });

  } catch (err) {
    console.error("Application submission error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

// GET all applications for a specific user (by email)
router.get("/:userId", async (req, res) => {
  try {
    const applications =  await Application.find({ userId: req.params.userId })// 🔁 fixed key
      .sort({ createdAt: -1 })
      .populate("jobId", "title company location"); // ✅ populating job info

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    console.error("Error fetching user applications:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.get("/stats/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const total = await Application.countDocuments({ userId });

    const statusCounts = await Application.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statsMap = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      total,
      pending: statsMap["pending"] || 0,
      interviews: statsMap["interview"] || 0,
      rejected: statsMap["rejected"] || 0,
      offers: statsMap["offer"] || 0,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});


// GET applications by userId (admin view)
router.get("/by-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const applications = await Application.find({ userId })
      .sort({ createdAt: -1 })
      .populate("jobId", "title company location"); // Include job info

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    console.error("Admin fetch by user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/applications/:id/respond
router.put("/:id/respond", async (req, res) => {
  try {
    const { status, adminMessage, interviewDate, offerDetails } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status || application.status;
    application.adminMessage = adminMessage || application.adminMessage;
    application.interviewDate = interviewDate || application.interviewDate;
    application.offerDetails = offerDetails || application.offerDetails

    await application.save();

    res.status(200).json({ message: "Response sent", application });
  } catch (err) {
    console.error("Respond error:", err);
    res.status(500).json({ message: "Failed to update application" });
  }
});



module.exports = router;