const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend access
    methods: ["GET", "POST"]
  }
});

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room specific to the request ID
  socket.on("join_request_room", (requestId) => {
    socket.join(requestId);
    console.log(`User joined room: ${requestId}`);
  });

  // Handle incoming messages
  socket.on("send_message", async (data) => {
    try {
      const { requestId, senderId, text } = data;
      // Save message to database
      const timestamp = new Date();
      // Emitting to everyone in the room
      io.to(requestId).emit("receive_message", { senderId, text, createdAt: timestamp });
      
      await Message.create({
        request: requestId,
        sender: senderId,
        text
      });
    } catch (err) {
      console.error("Message save error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/mechanics", require("./routes/mechanicRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "MechaFind API is running..." });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});