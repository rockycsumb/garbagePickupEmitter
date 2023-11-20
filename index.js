const dotenv = require('dotenv').config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, { cors: { origin: "*" } });


// Your AccountSID and Auth Token from console.twilio.com
const accountSid = process.env.TWILIOSID;
const authToken = process.env.TWILIOTOK;
const client = require("twilio")(accountSid, authToken);

function sendSMS(message) {
  client.messages
    .create({
      body: message,
      to: "+", // Text your number
      from: "+", // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
}


app.get("/", (req, res) => {
  res.send("Running Server");
});

server.listen(3000, () => {
  console.log("server running...");
});

let pickupCounter = 0;

io.on("connection", (socket) => {
  console.log("user connected ", socket.id);

  // socket.on("message", (data) => {
  //   console.log("from user ", data);
  //   socket.broadcast.emit("message", data);
  //   // socket.broadcast.emit("message", data);
  // });

  socket.on("pickup_status", (data) => {
    // console.log(data);
    socket.broadcast.emit("pickup_status", data);

    if(data === "picked_up"){
      pickupCounter++;
    }

    if (data === "picked_up" && pickupCounter === 1) {
      // sendSMS("Your garbage was picked up");
    }
  });

  socket.on("model_status", (data) => {
    socket.broadcast.emit("model_status", data);
  });
});
