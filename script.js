const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const rows = 10;
const cols = 10;
const cellSize = 40;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

// Load images
const dobbyImg = new Image();
dobbyImg.src = "assets/dobby.png";

const exitImg = new Image();
exitImg.src = "assets/exit.png";

// Maze grid (0 = path, 1 = wall)
let maze = [];
let player = { x: 0, y: 0 };
let exit = { x: cols - 1, y: rows - 1 };

let timer = 60;
let bestScore = localStorage.getItem("bestScore") || "--";
document.getElementById("best").textContent = "Best: " + bestScore;

// Generate simple random maze
function generateMaze() {
  maze = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() > 0.7 ? 1 : 0))
  );
  maze[0][0] = 0;
  maze[rows - 1][cols - 1] = 0;
}

function draw() {
  ctx.fillStyle = "#2d0a4e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw maze walls
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = "#3b0764";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Draw exit (after image loads)
  if (exitImg.complete) {
    ctx.drawImage(exitImg, exit.x * cellSize, exit.y * cellSize, cellSize, cellSize);
  }

  // Draw Dobby (after image loads)
  if (dobbyImg.complete) {
    ctx.drawImage(dobbyImg, player.x * cellSize, player.y * cellSize, cellSize, cellSize);
  }
}

// Movement
function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (
    newX >= 0 && newX < cols &&
    newY >= 0 && newY < rows &&
    maze[newY][newX] === 0
  ) {
    player.x = newX;
    player.y = newY;
  }
  checkWin();
}

function checkWin() {
  if (player.x === exit.x && player.y === exit.y) {
    clearInterval(timerInterval);
    const timeTaken = 60 - timer;
    if (bestScore === "--" || timeTaken < bestScore) {
      bestScore = timeTaken;
      localStorage.setItem("bestScore", bestScore);
    }
    alert("🎉 Your Dobby Won!");
    resetGame();
  }
}

function resetGame() {
  generateMaze();
  player = { x: 0, y: 0 };
  exit = { x: cols - 1, y: rows - 1 };
  timer = 60;
  document.getElementById("best").textContent = "Best: " + bestScore;
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer(0, -1);
  if (e.key === "ArrowDown") movePlayer(0, 1);
  if (e.key === "ArrowLeft") movePlayer(-1, 0);
  if (e.key === "ArrowRight") movePlayer(1, 0);
});

// Mobile controls
document.getElementById("up").onclick = () => movePlayer(0, -1);
document.getElementById("down").onclick = () => movePlayer(0, 1);
document.getElementById("left").onclick = () => movePlayer(-1, 0);
document.getElementById("right").onclick = () => movePlayer(1, 0);

// Timer
let timerInterval = setInterval(() => {
  timer--;
  document.getElementById("timer").textContent = "Time: " + timer;
  if (timer <= 0) {
    clearInterval(timerInterval);
    alert("❌ Time's up! Play again?");
    resetGame();
  }
}, 1000);

// Game loop
function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

// Start
generateMaze();
gameLoop();
