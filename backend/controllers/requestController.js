const { validationResult } = require("express-validator");
const Request = require("../models/Request");
const Mechanic = require("../models/Mechanic");

// @desc    Create a new service request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { mechanicId, problemDescription, location, appointmentDate, isEmergency } = req.body;

  try {
    const mechanic = await Mechanic.findById(mechanicId);
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    const request = await Request.create({
      user: req.user._id,
      mechanic: mechanicId,
      problemDescription,
      location,
      appointmentDate,
      isEmergency
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's requests
// @route   GET /api/requests/user
// @access  Private
const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user._id })
      .populate("mechanic", "name location phone _id geometry")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get requests meant for logged in mechanic
// @route   GET /api/requests/mechanic
// @access  Private
const getMechanicRequests = async (req, res) => {
  try {
    // First, find the mechanic profile associated with this user
    const mechanicProfile = await Mechanic.findOne({ user: req.user._id });
    if (!mechanicProfile) {
      return res.status(404).json({ message: "Mechanic profile not found" });
    }

    const requests = await Request.find({ 
      mechanic: mechanicProfile._id,
      status: { $ne: "Pending Admin Approval" }
    })
      .populate("user", "name email phone")
      .populate("mechanic", "name location phone _id geometry")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all service requests (Admin only)
// @route   GET /api/requests/all
// @access  Private/Admin
const getAllRequests = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view all requests" });
    }
    const requests = await Request.find({})
      .populate("user", "name email phone")
      .populate("mechanic", "name location phone _id geometry")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private
const updateRequestStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { status } = req.body;

  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Verify ownership: mechanic updating must own the mechanic profile
    const mechanicProfile = await Mechanic.findById(request.mechanic);
    
    // Check if the user updating is either an admin or the associated mechanic
    if (req.user.role !== "admin") {
      if (!mechanicProfile || mechanicProfile.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this request" });
      }
    }

    request.status = status;
    const updatedRequest = await request.save();
    
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create emergency request (SOS)
// @route   POST /api/requests/emergency
// @access  Private
const createEmergencyRequest = async (req, res) => {
  const { location, coordinates, problemDescription } = req.body;

  try {
    // Spatial query: find nearest available mechanic
    // If coords are provided, use $near
    let mechanic;
    if (coordinates && coordinates.length === 2) {
      mechanic = await Mechanic.findOne({
        available: true,
        geometry: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: coordinates
            }
            // Optional: $maxDistance: 50000 // meters
          }
        }
      });
    }

    // Fallback if no geo search matches or coords missing: find any available
    if (!mechanic) {
       mechanic = await Mechanic.findOne({ available: true });
    }

    if (!mechanic) {
      return res.status(404).json({ message: "No available mechanics found nearby. Please call 911 if in immediate danger." });
    }

    const request = await Request.create({
      user: req.user._id,
      mechanic: mechanic._id,
      problemDescription: problemDescription || "EMERGENCY: Immediate assistance required",
      location: location || "User Current Location",
    });

    res.status(201).json({ request, message: `Emergency request routed to ${mechanic.name}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a service request
// @route   DELETE /api/requests/:id
// @access  Private
const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Allow deletion if the user is the owner of the request, the mechanic involved, or an admin
    const mechanicProfile = await Mechanic.findById(request.mechanic);
    const isOwner = request.user.toString() === req.user._id.toString();
    const isMechanic = mechanicProfile && mechanicProfile.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isMechanic && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this request" });
    }

    await Request.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Request removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getUserRequests,
  getMechanicRequests,
  getAllRequests,
  updateRequestStatus,
  createEmergencyRequest,
  deleteRequest,
};
