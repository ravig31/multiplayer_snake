const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { createGameState, gameUpdate }  = require('./game');
const { FRAME_RATE } = require('./constants')

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", client => {
  const state = createGameState();

  startGameInterval(client, state);
});

function startGameInterval(client, state) {
  const intervalID = setInterval(() => {
    const winner = gameUpdate(state);

    if (!winner) {
      client.emit('gameState', JSON.stringify(state));
    } else {
      client.emit('gameOver');
      clearInterval(intervalID)
    }
  }, 1000 / FRAME_RATE);
}

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});

