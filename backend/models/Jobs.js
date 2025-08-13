const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  jobType: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship']
  },
  salaryRange: {
    min: {
      type: Number,
      required: false
    },
    max: {
      type: Number,
      required: false
    }
  },
  description: {
    type: String,
    required: true
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: ['entry', 'mid', 'senior', 'lead']
  },
  techStack: [{
    type: String,
    trim: true
  }],
  requirements: {
    type: String,
    required: true
  },
  benefits: {
    type: String
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  // In Job model:
isDeleted: { type: Boolean, default: false },
postedBy: {
    type: String,
    required: false, // 👈 make it optional
  }
}, {
  timestamps: true
});

// Index for better search performance
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;

