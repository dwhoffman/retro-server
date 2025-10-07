const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const http = require("http");

const port = process.env.PORT || 10000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "Socket server running", connectedClients: io.engine.clientsCount });
});

// Board update endpoint - called by cs-retro API routes
app.post("/board-update/:boardId", (req, res) => {
  const { boardId } = req.params;
  const boardData = req.body;
  
  console.log(`Broadcasting update for board ${boardId}`);
  io.to(boardId).emit("board-update", boardData);
  
  res.json({ success: true, message: `Update broadcasted to board ${boardId}` });
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on("join-board", (boardId) => {
    console.log(`Client ${socket.id} joined board ${boardId}`);
    socket.join(boardId);
  });

  socket.on("leave-board", (boardId) => {
    console.log(`Client ${socket.id} left board ${boardId}`);
    socket.leave(boardId);
  });
  
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Socket server running on port ${port}`);
});
