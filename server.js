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

// boardId -> Map<userName, user>
const boardUsers = new Map();
// socketId -> { boardId, user }
const socketMeta = new Map();

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join-board", (data) => {
    const boardId = typeof data === "string" ? data : data?.boardId;
    const user = typeof data === "object" ? data?.user : null;
    if (!boardId) return;

    socket.join(boardId);

    if (user) {
      if (!boardUsers.has(boardId)) boardUsers.set(boardId, new Map());
      boardUsers.get(boardId).set(user.name, { ...user, socketId: socket.id });
      socketMeta.set(socket.id, { boardId, user });
      const users = Array.from(boardUsers.get(boardId).values());
      io.to(boardId).emit("users-update", users);
      socket.to(boardId).emit("user-joined", user);
    }

    console.log(`Client ${socket.id} (${user?.name ?? "unknown"}) joined board ${boardId}`);
  });

  socket.on("leave-board", (data) => {
    const boardId = typeof data === "string" ? data : data?.boardId;
    const user = typeof data === "object" ? data?.user : null;
    if (!boardId) return;

    socket.leave(boardId);

    if (user && boardUsers.has(boardId)) {
      boardUsers.get(boardId).delete(user.name);
      socketMeta.delete(socket.id);
      const users = Array.from(boardUsers.get(boardId).values());
      io.to(boardId).emit("users-update", users);
      socket.to(boardId).emit("user-left", user);
    }

    console.log(`Client ${socket.id} (${user?.name ?? "unknown"}) left board ${boardId}`);
  });

  socket.on("get-board-users", (boardId) => {
    const users = boardUsers.has(boardId)
      ? Array.from(boardUsers.get(boardId).values())
      : [];
    socket.emit("users-update", users);
  });

  socket.on("disconnect", () => {
    const meta = socketMeta.get(socket.id);
    if (meta) {
      const { boardId, user } = meta;
      if (boardUsers.has(boardId)) {
        boardUsers.get(boardId).delete(user.name);
        const users = Array.from(boardUsers.get(boardId).values());
        io.to(boardId).emit("users-update", users);
        io.to(boardId).emit("user-left", user);
      }
      socketMeta.delete(socket.id);
    }
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Socket server running on port ${port}`);
});
