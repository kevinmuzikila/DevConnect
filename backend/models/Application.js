const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  userId: { type: String, required: true, unique: false },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile"},
  // Applicant Info
  fullName: { type: String },
  email: { type: String },
  coverLetter: { type: String },
  portfolioUrl: { type: String },
  resumePath: { type: String }, // file path or cloud URL
  useProfileResume: { type: Boolean, default: false }, // ✅ whether they used profile resume
  message: { type: String },
  status: {
    type: String,
    enum: ["pending", "interview", "rejected", "offer", "approved"],
    default: "pending"
  },
  adminMessage: {
    type: String,
  },
  interviewDate: {
    type: Date,
  },
  offerDetails: {
    salary: { type: String },       // e.g., "$80,000/year" or "R40,000/month"
    startDate: { type: Date },      // ISO date format (e.g. 2025-06-01)
  },
  screeningResult: {
    qualified: Boolean,
    score: Number,
    reasoning: String,
    matchedSkills: [String],
    missingSkills: [String],
    recommendations: [String], // optional
  },
  // Additional Application Fields
  experience: { type: String },
  availability: { type: String },
  salaryExpectation: { type: String },
  workAuthorization: { type: String },
  willingToRelocate: { type: Boolean, default: false },
  agreedToTerms: { type: Boolean, default: false },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application", ApplicationSchema);
