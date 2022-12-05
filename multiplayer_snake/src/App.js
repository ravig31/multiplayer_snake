import React, {Component} from 'react';
import "./index.css"
import Snake from './Snake';
import Food from './Food';
import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001");

// socket.on('init', handleINIT)
// socket.on('gamestate', handleGameState)


class App extends Component {

  render() {
    return (
      <div className='game-area'>
      </div>
    )
  }
}

// function handleINIT(msg) {
//   console.log(msg)
// }

// function handleGameState(gameState) {
//   gameState = JSON.parse(gameState);
//   requestAnimationFrame(() => render());
// }


export default App;
// 33:01 //4:52