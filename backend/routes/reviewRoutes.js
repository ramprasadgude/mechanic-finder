const express = require("express");
const { createReview, getMechanicReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createReview);
router.get("/mechanic/:mechanicId", getMechanicReviews);

module.exports = router;
