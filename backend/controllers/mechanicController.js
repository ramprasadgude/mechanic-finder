const { validationResult } = require("express-validator");
const Mechanic = require("../models/Mechanic");

// @desc    Get all mechanics
// @route   GET /api/mechanics
// @access  Private
const getMechanics = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role !== "admin") {
      query.isApproved = true;
    }
    const mechanics = await Mechanic.find(query).populate("user", "name email");
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single mechanic by ID
// @route   GET /api/mechanics/:id
// @access  Private
const getMechanicById = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }
    res.json(mechanic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a mechanic
// @route   POST /api/mechanics
// @access  Private
const createMechanic = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, specialty, location, phone, experience, rating, available, description } =
    req.body;

  try {
    if (req.user.role !== "mechanic" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to create a mechanic profile" });
    }

    const existingProfile = await Mechanic.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ message: "Mechanic profile already exists" });
    }

    const mechanic = await Mechanic.create({
      name,
      specialty,
      location,
      phone,
      experience,
      rating,
      available,
      description,
      user: req.user._id,
    });
    res.status(201).json(mechanic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a mechanic
// @route   PUT /api/mechanics/:id
// @access  Private
const updateMechanic = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const mechanic = await Mechanic.findById(req.params.id);
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    if (
      mechanic.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to update this mechanic" });
    }

    const updated = await Mechanic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a mechanic
// @route   DELETE /api/mechanics/:id
// @access  Private
const deleteMechanic = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    if (
      mechanic.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this mechanic" });
    }

    await mechanic.deleteOne();
    res.json({ message: "Mechanic removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suggest best mechanic using advanced AI Diagnostic Heuristics
// @route   POST /api/mechanics/suggest
// @access  Private
const suggestMechanic = async (req, res) => {
  const { problemDescription, coordinates } = req.body;
  try {
    const textDesc = (problemDescription || "").toLowerCase();
    
    // Internal Diagnostic Rules Engine
    const diagnosticMap = [
      {
        keywords: ["brake", "stop", "squeak", "grind", "pad", "rotor"],
        specialty: "Brake Specialist",
        issues: ["Worn Brake Pads", "Warped Rotors", "Low Brake Fluid"],
        cost: "$150 - $400",
        urgency: "High",
        advice: "Avoid high-speed driving. Immediate brake inspection required."
      },
      {
        keywords: ["engine", "oil", "start", "crank", "smoke", "noise", "shaking", "dead"],
        specialty: "Engine Specialist",
        issues: ["Spark Plug Failure", "Oil Leak", "Faulty Starter/Alternator"],
        cost: "$200 - $800+",
        urgency: "Critical",
        advice: "Do not attempt to repeatedly force start. Towing may be necessary."
      },
      {
        keywords: ["transmission", "gear", "shift", "slip", "clutch"],
        specialty: "Transmission",
        issues: ["Low Transmission Fluid", "Worn Clutch", "Gear Slippage"],
        cost: "$300 - $1,500+",
        urgency: "Critical",
        advice: "Driving with a slipping transmission can cause catastrophic failure. Stop immediately."
      },
      {
        keywords: ["electrical", "battery", "light", "fuse", "radio", "horn", "power"],
        specialty: "Electrical",
        issues: ["Dead Battery", "Blown Fuse", "Alternator Failure"],
        cost: "$50 - $250",
        urgency: "Medium",
        advice: "Check battery terminals for corrosion. If jump-start fails, request service."
      },
      {
        keywords: ["ac", "cooling", "hot", "overheat", "air", "coolant", "temperature"],
        specialty: "AC & Cooling",
        issues: ["Freon Leak", "Bad Compressor", "Coolant Leak / Overheating"],
        cost: "$100 - $600",
        urgency: "High",
        advice: "If engine is overheating, turn off the vehicle immediately to avoid cracked engine block."
      },
      {
        keywords: ["tire", "wheel", "flat", "puncture", "wobble", "alignment", "burst"],
        specialty: "Tires & Wheels",
        issues: ["Flat Tire / Puncture", "Poor Wheel Alignment", "Bent Rim"],
        cost: "$20 - $150",
        urgency: "Medium",
        advice: "Pull over safely. Driving on a flat tire will destroy the wheel."
      },
      {
        keywords: ["body", "dent", "scratch", "paint", "crash", "smash", "mirror"],
        specialty: "Body Work",
        issues: ["Dented Panel", "Deep Scratches", "Bumper Damage"],
        cost: "$100 - $1000+",
        urgency: "Low",
        advice: "Usually cosmetic. Fix when convenient unless parts are dragging on the road."
      }
    ];

    let matchedRule = null;
    let maxMatchCount = 0;

    for (const rule of diagnosticMap) {
      let matchCount = rule.keywords.filter(kw => textDesc.includes(kw)).length;
      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        matchedRule = rule;
      }
    }

    // Default Fallback
    const diagnostics = matchedRule || {
      specialty: "General Repair",
      issues: ["Undiagnosed Mechanical Issue", "General Maintenance"],
      cost: "Varies",
      urgency: "Medium",
      advice: "A general inspection is needed to accurately diagnose the problem."
    };

    let query = { available: true, specialty: diagnostics.specialty };
    
    // If coords are given, find nearest
    if (coordinates && coordinates.length === 2) {
       query.geometry = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [coordinates[0], coordinates[1]]
            }
          }
       };
    }

    let matches = await Mechanic.find(query).limit(3);
    
    // If no perfect match found for the specialty nearby, fallback to high rated ones
    if (matches.length === 0) {
       matches = await Mechanic.find({ available: true }).sort("-rating").limit(3);
    }
    
    res.json({
      suggestedSpecialty: diagnostics.specialty,
      diagnostics: {
        possibleIssues: diagnostics.issues,
        estimatedCost: diagnostics.cost,
        urgency: diagnostics.urgency,
        advice: diagnostics.advice
      },
      mechanics: matches
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a mechanic
// @route   PUT /api/mechanics/:id/approve
// @access  Private/Admin
const approveMechanic = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to approve mechanics" });
    }

    const mechanic = await Mechanic.findById(req.params.id);
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    mechanic.isApproved = req.body.isApproved;
    await mechanic.save();

    res.json(mechanic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMechanics,
  getMechanicById,
  createMechanic,
  updateMechanic,
  deleteMechanic,
  suggestMechanic,
  approveMechanic,
};