import React, { useState, useEffect } from 'react';
import './index.css';
import Snake from './Snake';
import Food from './Food';
import io from 'socket.io-client';

const socket = io('https://multiplayer-snake.onrender.com', {
  withCredentials: true,
  transports: ['websocket', 'polling', 'flashsocket']
});



const initialScreen = document.getElementById('initial-screen')

function App() {
  const [currentState, setCurrentState] = useState();
  const [currentDirection, setCurrentDirection] = useState(null);
  const [gameCode, setGameCode] = useState('');
  const [gameCodeDisplay, setGameCodeDisplay] = useState('___')

  socket.on('gameInit', handleInit);
  socket.on('unknownGame', handleUnknownGame)
  socket.on('playersMaxed', handlePlayersMaxed)
  socket.on('gameCode', handleGameCode)

  let playerNumber;
  let gameActive = false;
  
  function startNewGame(){
    socket.emit('newGame');
  }
  
  function JoinGame(){
    socket.emit('joinGame', gameCode);
    init()
  }
  function init() {
    //initialise game board 
    initialScreen.style.display = "none";  
    gameActive = true;
  }


  function handleGameCode(gameCode){
    setGameCodeDisplay(gameCode);
  }


  function handleUnknownGame(){
    reset();
    alert("Unknown game code")
  }
  

  function handlePlayersMaxed(){
    reset();
    alert("This game is already in progress")
  }

  function handleInit(number) {
    playerNumber = number;
  }
  

  function reset(){
    playerNumber = null;
    // gameCodeInput.value = '';
    // gameCodeDisplay.innerText = '';

  }
  const handleKeyDown = e => {
    switch (e.key) {
      case "w":
        setCurrentDirection('up');
        break;
      case 's':
        setCurrentDirection('down');
        break;
      case 'd':
        setCurrentDirection('left');
        break;
      case 'a':
        setCurrentDirection('right');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    socket.on('gameState', state => {
      // if (!gameActive) {
      //   return;
      // }
      setCurrentState(JSON.parse(state));
    });
  }, []);

  

  useEffect(() => {
    socket.emit('changeDirection', currentDirection);
  }, [currentDirection]);
  useEffect(() => {
    socket.on('gameOver', data => {
      if (!gameActive) {
        return;
      }

      data = JSON.parse(data);
      if (data.winner === playerNumber) {
        alert('Winner, Winner, Chicken Dinner!');
      } else {
        alert('Loser, You Suck!');
      }

      gameActive = false;
    });
  }, []);

  return (
    <div>
      {currentState ? (
        <div id="game-area">
          <Snake snakeDots={currentState.players[0].snakeDots} />
          <Snake snakeDots={currentState.players[1].snakeDots} />
          <Food dot={currentState.food} />
        </div>
      ) : (
        <div id="initial-screen">
          <h3>
              your room id: <span id="gameCodeDisplay">{gameCodeDisplay}</span>
          </h3>
          <button onClick={startNewGame}>New Game</button>
          <input
            id="gameCodeInput"
            type="text"
            placeholder="Enter game code"
            value={gameCode}
            onChange={e => setGameCode(e.target.value)}
          />
          <button onClick={JoinGame}>Join Game</button>
        </div>
      )}
    </div>
  );
}

export default App;