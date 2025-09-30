const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const rows = 10;
const cols = 10;
const cellSize = canvas.width / cols;

let maze = [];
let player = { x: 0, y: 0 };
let goal = { x: cols - 1, y: rows - 1 };
let timer = 60;
let timerInterval;
let bestScore = localStorage.getItem("bestTime") || null;

// Maze cell structure
function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.walls = { top: true, right: true, bottom: true, left: true };
  this.visited = false;
}

function generateMaze() {
  maze = [];
  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
      row.push(new Cell(x, y));
    }
    maze.push(row);
  }

  let stack = [];
  let current = maze[0][0];
  current.visited = true;

  while (true) {
    let next = getUnvisitedNeighbor(current);
    if (next) {
      stack.push(current);
      removeWalls(current, next);
      current = next;
      current.visited = true;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else break;
  }
}

function getUnvisitedNeighbor(cell) {
  let neighbors = [];
  let { x, y } = cell;
  if (y > 0 && !maze[y - 1][x].visited) neighbors.push(maze[y - 1][x]);
  if (x < cols - 1 && !maze[y][x + 1].visited) neighbors.push(maze[y][x + 1]);
  if (y < rows - 1 && !maze[y + 1][x].visited) neighbors.push(maze[y + 1][x]);
  if (x > 0 && !maze[y][x - 1].visited) neighbors.push(maze[y][x - 1]);
  return neighbors.length ? neighbors[Math.floor(Math.random() * neighbors.length)] : null;
}

function removeWalls(a, b) {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  if (dx === 1) { a.walls.right = false; b.walls.left = false; }
  if (dx === -1) { a.walls.left = false; b.walls.right = false; }
  if (dy === 1) { a.walls.bottom = false; b.walls.top = false; }
  if (dy === -1) { a.walls.top = false; b.walls.bottom = false; }
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = maze[y][x];
      let px = x * cellSize;
      let py = y * cellSize;

      if (cell.walls.top) { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + cellSize, py); ctx.stroke(); }
      if (cell.walls.right) { ctx.beginPath(); ctx.moveTo(px + cellSize, py); ctx.lineTo(px + cellSize, py + cellSize); ctx.stroke(); }
      if (cell.walls.bottom) { ctx.beginPath(); ctx.moveTo(px, py + cellSize); ctx.lineTo(px + cellSize, py + cellSize); ctx.stroke(); }
      if (cell.walls.left) { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + cellSize); ctx.stroke(); }
    }
  }

  // Draw player (Dobby)
  let img = new Image();
  img.src = "assets/dobby.png";
  ctx.drawImage(img, player.x * cellSize + 5, player.y * cellSize + 5, cellSize - 10, cellSize - 10);

  // Draw goal
  ctx.fillStyle = "yellow";
  ctx.fillRect(goal.x * cellSize + 10, goal.y * cellSize + 10, cellSize - 20, cellSize - 20);
}

function move(direction) {
  let current = maze[player.y][player.x];
  if (direction === "up" && !current.walls.top) player.y--;
  if (direction === "down" && !current.walls.bottom) player.y++;
  if (direction === "left" && !current.walls.left) player.x--;
  if (direction === "right" && !current.walls.right) player.x++;
  checkWin();
  drawMaze();
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") move("up");
  if (e.key === "ArrowDown") move("down");
  if (e.key === "ArrowLeft") move("left");
  if (e.key === "ArrowRight") move("right");
});

function checkWin() {
  if (player.x === goal.x && player.y === goal.y) {
    clearInterval(timerInterval);
    let timeUsed = 60 - timer;
    if (!bestScore || timeUsed < bestScore) {
      bestScore = timeUsed;
      localStorage.setItem("bestTime", bestScore);
    }
    showPopup("Your Dobby Won 🎉");
  }
}

function startTimer() {
  timer = 60;
  document.getElementById("timer").innerText = "Time: " + timer;
  timerInterval = setInterval(() => {
    timer--;
    document.getElementById("timer").innerText = "Time: " + timer;
    if (timer <= 0) {
      clearInterval(timerInterval);
      showPopup("⏳ Time's Up! Play Again?");
    }
  }, 1000);
}

function showPopup(msg) {
  document.getElementById("popupText").innerText = msg;
  document.getElementById("popup").style.display = "block";
  if (bestScore) {
    document.getElementById("best").innerText = "Best: " + bestScore + "s";
  }
}

function restartGame() {
  document.getElementById("popup").style.display = "none";
  generateMaze();
  player = { x: 0, y: 0 };
  drawMaze();
  startTimer();
}

function init() {
  if (bestScore) document.getElementById("best").innerText = "Best: " + bestScore + "s";
  generateMaze();
  drawMaze();
  startTimer();
}

init();
