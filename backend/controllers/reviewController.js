const Review = require("../models/Review");
const Request = require("../models/Request");
const Mechanic = require("../models/Mechanic");

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (User)
exports.createReview = async (req, res) => {
  try {
    const { mechanicId, requestId, comment, priceRating, speedRating, qualityRating } = req.body;
    
    // Auto-calculate aggregate rating
    const rating = Math.round((Number(priceRating) + Number(speedRating) + Number(qualityRating)) / 3 * 10) / 10 || 5;

    // Validate request existence and completion
    const serviceRequest = await Request.findById(requestId);
    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }
    if (serviceRequest.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to review this request" });
    }
    if (serviceRequest.status !== "Completed") {
      return res.status(400).json({ message: "Can only review completed service requests" });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ request: requestId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this service request" });
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      mechanic: mechanicId,
      request: requestId,
      rating,
      priceRating: Number(priceRating) || 5,
      speedRating: Number(speedRating) || 5,
      qualityRating: Number(qualityRating) || 5,
      comment,
    });

    // Update the mechanic's overall rating and review count
    const reviews = await Review.find({ mechanic: mechanicId });
    const numOfReviews = reviews.length;
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

    await Mechanic.findByIdAndUpdate(mechanicId, {
      rating: Math.round(avgRating * 10) / 10,
      numOfReviews
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a mechanic
// @route   GET /api/reviews/mechanic/:mechanicId
// @access  Public
exports.getMechanicReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ mechanic: req.params.mechanicId }).populate("user", "name").sort("-createdAt");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
