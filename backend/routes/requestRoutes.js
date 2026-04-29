const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const {
  createRequest,
  getUserRequests,
  getMechanicRequests,
  getAllRequests,
  updateRequestStatus,
  createEmergencyRequest,
  deleteRequest
} = require("../controllers/requestController");

router
  .route("/")
  .post(
    protect,
    [
      body("mechanicId", "Mechanic ID is required").notEmpty(),
      body("problemDescription", "Problem description is required").notEmpty(),
      body("location", "Location is required").notEmpty(),
    ],
    createRequest
  );

router.get("/user", protect, getUserRequests);
router.get("/mechanic", protect, getMechanicRequests);
router.get("/all", protect, getAllRequests);
router.post("/emergency", protect, createEmergencyRequest);
router.put(
  "/:id/status",
  protect,
  [
    body("status", "Invalid status").isIn(["Pending", "Accepted", "Rejected", "Completed"]),
  ],
  updateRequestStatus
);
router.delete("/:id", protect, deleteRequest);

module.exports = router;
