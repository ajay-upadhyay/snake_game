const playBoard = document.querySelector(".play-board");
const scoreelem = document.querySelector(".score");
const highscoreelem = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let velocityX = 0,
  velocityY = 0;
let GameOver = false;
let snakebody = [];
let setIntervalId;
let score = 0;
// getting high score from the local storage
let highscore = localStorage.getItem("high-score") || 0;
highscoreelem.innerText = `High Score: ${highscore}`;

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = (e) => {
  clearInterval(setIntervalId);
  alert("Game Over! Press OK to replay...");
  location.reload();
};

const changeDirection = (e) => {
  // changing velocity value based on key press
  if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  }
};
controls.forEach((key) => {
  // calling changedirection on each key click and passing key dataset value as an object
  key.addEventListener("click", () =>
    changeDirection({ key: key.dataset.key })
  );
});

const initGame = () => {
  if (GameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area:${foodY}/${foodX}"></div>`;
  // checking if the snake hit the food
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakebody.push([foodX, foodY]); // pushing food position to snake body array
    score++; //increment score by 1

    highscore = score >= highscore ? score : highscore;
    localStorage.setItem("high-score", highscore);

    scoreelem.innerText = `score: ${score}`;
    highscoreelem.innerText = `High Score: ${highscore}`;
  }

  for (let i = snakebody.length - 1; i > 0; i--) {
    // shifting forward the values of the elements in the snake body by one
    snakebody[i] = snakebody[i - 1];
  }

  snakebody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

  // updating the snake's head position based on the current velocity
  snakeX += velocityX;
  snakeY += velocityY;

  //checking if the snake's head is out of wall, if so setting.gameOver to true
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    GameOver = true;
  }

  for (let i = 0; i < snakebody.length; i++) {
    // adding a div for each part of the snake's body
    htmlMarkup += `<div class="head" style="grid-area:${snakebody[i][1]}/${snakebody[i][0]}"></div>`;

    //checking if the snake head hit the body, if so set Gameover ot true
    if (
      i !== 0 &&
      snakebody[0][1] === snakebody[i][1] &&
      snakebody[0][0] === snakebody[i][0]
    ) {
      GameOver = true;
    }
  }
  playBoard.innerHTML = htmlMarkup;
};
changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
