const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

// Import game logic and constants
const { gameUpdate, initGame, randCoords }  = require('./game');
const { FRAME_RATE } = require('./constants');
const { makeid } = require('./id');

// // Create HTTP server and Socket.io server
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "https://multiplayer-snake-ravig31.netlify.app",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Access-Control-Allow-Origin: *"],
//     credentials: true
//   }
// });

// Create HTTP server and Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
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
        score: 0,
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

    let numClients
    if (room) {
      numClients = room.size;
    } else {
      numClients = 0;
    }

    if (numClients === 0) {
      client.emit('unknownGame');
      return;
    } else if (numClients > 1) {
      client.emit('playersMaxed');
      return;
    }

    clientRooms[client.id] = roomName;

    client.join(roomName);
    client.number = 2;
    client.emit('gameInit', 2);

    initSnake(roomName)
    console.log(io.sockets.adapter.rooms)
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
        io.in(roomName).socketsLeave(roomName);
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
  let oppositeDir = {'up': 'down', 'down' : 'up', 'left' : 'right',  'right' : 'left'}
  client.on('changeDirection', newDirection => {
    // Update game state with new direction for the player's snake
    const roomName = clientRooms[client.id];
    if (!roomName){
      return;
    }
    
    if (globalState[roomName]){
      globalState[roomName].players.forEach(player => {
      if (player.id === client.id) {
        if (newDirection != oppositeDir[player.direction]){
          player.direction = newDirection
        }
      }
      })
    }
  });
  });
  
server.listen(3001, () => {
  process.env.PORT || 3000
  console.log("SERVER IS RUNNING");
});