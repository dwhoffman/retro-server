const { Server } = require("socket.io");
const http = require("http");

const port = process.env.PORT || 10000;
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join-board", (boardId) => {
    socket.join(boardId);
  });

  socket.on("leave-board", (boardId) => {
    socket.leave(boardId);
  });

  // You can add more event handlers here if needed
});

server.listen(port, () => {
  console.log(`Socket server running on port ${port}`);
});
