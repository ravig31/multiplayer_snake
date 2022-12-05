const { GRID_SZIE } = require('./constants')

module.exports = {
    initGame,
    gameUpdate,
    createGameState,
}

function initGame(){
    const state = createGameState()
    return state
}

function randFoodCoords() {
    let min = 1, max = 98;
    let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2
    let y = Math.floor((Math.random()*(max-min+1)+min)/2)*2
    return [x, y]
  }
  

function createGameState() {
    return{
      player: {
        speed: 200,
        direction: 'RIGHT',
        snakeDots: [
          [0,0],
          [2,0]
        ]
      },
      food: randFoodCoords(),
      gridsize: GRID_SZIE,
      active: true,
  }
}

function gameUpdate(state) {
    if (!state) {
      return;
    }

    const playerOne = state.player;

    checkIfExitBorder(playerOne)
    checkIfEat(playerOne, state)
    checkIfCollapsed(playerOne)
    moveSnake(playerOne)

    return false
}

function moveSnake(player){
  let dots = [...player.snakeDots];
  let head = dots[dots.length - 1]

  switch (player.direction) {
    case "right":
      head = [head[0] - 2, head[1]];
      break;

    case "left":
      head = [head[0] + 2, head[1]];
      break;

    case "down":
      head = [head[0], head[1] + 2];
      break;

    case "up":
      head = [head[0], head[1] - 2];
      break;
  }
  dots.push(head);
  dots.shift();
  player.snakeDots = dots
}

function checkIfExitBorder(player) {
  let head = player.snakeDots[player.snakeDots.length - 1];
  if (head[0] >= GRID_SZIE || head[1] >= GRID_SZIE || head[0] < 0 || head[1] < 0){
      // return player number
    } 
  }

function checkIfEat(player, state) {
    let head = player.snakeDots[player.snakeDots.length - 1];
    let food = state.food;
    if (head[0] == food[0] && head[1] == food[1]) {
      player.food = randFoodCoords()   // randomfood()

      // growsnake
      let newSnake = [...player.snakeDots];
      newSnake.unshift([]);
      player.snakeDots = newSnake;

      //increase speed
      if (player.speed > 10) {
        player.speed -= 10
      }
    }
}

function checkIfCollapsed(player) {
  let snake = [...player.snakeDots];
  let head = snake[snake.length - 1];
  snake.pop();
  snake.forEach(dot => {
    if (head[0] == dot[0] && head[1] == dot[1]) {
      //return player number
    }
  })
}




  
// componentDidMount() {
//   setInterval(this.moveSnake, this.state.speed);
//   document.onkeydown = this.onKeyDown;
// }


// componentDidUpdate() {
//   this.checkIfExitBorder();
//   this.checkIfEat();
//   this.checkIfCollapsed();
// }

// onKeyDown = (e) => {
//   e = e || window.event;
//   switch (e.key){
//     case "w":
//       this.setState({direction: "up"});
//       break;
//     case "s":
//       this.setState({direction: "down"});
//       break;
//     case "d":
//       this.setState({direction: "left"});
//       break;
//     case "a":
//       this.setState({direction: "right"});
//       break;
//   }
// }





