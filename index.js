const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

server.listen(3000, () => {
  console.log("server running...");
});

io.on("connection", (socket) => {
  console.log("user connected ", socket.id);

  socket.on("pickup_status", (data) => {
    console.log(data);
    socket.broadcast.emit("pickup_status", data);
  });

  socket.on("model_status", (data) => {
    socket.broadcast.emit("model_status", data);
  });
});
