const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Rejected"],
      default: "Pending",
    },
    problemDescription: {
      type: String,
      required: [true, "Please describe the problem"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Please provide your current location"],
      trim: true,
    },
    appointmentDate: {
      type: Date,
    },
    isEmergency: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
