const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const complaintRoutes = require("./routes/complaintRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/complaintDB")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/auth", authRoutes);
app.use("/complaints", complaintRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server running with MongoDB");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
