const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getMechanics,
  getMechanicById,
  createMechanic,
  updateMechanic,
  deleteMechanic,
  suggestMechanic,
  approveMechanic,
} = require("../controllers/mechanicController");
const { protect } = require("../middleware/authMiddleware");

// AI Suggestion
router.post("/suggest", protect, suggestMechanic);

// GET all / POST create
router
  .route("/")
  .get(protect, getMechanics)
  .post(
    protect,
    [
      body("name", "Name is required").notEmpty(),
      body("specialty", "Specialty is required").notEmpty(),
      body("location", "Location is required").notEmpty(),
      body("phone", "Phone is required").notEmpty(),
      body("experience", "Experience is required").isNumeric(),
    ],
    createMechanic
  );

// GET one / PUT update / DELETE
router
  .route("/:id")
  .get(protect, getMechanicById)
  .put(
    protect,
    [
      body("name", "Name is required").optional().notEmpty(),
      body("specialty", "Specialty is required").optional().notEmpty(),
      body("location", "Location is required").optional().notEmpty(),
      body("phone", "Phone is required").optional().notEmpty(),
      body("experience", "Experience is required").optional().isNumeric(),
    ],
    updateMechanic
  )
  .delete(protect, deleteMechanic);

// Admin approve
router.put("/:id/approve", protect, approveMechanic);

module.exports = router;