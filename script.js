const canvas = document.getElementById('mazeCanvas');
function startTimer(){
clearInterval(timerInterval);
timer = 60;
timerValueEl.textContent = timer;
updateTimeBar();
startTime = performance.now();
timerInterval = setInterval(()=>{
timer -= 1;
timerValueEl.textContent = timer;
updateTimeBar();
if(timer <= 0){
clearInterval(timerInterval);
onLose();
}
},1000);
}


function updateTimeBar(){
const pct = Math.max(0, timer / 60);
timeBarEl.style.width = (pct*100) + '%';
}


function onWin(){
clearInterval(timerInterval);
const used = Math.max(1, 60 - timer);
if(!bestTime || used < bestTime){ bestTime = used; localStorage.setItem('sentient_best', bestTime); bestValueEl.textContent = bestTime + 's'; }
popupTitle.textContent = 'Your Dobby Won 🎉';
popupSub.textContent = 'Great job — Dobby escaped the maze.';
popupTime.textContent = used;
popupBest.textContent = bestTime ? bestTime + 's' : '--';
showPopup();
}


function onLose(){
popupTitle.textContent = 'Time\'s Up ⏳';
popupSub.textContent = 'Dobby couldn\'t finish in time.';
popupTime.textContent = '--';
popupBest.textContent = bestTime ? bestTime + 's' : '--';
showPopup();
}


function checkWin(){
if(player.x === goal.x && player.y === goal.y){ onWin(); }
}


function showPopup(){
popup.classList.remove('hidden');
}
function hidePopup(){ popup.classList.add('hidden'); }


playAgainBtn.addEventListener('click', ()=>{ hidePopup(); restart(); });
closeBtn.addEventListener('click', ()=>{ hidePopup(); });


// New game / restart
newGameBtn.addEventListener('click', restart);
function restart(){
initMaze();
resizeCanvas();
draw();
startTimer();
}


difficultySelect.addEventListener('change', ()=>{ restart(); });


// animation loop
function loop(){ draw(); requestAnimationFrame(loop); }


// init on load
window.addEventListener('load', ()=>{
initMaze();
resizeCanvas();
startTimer();
loop();
});
window.addEventListener('resize', ()=>{ resizeCanvas(); });


// expose a convenience function for mobile inline onclick (if used)
window.move = step;
