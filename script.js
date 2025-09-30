const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupMsg = document.getElementById("popup-msg");
const playAgainBtn = document.getElementById("play-again");
const timerEl = document.getElementById("timer");
const bestEl = document.getElementById("best-score");

let rows = 15, cols = 15;
let cellSize = 25;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let maze = [];
let player = { x: 0, y: 0 };
let exit = { x: cols - 1, y: rows - 1 };
let timer = 60;
let interval;
let bestScore = localStorage.getItem("dobbyBest") || null;

// Load images
const dobbyImg = new Image();
dobbyImg.src = "assets/dobby.png";

const exitImg = new Image();
exitImg.src = "assets/exit.png";   // Your exit PNG

// Maze generator (DFS)
function generateMaze() {
  maze = Array(rows).fill(null).map(() => Array(cols).fill(1));
  let stack = [];
  let start = { x: 0, y: 0 };
  maze[start.y][start.x] = 0;
  stack.push(start);

  while (stack.length > 0) {
    let current = stack[stack.length - 1];
    let neighbors = [];

    [[0,-2],[0,2],[-2,0],[2,0]].forEach(([dx,dy])=>{
      let nx = current.x + dx, ny = current.y + dy;
      if(nx>=0 && ny>=0 && nx<cols && ny<rows && maze[ny][nx]===1){
        neighbors.push({x:nx,y:ny});
      }
    });

    if (neighbors.length) {
      let next = neighbors[Math.floor(Math.random()*neighbors.length)];
      let mx = (current.x + next.x)/2;
      let my = (current.y + next.y)/2;
      maze[next.y][next.x] = 0;
      maze[my][mx] = 0;
      stack.push(next);
    } else {
      stack.pop();
    }
  }
}

// Draw maze + player + exit
function draw() {
  ctx.fillStyle = "#2d0a4e";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      if(maze[y][x]===1){
        ctx.fillStyle = "#3b0764";
        ctx.fillRect(x*cellSize,y*cellSize,cellSize,cellSize);
      }
    }
  }

  // Draw exit
  ctx.drawImage(exitImg, exit.x * cellSize, exit.y * cellSize, cellSize, cellSize);

  // Draw player (Dobby)
  ctx.drawImage(dobbyImg, player.x * cellSize, player.y * cellSize, cellSize, cellSize);
}

// Movement
function move(dx,dy){
  let nx = player.x + dx;
  let ny = player.y + dy;
  if(nx>=0 && ny>=0 && nx<cols && ny<rows && maze[ny][nx]===0){
    player.x = nx;
    player.y = ny;
    checkWin();
  }
  draw();
}

function checkWin(){
  if(player.x === exit.x && player.y === exit.y){
    clearInterval(interval);
    let timeUsed = 60 - timer;
    if(!bestScore || timeUsed < bestScore){
      bestScore = timeUsed;
      localStorage.setItem("dobbyBest", bestScore);
    }
    showPopup("Your Dobby Won!", `Time used: ${timeUsed}s`);
  }
}

// Timer
function startTimer(){
  timer = 60;
  timerEl.textContent = "Time: 60";
  interval = setInterval(()=>{
    timer--;
    timerEl.textContent = "Time: " + timer;
    if(timer<=0){
      clearInterval(interval);
      showPopup("Time Up!", "Play Again?");
    }
  },1000);
}

// Popup
function showPopup(title,msg){
  popupTitle.textContent = title;
  popupMsg.textContent = msg;
  popup.classList.remove("hidden");
  if(bestScore){
    bestEl.textContent = "Best: " + bestScore + "s";
  }
}

// New Game
function newGame(){
  popup.classList.add("hidden");
  player = {x:0,y:0};
  generateMaze();
  draw();
  startTimer();
  if(bestScore){
    bestEl.textContent = "Best: " + bestScore + "s";
  }
}

// Controls
document.addEventListener("keydown", e=>{
  if(e.key==="ArrowUp") move(0,-1);
  if(e.key==="ArrowDown") move(0,1);
  if(e.key==="ArrowLeft") move(-1,0);
  if(e.key==="ArrowRight") move(1,0);
});

document.getElementById("up").onclick = ()=>move(0,-1);
document.getElementById("down").onclick = ()=>move(0,1);
document.getElementById("left").onclick = ()=>move(-1,0);
document.getElementById("right").onclick = ()=>move(1,0);

playAgainBtn.onclick = newGame;

// Start
newGame();
