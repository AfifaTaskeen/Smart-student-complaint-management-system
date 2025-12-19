const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdByEmail: {
    type: String,
    required: true,
  },
  attachmentName: {
    type: String,
  },
  attachmentType: {
    type: String,
  },
  attachmentPath: {
    type: String,
  },
  summary: {
    type: String,
  },
  resolutionMessage: {
    type: String,
  },
  resolutionDate: {
    type: Date,
  },
  adminResponse: {
    type: String,
  },
  lastUpdated: {
    type: Date,
  },
});

module.exports = mongoose.model("Complaint", complaintSchema);
