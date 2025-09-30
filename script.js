// Professional maze game script
function tryMove(dir){
const c = maze[player.y][player.x];
if (dir==='up' && !c.walls.top) player.y--;
if (dir==='down' && !c.walls.bottom) player.y++;
if (dir==='left' && !c.walls.left) player.x--;
if (dir==='right' && !c.walls.right) player.x++;
checkWin();
}


// Input
document.addEventListener('keydown', (e)=>{
if (e.key.startsWith('Arrow')){
e.preventDefault();
if (e.key==='ArrowUp') tryMove('up');
if (e.key==='ArrowDown') tryMove('down');
if (e.key==='ArrowLeft') tryMove('left');
if (e.key==='ArrowRight') tryMove('right');
}
});


// mobile buttons
document.querySelectorAll('.arrow').forEach(b=>b.addEventListener('click',()=>{ tryMove(b.dataset.dir); }));


// Timer and UI
const timerEl = document.getElementById('timer');
const progressEl = document.getElementById('timeProgress');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalSub = document.getElementById('modalSub');


function startTimer(){ clearInterval(timerId); remaining = baseTime; updateTimerDisplay(); timerId = setInterval(()=>{ remaining--; updateTimerDisplay(); if (remaining<=0){ clearInterval(timerId); onLose(); } },1000); }
function updateTimerDisplay(){ timerEl.textContent = remaining + 's'; const pct = Math.max(0, remaining/baseTime); progressEl.style.transform = `scaleX(${pct})`; }


function onWin(){ clearInterval(timerId); modalTitle.textContent = 'Your Dobby Won 🎉'; modalSub.textContent = `You escaped in ${baseTime - remaining}s`;
// save best
const timeUsed = baseTime - remaining;
if (!best || timeUsed < best){ best = timeUsed; localStorage.setItem('sdm_best', best); bestEl.textContent = best + 's'; }
showModal(true);
}
function onLose(){ modalTitle.textContent = 'Time's Up ⏳'; modalSub.textContent = 'Your Dobby couldn\'t escape. Try again!'; showModal(false); }


function checkWin(){ if (player.x===goal.x && player.y===goal.y){ onWin(); } }


// Modal controls
function showModal(win){ modal.setAttribute('aria-hidden','false'); }
function hideModal(){ modal.setAttribute('aria-hidden','true'); }


document.getElementById('playAgain').addEventListener('click', ()=>{ hideModal(); newGame(); });
document.getElementById('closeModal').addEventListener('click', hideModal);


// New game & difficulty
function newGame(){
gridSize = parseInt(document.getElementById('difficulty').value, 10) || 12;
initMaze(gridSize);
startTimer();
draw();
}


document.getElementById('newBtn').addEventListener('click', newGame);


// start
initMaze(gridSize);
startTimer();


// main loop to smooth render
(function loop(){ draw(); requestAnimationFrame(loop); })();


// expose some helpers for debugging
window.sdm = { newGame, initMaze, maze };
