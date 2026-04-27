const express = require("express");
const router = express.Router();
const { getUsers, deleteUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// GET all
router.get("/", protect, getUsers);

// DELETE
router.delete("/:id", protect, deleteUser);

module.exports = router;
