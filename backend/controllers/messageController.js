const Message = require("../models/Message");

// @desc    Get all messages for a request
// @route   GET /api/messages/:requestId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ request: req.params.requestId }).sort("createdAt");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessages,
};
