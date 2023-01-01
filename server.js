const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

// Import game logic and constants
const { gameUpdate, initGame, randCoords }  = require('./game');
const { FRAME_RATE } = require('./constants');
const { makeid } = require('./id');

// Create HTTP server and Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  origin: "https://multiplayer-snake-ravig31.netlify.app",
  methods: ["GET", "POST"],
  allowedHeaders: ["*"],
  credentials: true
});

const globalState = {};
const clientRooms = {};


// Listen for incoming connections from clients
io.on('connection', client => {
  client.on('message', message => {
    console.log(`Received message from server: ${message}`);
  });

  client.on('newGame', handleNewGame);
  client.on('joinGame', handleJoinGame);

  function handleNewGame() {
    let roomName = makeid(5);
    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName);
    
    globalState[roomName] = initGame();
    initSnake(roomName)
    client.join(roomName);
    client.number = 1;
    client.emit('gameInit', 1)
  }

  function initSnake(roomName) {
    globalState[roomName].players.push({
        id: client.id,
        speed: 200,
        direction: null,
        snakeDots: [
          [0,0],
          randCoords()
          
        ]
      })
    }

  function handleJoinGame(roomName) {
    const room = io.sockets.adapter.rooms.get(roomName);


    let numClients = room.size;

    if (numClients === 0) {
      client.emit('unknownCode');
      return;
    } else if (numClients > 1) {
      client.emit('tooManyPlayers');
      return;
    }

    clientRooms[client.id] = roomName;

    client.join(roomName);
    client.number = 2;
    client.emit('gameInit', 2);

    initSnake(roomName)
    console.log(globalState[roomName])
    console.log(io.sockets.adapter.rooms)

    io.to(roomName).emit('test', 'string')
    startGameInterval(roomName);
  }
  // Start game interval to update game state and send it to clients
  function startGameInterval(roomName) {
    const intervalID = setInterval(() => {
      const winner = gameUpdate(globalState[roomName]);

      if (!winner) {
        emitGameState(roomName, globalState[roomName]);
      } else {
        emitGameOver(roomName, winner);
        globalState[roomName] = null;
        clearInterval(intervalID)
      }
    }, 1000 / FRAME_RATE);
  }

  function emitGameState(room, state){
    io.to(room).emit('gameState', JSON.stringify(state));
  }

  function emitGameOver(room, winner){
    io.to(room).emit('gameOver', JSON.stringify({winner}));
  }

  // Listen for change direction events from client
  client.on('changeDirection', newDirection => {
    // Update game state with new direction for the player's snake
    const roomName = clientRooms[client.id];
    if (!roomName){
      return;
    }
    globalState[roomName].players.forEach(player => {
    if (player.id === client.id) {
      player.direction = newDirection
    }
    })
  });
  });

  
server.listen(3001, () => {
  process.env.PORT || 3000
  console.log("SERVER IS RUNNING");
});
