const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and PDF files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ---------- AI-BASED NLP: PRIORITY DETECTION ----------
/**
 * Analyzes complaint text using NLP-style keyword matching
 * Returns priority level based on urgency and severity indicators
 */
function getAIPriority(text) {
  const lowerText = text.toLowerCase();

  // HIGH priority keywords - urgent, safety-critical issues
  const highKeywords = [
    'urgent', 'emergency', 'not working', 'broken', 'fire',
    'electrical', 'safety', 'dangerous', 'immediately', 'asap',
    'critical', 'severe', 'hazard'
  ];

  // MEDIUM priority keywords - important but not critical
  const mediumKeywords = [
    'delay', 'slow', 'leakage', 'cleanliness', 'repair',
    'water', 'network', 'issue', 'problem', 'malfunction',
    'damage', 'faulty'
  ];

  // Check for HIGH priority
  for (const keyword of highKeywords) {
    if (lowerText.includes(keyword)) {
      return 'High';
    }
  }

  // Check for MEDIUM priority
  for (const keyword of mediumKeywords) {
    if (lowerText.includes(keyword)) {
      return 'Medium';
    }
  }

  // Default to LOW priority
  return 'Low';
}

// ---------- AI-BASED NLP: SUMMARY GENERATION ----------
/**
 * Generates intelligent summary using NLP text processing
 * Extracts key intent and creates meaningful 15-25 word summary
 */
function generateAISummary(description) {
  if (!description || description.trim() === '') {
    return 'No description provided';
  }

  // Clean and normalize text
  let text = description.trim()
    .replace(/\s+/g, ' ')  // Remove extra spaces
    .replace(/[\r\n]+/g, ' ');  // Remove line breaks

  // Remove filler words for better intent extraction
  const fillerWords = ['very', 'really', 'quite', 'just', 'please', 'kindly'];
  fillerWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    text = text.replace(regex, '');
  });

  // Clean up extra spaces after filler removal
  text = text.replace(/\s+/g, ' ').trim();

  // Extract first sentence or meaningful chunk
  const sentenceMatch = text.match(/^[^.!?]+[.!?]/);
  if (sentenceMatch) {
    text = sentenceMatch[0].trim();
  }

  // If text is too long, extract key words (15-25 words)
  const words = text.split(/\s+/);
  if (words.length > 25) {
    // Keep first 20 words for context
    text = words.slice(0, 20).join(' ') + '...';
  } else if (words.length < 5) {
    // If too short, use full description up to 25 words
    const fullWords = description.split(/\s+/);
    text = fullWords.slice(0, 25).join(' ');
    if (fullWords.length > 25) text += '...';
  }

  // Capitalize first letter
  text = text.charAt(0).toUpperCase() + text.slice(1);

  return text;
}

// ---------- COMPLAINT ID GENERATOR ----------
function generateComplaintId() {
  return "CMP" + Date.now();
}

// ---------- POST: SUBMIT COMPLAINT ----------
router.post("/", upload.single("attachment"), async (req, res) => {
  try {
    const { title, description, category, createdByEmail } = req.body;

    if (!createdByEmail) {
      return res.status(400).json({
        error: "User email is required",
      });
    }

    // AI-based processing: Generate summary and priority automatically
    const aiSummary = generateAISummary(description);
    const aiPriority = getAIPriority(description);

    const complaintData = {
      complaintId: generateComplaintId(),
      title: title,
      description: description,
      summary: aiSummary,  // AI-generated summary
      category: category,
      priority: aiPriority,  // AI-detected priority
      createdByEmail: createdByEmail,
    };

    // Add attachment info if file was uploaded
    if (req.file) {
      complaintData.attachmentName = req.file.originalname;
      complaintData.attachmentType = req.file.mimetype;
      complaintData.attachmentPath = req.file.filename;
    }

    const newComplaint = new Complaint(complaintData);
    await newComplaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to submit complaint",
    });
  }
});
// ---------- GET: FETCH ALL COMPLAINTS ----------
router.get("/", async (req, res) => {
    try {
      const { role, email } = req.query;

      let complaints;

      // If admin, return all complaints
      if (role === "admin") {
        complaints = await Complaint.find().sort({ date: -1 });
      } 
      // If student, return only their complaints
      else if (role === "student" && email) {
        complaints = await Complaint.find({ createdByEmail: email }).sort({ date: -1 });
      } 
      // Default: return all (for backward compatibility, but should require auth)
      else {
        complaints = await Complaint.find().sort({ date: -1 });
      }

      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch complaints",
      });
    }
  });
  
// ---------- PUT: UPDATE COMPLAINT STATUS (ADMIN) ----------
router.put("/:id/status", async (req, res) => {
    try {
      const { status, adminResponse } = req.body;
  
      // Validation: If status is In Progress or Resolved, adminResponse is required
      if ((status === 'In Progress' || status === 'Resolved') && (!adminResponse || adminResponse.trim() === '')) {
        return res.status(400).json({
          error: `Admin response is required when marking complaint as ${status}`,
        });
      }

      // Prepare update data
      const updateData = { 
        status: status,
        lastUpdated: new Date()
      };
      
      // If status is In Progress or Resolved, add admin response
      if (status === 'In Progress' || status === 'Resolved') {
        updateData.adminResponse = adminResponse;
      }
  
      const updatedComplaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
  
      if (!updatedComplaint) {
        return res.status(404).json({
          error: "Complaint not found",
        });
      }
  
      res.status(200).json({
        message: "Complaint status updated successfully",
        complaint: updatedComplaint,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to update complaint status",
      });
    }
  });

// ---------- GET: SERVE ATTACHMENT ----------
router.get("/attachment/:filename", (req, res) => {
  try {
    const filename = path.basename(req.params.filename); // Prevent directory traversal
    const filePath = path.join(uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve file" });
  }
});
    
module.exports = router;
