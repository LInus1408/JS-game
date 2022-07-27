const canvas = document.getElementById("game");
canvas.width = 900;
canvas.height = 594;
const ctx = canvas.getContext("2d");
const statistics = document.getElementById("statistics");
const btnStart = document.createElement("Button");
const btnGame = document.querySelectorAll(".btn");
const mainHTML = document.querySelector(".main");
const buttons = document.querySelector(".header-wrapper");
const ballLoader = document.querySelector(".loader");
const currentScore = document.querySelector(".currentScore");
const li = document.querySelectorAll("li");

const ball = {
  // ball
  x: canvas.width / 2,
  y: canvas.height - 30,
  dx: 2,
  dy: -2,
  ballRadius: 10,
};

const paddle = {
  // racket
  paddleHeight: 10,
  paddleWidth: 200,
  rightPressed: false,
  leftPressed: false,
};
let paddleX = (canvas.width - paddle.paddleWidth) / 2;

const bricks = {
  // bricks
  brickRowCount: 5,
  brickColumnCount: 10,
  brickWidth: 75,
  brickHeight: 20,
  brickPadding: 10,
  brickOffsetTop: 30,
  brickOffsetLeft: 30,
};
let gameStatus = false;
let score = 0;

currentScore.textContent = `Your Score: ${score}`;

const getCurrentScore = () => {
  currentScore.textContent = `Your Score: ${score}`;
};

let arrBricks = [];
for (let c = 0; c < bricks.brickColumnCount; c++) {
  arrBricks[c] = [];
  for (let r = 0; r < bricks.brickRowCount; r++) {
    arrBricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

let audioWall = new Audio();
audioWall.preload = "auto";
audioWall.src = "./assets/audio/wall.mp3";

let audioGameOver = new Audio();
audioGameOver.preload = "auto";
audioGameOver.src = "./assets/audio/game_over.mp3";

let audioBtn = new Audio();
audioBtn.preload = "auto";
audioBtn.src = "./assets/audio/btn-audio.mp3";

let audioStart = new Audio();
audioStart.preload = "auto";
audioStart.src = "./assets/audio/btn-start-audio.mp3";
audioStart.volume = 0.5;

let audioBrickKnock = new Audio();
audioBrickKnock.preload = "auto";
audioBrickKnock.src = "./assets/audio/brick.mp3";

let audioWinner = new Audio();
audioWinner.preload = "auto";
audioWinner.src = "./assets/audio/winner.mp3";

let bestScore = 0;
console.log(bestScore)
let arrScores = [];
arrScores[0] = 0;

function saveScores() {
  arrScores.unshift(score);
  if (arrScores > 10) {
    arrScores.length = 10;
  }
  if (score > bestScore) {
    bestScore = score;
  }
}

function getEndGame(flag) {
  // end of the game
  gameStatus = false;
  saveScores();
  setLocalStorage();
  let div = document.createElement("div");
  div.className = "alert";
  div.style.visibility = "visible";
  mainHTML.append(div);

  let title = document.createElement("h2");
  if (flag == false) {
    audioGameOver.play();
    title.textContent = "GAME OVER";
  } else {
    audioWinner.play();
    title.textContent = "YOU WINNER";
  }
  div.append(title);

  let scoreBest = document.createElement("p");
  scoreBest.textContent = `Best Score: ${bestScore}`;
  div.append(scoreBest);

  let scoreYou = document.createElement("p");
  scoreYou.textContent = `Your Score: ${score}`;
  div.append(scoreYou);

  let blockButtons = document.createElement("div");
  div.append(blockButtons);

  let btn1 = document.createElement("button");
  btn1.className = "btn";
  btn1.textContent = "Start over";
  btn1.style.margin = "auto";
  blockButtons.append(btn1);

  let btn2 = document.createElement("button");
  btn2.className = "btn";
  btn2.textContent = "The End";
  btn2.style.margin = "auto";
  blockButtons.append(btn2);

  mainHTML.classList.toggle("darken");

  blockButtons.addEventListener("click", (event) => {
    if (event.target.textContent == "Start over") {
      location.reload();
    }
    if (event.target.textContent == "The End") {
      window.close();
    }
  });

  blockButtons.addEventListener("mouseover", (event) => {
    if (event.target.classList.contains("btn")) {
      audioBtn.load();
      audioBtn.play();
    }
  });
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    paddle.rightPressed = true;
  } else if (e.keyCode == 37) {
    paddle.leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    paddle.rightPressed = false;
  } else if (e.keyCode == 37) {
    paddle.leftPressed = false;
  }
}
function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddle.paddleWidth / 2;
  }
}

function collisionDetection() {
  // balls knocks
  for (let c = 0; c < bricks.brickColumnCount; c++) {
    for (let r = 0; r < bricks.brickRowCount; r++) {
      let b = arrBricks[c][r];
      if (b.status == 1) {
        if (
          ball.x > b.x &&
          ball.x < b.x + bricks.brickWidth &&
          ball.y > b.y &&
          ball.y < b.y + bricks.brickHeight
        ) {
          ball.dy = -ball.dy;
          b.status = 0;
          score++;
          getCurrentScore();
          audioBrickKnock.load();
          audioBrickKnock.play();
          ballLoader.classList.add("loader-active");
          paddle.paddleWidth = paddle.paddleWidth - 2;
          if (score == bricks.brickRowCount * bricks.brickColumnCount) {
            getEndGame(true);
          }
        }
      }
    }
  }
}

function startGame() {
  // Start game
  btnStart.className = "btn-start";
  btnStart.textContent = "Start the game";
  mainHTML.append(btnStart);
  btnStart.addEventListener("click", () => {
    btnGame.forEach((item) => {
      item.classList.remove("btn-active");
    });
    audioStart.load();
    audioStart.play();
    btnStart.style.bottom = "auto";
    statistics.style.visibility = "hidden";
    btnStart.hidden = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameStatus = true;
  });
}
startGame();

function getGameBtn() {
  //game management
  buttons.addEventListener("mouseover", (event) => {
    if (event.target.classList.contains("btn")) {
      var playPromise = audioBtn.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            audioBtn.load();
            audioBtn.play();
          })
          .catch((error) => {
            console.log("error");
          });
      }
    }
  });

  const changeBtnStart = () => {
    // change btnStart
    if (btnStart.hidden == true) {
      btnStart.textContent = "Continue the game";
      btnStart.hidden = false;
      gameStatus = false;
    }
  };

  buttons.addEventListener("click", (event) => {
    if (event.target.textContent == "Pause") {
      btnGame[0].classList.add("btn-active");
      changeBtnStart();
    }
    if (event.target.textContent == "Table of records") {
      btnGame[1].classList.add("btn-active");
      changeBtnStart();
      btnStart.style.bottom = "220px";
      statistics.style.visibility = "visible";

      for (let i = 0; i < arrScores.length; i++) {
        li[i].textContent = `Game ${i + 1}: ${arrScores[i]}`;
      }
    }
  });
}
getGameBtn();

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(
    paddleX,
    canvas.height - paddle.paddleHeight,
    paddle.paddleWidth,
    paddle.paddleHeight
  );
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function checkWall() {
  if (ball.x + ball.dx > canvas.width - ball.ballRadius) {
    canvas.classList.add("game-wall-right");
  }
  if (ball.x + ball.dx < canvas.width - ball.ballRadius - 20) {
    canvas.classList.remove("game-wall-right");
  }
  if (ball.x + ball.dx < ball.ballRadius) {
    canvas.classList.add("game-wall-left");
  }
  if (ball.x + ball.dx > ball.ballRadius + 20) {
    canvas.classList.remove("game-wall-left");
  }
  if (ball.y + ball.dy < ball.ballRadius) {
    canvas.classList.add("game-wall-top");
  }
  if (ball.y + ball.dy > ball.ballRadius + 20) {
    canvas.classList.remove("game-wall-top");
  }
}

function checkBall() {}
function drawBricks() {
  for (let c = 0; c < bricks.brickColumnCount; c++) {
    for (let r = 0; r < bricks.brickRowCount; r++) {
      if (arrBricks[c][r].status == 1) {
        let brickX =
          c * (bricks.brickWidth + bricks.brickPadding) +
          bricks.brickOffsetLeft;
        let brickY =
          r * (bricks.brickHeight + bricks.brickPadding) +
          bricks.brickOffsetTop;
        arrBricks[c][r].x = brickX;
        arrBricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, bricks.brickWidth, bricks.brickHeight);
        ctx.fillStyle = "silver";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  if (gameStatus == true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    checkBall();
    drawBricks();
    drawBall();
    drawPaddle();
    checkWall();
    collisionDetection();
    if (
      ball.x + ball.dx > canvas.width - ball.ballRadius ||
      ball.x + ball.dx < ball.ballRadius
    ) {
      audioWall.load();
      audioWall.play();
      ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.ballRadius) {
      audioWall.load();
      audioWall.play();
      ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.ballRadius) {
      if (ball.x > paddleX && ball.x < paddleX + paddle.paddleWidth) {
        ball.dy = -ball.dy;
      } else {
        getEndGame(false);
      }
    }
    if (paddle.rightPressed && paddleX < canvas.width - paddle.paddleWidth) {
      paddleX += 7;
    } else if (paddle.leftPressed && paddleX > 0) {
      paddleX -= 7;
    }
    ball.x += ball.dx;
    ball.y += ball.dy;
  }
}

function setLocalStorage() {
  localStorage.setItem("getArrScores", arrScores);
  localStorage.setItem("getBestScore", bestScore);
}

function getLocalStorage() {
  if (localStorage.getArrScores) {
   arrScores = localStorage.getArrScores;
    arrScores = arrScores.split(",");
  }
  if (localStorage.getBestScore) {
    bestScore = localStorage.getBestScore;
   }
}

window.addEventListener("load", getLocalStorage);

let interval = setInterval(draw, 5);
setInterval(() => ballLoader.classList.remove("loader-active"), 1000);
