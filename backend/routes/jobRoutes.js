const express = require('express');
const router = express.Router();
const Job = require('../models/Jobs');
const { auth } = require('@clerk/nextjs');

// Create a new job posting
router.post('/', async (req, res) => {
  try {


    const {
      title,
      company,
      location,
      jobType,
      salaryRange,
      description,
      isRemote,
      experienceLevel,
      techStack,
      requirements,
      benefits,
      isFeatured
    } = req.body;

    const newJob = new Job({
      title,
      company,
      location,
      jobType,
      salaryRange,
      description,
      isRemote,
      experienceLevel,
      techStack,
      requirements,
      benefits,
      isFeatured,
   
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Error creating job posting', error: error.message });
  }
});

// Get all jobs
// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active', isDeleted: false }) // 👈 filter out deleted jobs
      .sort({ isFeatured: -1, createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// Get a single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'firstName lastName email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
});

// Update a job
router.put('/:id', async (req, res) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Error updating job', error: error.message });
  }
});

// Delete a job
// DELETE /api/jobs/:id
// PATCH /api/jobs/:id/delete (or keep using DELETE if you prefer)
router.delete("/:id", async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job marked as deleted", job: updatedJob });
  } catch (err) {
    console.error("❌ Error deleting job:", err);
    res.status(500).json({ message: "Failed to mark job as deleted" });
  }
});



module.exports = router; 