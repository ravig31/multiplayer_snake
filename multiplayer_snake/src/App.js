import React, { useState, useEffect } from 'react';
import './index.css';
import Snake from './Snake';
import Food from './Food';
import io from 'socket.io-client';

const socket = io('https://multiplayer-snake.onrender.com', {
  origin: 'https://multiplayer-snake.onrender.com',
  credentials: true
});

// const socket = io('http://localhost:3001/', {
//   origin: 'http://localhost:3001/',
//   credentials: true
// });


function App() {
  const [initScreenDisplay, setinitScreenDisplay] = useState('flex');
  const [gameAreaDisplay, setgameAreaDisplay] = useState('flex');
  const [codeDisplay, setcodeDisplay] = useState('none');
  const [inputDisplay, setinputDisplay] = useState('none');
  const [currentState, setCurrentState] = useState();
  const [currentDirection, setCurrentDirection] = useState(null);
  const [gameCode, setGameCode] = useState('');
  const [gameCodeDisplay, setGameCodeDisplay] = useState('');
  const [gameOver, setGameOver] = useState(false)
  const [gameAreaBlur, setgameAreaBlur] = useState(false);
  const [incorrectCode, setIncorrectCode] = useState(false)
  const clipboard = require('./assets/clipboard-icon.png')



  socket.on('gameInit', handleInit);
  socket.on('unknownGame', handleUnknownGame)
  socket.on('playersMaxed', handlePlayersMaxed)
  socket.on('gameCode', handleGameCode)

  let playerNumber;
  let gameActive = false;

  function startNewGame(){
    socket.emit('newGame');
    setinitScreenDisplay('none')
    setinputDisplay('none')
    setcodeDisplay('flex')
    setgameAreaBlur(false)
  }

  function newCode(){
    socket.emit('newGame')
    setgameAreaBlur(false)
  }
  
  function EnterGame(){
    socket.emit('joinGame', gameCode);
    setgameAreaBlur(false)
    init()
  }

  function JoinGame(){
    setinitScreenDisplay('none')
    setinputDisplay('flex')

  }

  
  function init() {
    //initialise game board 
    setinitScreenDisplay('none')
    setGameOver(false)
    setgameAreaDisplay('flex')
    setgameAreaBlur(false)
    setinputDisplay('none')
    gameActive = true;
  }


  function handleGameCode(gameCode){
    setGameCodeDisplay(gameCode);
  }


  function handleUnknownGame(){
    setIncorrectCode(true)
  }
  

  function handlePlayersMaxed(){
    gameReset()
  }

  function handleInit(number) {
    playerNumber = number;
  }

  function gameReset(){
    playerNumber = null;
    setGameCode('')
    setGameCodeDisplay('')
    setinitScreenDisplay('flex')
    setgameAreaDisplay('flex')
    setcodeDisplay('none')
    setinputDisplay('none')
    setGameOver(false)
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
      setgameAreaDisplay('flex')
      setGameOver(true)

    });
  }, []);

  return (
    <div className='app-container'>
      <div className='new-game' style={{display: codeDisplay}}>
        <h3 className="gamecode">
            CODE: <span id="gameCodeDisplay">{gameCodeDisplay}</span>
        </h3>
        <button className='copy-button' onClick={() => {navigator.clipboard.writeText(gameCodeDisplay)}}>
          <img className='copy-button-img' src={clipboard} alt="Logo"/>
        </button>
        <button onClick={newCode} className="btn new-code">NEW CODE</button>
      </div>
      <div className='join-game' style={{display : inputDisplay}}>
        <input
              id="gameCodeInput"
              type="text"
              placeholder="Enter game code"
              value={gameCode}
              onChange={e => setGameCode(e.target.value)}
              className={`gamecode-input ${incorrectCode ? "shake" : ""} ${incorrectCode ? "red" : ""}`}
            />
          <button className='btn' onClick={EnterGame}>ENTER</button>
        </div>
        {currentState ? (
      <div className='game-container'>
        <div className='current-scores' style={{ display: gameAreaDisplay, filter: gameAreaBlur ? 'blur(4px)' : 'none' }}>
          <h2 className='current-score'>P1:{currentState.players[0].score}</h2>
          <h2 className='current-score'>P2:{currentState.players[1].score}</h2>
        </div>
        <div id="game-area" style={{ display: gameAreaDisplay, filter: gameAreaBlur ? 'blur(4px)' : 'none' }}>
          <Snake snakeDots={currentState.players[0].snakeDots} playerIndex={0} />
          <Snake snakeDots={currentState.players[1].snakeDots} playerIndex={1} />
          <Food dot={currentState.food} />
        {gameOver ? (
          <div className="game-over">
            <h1 className="game-over-heading">
              GAME <span className="over">OVER</span>
            </h1>
            <div className="player-scores">
              <h3 className="score">P1: <span className="golden">{currentState.players[0].score}</span></h3>
              <h3 className="score">P2: <span className="golden">{currentState.players[1].score}</span></h3>
            </div>
            <div className="main-menu-wrapper">
              <button className="main-menu-btn" onClick={gameReset}>MAIN MENU</button>
            </div>
          </div>
        ) : null}
        </div>
      </div>
    ) : (
      <div id="initial-screen" style={{ display: initScreenDisplay }}>
        <div className="title" data-splitting="lines">
          2-PLAYER
          SNAKE
        </div>
        <h2 className='game-desc'>first player to get 20 points wins!</h2>
        <button className='btn' onClick={startNewGame}>New Game</button>
        <button className='btn' onClick={JoinGame}>Join Game</button>
      </div>
    )}
  </div>
);
}

export default App;