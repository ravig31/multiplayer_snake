import React, { useState, useEffect } from 'react';
import './index.css';
import Snake from './Snake';
import Food from './Food';
import io from 'socket.io-client';

const socket = io('http://localhost:3001/', {
  origin: 'http://localhost:3001/',
  credentials: true
});

function App() {
  const [initScreenDisplay, setinitScreenDisplay] = useState('flex');
  const [gameOverDisplay, setgameOverDisplay] = useState('none');
  const [gameAreaDisplay, setgameAreaDisplay] = useState('flex');
  const [currentState, setCurrentState] = useState();
  const [currentDirection, setCurrentDirection] = useState(null);
  const [gameCode, setGameCode] = useState('');
  const [gameCodeDisplay, setGameCodeDisplay] = useState('');

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
    setinitScreenDisplay('none') 
    gameActive = true;
  }


  function handleGameCode(gameCode){
    setGameCodeDisplay(gameCode);
  }


  function handleUnknownGame(){
    console.log('first')
    gameReset()
    alert("Unknown game code")
  }
  

  function handlePlayersMaxed(){
    gameReset()
    alert("This game is already in progress")
  }

  function handleInit(number) {
    playerNumber = number;
  }
  

  function gameReset(){
    playerNumber = null;
    setGameCode('')
    setGameCodeDisplay('')
    setinitScreenDisplay('flex')
    setCurrentState(null)

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

      setCurrentState(JSON.parse(state));

    });
  }, []);

  useEffect(() => {
    socket.emit('changeDirection', currentDirection);
  }, [currentDirection]);
   
  useEffect(() => {
    socket.on('gameOver', data => {

      data = JSON.parse(data);

      if (data.winner === playerNumber) {
        console.log('over')
        setgameOverDisplay("flex")
        setgameAreaDisplay("none")
        // alert('Winner, Winner, Chicken Dinner!');
      } else {
        console.log('over')
        setgameOverDisplay("flex")
        setgameAreaDisplay("none")
        // alert('Loser, You Suck!');
      }

    });
  }, []);

  return (
    <div>
      {currentState ? (
        <div id="game-area" style={{display: gameAreaDisplay}}>
          <Snake snakeDots={currentState.players[0].snakeDots} />
          <Snake snakeDots={currentState.players[1].snakeDots} />
          <Food dot={currentState.food} />
        </div>
      ) : (
        <div id="initial-screen" style={{display: initScreenDisplay}}>
          <div className="title" data-splitting="lines">
            2-PLAYER
            SNAKE
          </div>
          <h3 className="gamecode">
              CODE: <span id="gameCodeDisplay">{gameCodeDisplay}</span>
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
      <div className="game-over" style={{display: gameOverDisplay}}>
        <h1 className="game-over-heading">
          GAME <span className="over">OVER</span>
        </h1>
        {currentState ? (
        <div className="player-scores">
          <h3 className="score">P1: <span className="golden">{currentState.players[0].score}</span></h3>
          <h3 className="score">P2: <span className="golden">{currentState.players[1].score}</span></h3>
        </div>
          ) : null}
        <div className="main-menu-wrapper">
          <button className="main-menu-btn" onClick={gameReset}>MAIN MENU</button>
        </div>
      </div>
    </div>
);

}

export default App;