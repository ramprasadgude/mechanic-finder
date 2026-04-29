const express = require("express");
const router = express.Router();
const { getUsers, deleteUser, updateUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// GET all
router.get("/", protect, getUsers);

// PUT profile
router.put("/profile", protect, updateUserProfile);

// DELETE
router.delete("/:id", protect, deleteUser);

module.exports = router;
