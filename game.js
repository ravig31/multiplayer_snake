const { Socket } = require('socket.io')
const { GRID_SIZE } = require('./constants')

module.exports = {
    initGame,
    gameUpdate,
    createGameState,
    randCoords,
}

function initGame(){
    const state = createGameState();
    return state
}


function createGameState() {
    return{
      players: [],
      food: randCoords(),
      gridsize: GRID_SIZE,
      active: true,
  }
}
function randCoords() {
    let min = 1, max = 98;
    let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2
    let y = Math.floor((Math.random()*(max-min+1)+min)/2)*2
    return [x, y]
  }
  


function gameUpdate(state) {
    if (!state) {
      return;
    }
    
    const playerOne = state.players[0];
    const playerTwo = state.players[1];


    if (checkIfExitBorder(playerOne) || checkIfCollapsed(playerOne) || playerTwo.score == 20){
      return 2
    }

    if (checkIfExitBorder(playerTwo) || checkIfCollapsed(playerTwo) || playerOne.score == 20){
      return 1
    }
    
    if (checkIfCollision(playerTwo, playerOne)){
      return 2
    }

    if (checkIfCollision(playerOne, playerTwo)){
      return 1
    }



    checkIfCollision(playerOne, playerTwo)

    checkIfEat(playerOne, state)
    checkIfEat(playerTwo, state)

    moveSnake(playerOne)
    moveSnake(playerTwo)


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
  if (head[0] >= GRID_SIZE-2 || head[1] >= GRID_SIZE-2 || head[0] < 2 || head[1] < 2){
      return true
    } 
  }

function checkIfEat(player, state) {
    let head = player.snakeDots[player.snakeDots.length - 1];
    let food = state.food;
    if (head[0] == food[0] && head[1] == food[1]) {
      player.score += 1
      state.food = randCoords()   // randomfood()

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

function checkIfCollision(player1, player2){
  let snake1 = [...player1.snakeDots];
  let snake2 = [...player2.snakeDots];
  let head2 = snake2[snake2.length - 1];

  snake1.pop();
  for (let dot of snake1) {
    if ((head2[0] == dot[0] && head2[1] == dot[1])) {
      return true;
    }
  }
  
}

function checkIfCollapsed(player) {
  let snake = [...player.snakeDots];
  let head = snake[snake.length - 1];
  snake.pop();
  for (let dot of snake) {
    if ((head[0] == dot[0] && head[1] == dot[1]) && snake.length >= 3) {
      return true;
    }
  }
  return false;
}




  





