const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  startDate: String,
  endDate: String,
  description: String,
});

const EducationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  location: String,
  startDate: String,
  endDate: String,
});

const UserProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // from Clerk or your own system
  name: String,
  title: String,
  email: String,
  location: String,
  phone: String,
  about: String,
  lastUpdate:  { type: Date, default: Date.now }, 
  skills: [String],
  experience: [ExperienceSchema],
  education: [EducationSchema],
  social: {
    linkedin: String,
    github: String,
    twitter: String,
    website: String,
  },
  preferences: {
    jobAlerts: Boolean,
    remoteOnly: Boolean,
    salary: String,
    jobType: String,
  },
});

module.exports = mongoose.model("UserProfile", UserProfileSchema);
