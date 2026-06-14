import { Game } from "./Game.js";
import { tanyaSoal, cekJawaban } from "./quiz.js";
import { initSoundButton, initThemeButton, startGame, restartGame, backToMenu } from "./ui.js";
import { setCharacter } from "./Player.js";

// ===== CANVAS SETUP =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===== INIT GAME =====
const game = new Game(canvas);

// ===== KEYBOARD (Arrow + WASD) =====
document.addEventListener("keydown", e => {
  game.keys[e.key] = true;
  if (e.key === "a" || e.key === "A") game.keys["ArrowLeft"]  = true;
  if (e.key === "d" || e.key === "D") game.keys["ArrowRight"] = true;
});

document.addEventListener("keyup", e => {
  game.keys[e.key] = false;
  if (e.key === "a" || e.key === "A") game.keys["ArrowLeft"]  = false;
  if (e.key === "d" || e.key === "D") game.keys["ArrowRight"] = false;
});

// ===== POINTER / MOUSE / TOUCH =====
function movePlayer(clientX) {
  const rect = canvas.getBoundingClientRect();
  game.player.move(clientX - rect.left);
}

window.addEventListener("mousemove",   e => movePlayer(e.clientX));
window.addEventListener("touchmove",   e => {
  e.preventDefault();
  movePlayer(e.touches[0].clientX);
}, { passive: false });
window.addEventListener("pointermove", e => movePlayer(e.clientX));

// ===== CHARACTER SELECT BUTTONS =====
document.querySelectorAll(".char-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".char-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    setCharacter(btn.dataset.char);
  });
});

// ===== UI INIT =====
initSoundButton();
initThemeButton();

// ===== GLOBAL BUTTON HANDLERS =====
window.startGame     = () => startGame(canvas, game);
window.restartGame   = () => restartGame(canvas, game);
window.backToMenu    = () => backToMenu(canvas);
window.tanyaSoal     = () => tanyaSoal();
window.cekJawaban    = () => cekJawaban(game);
window.finalGameOver = () => game.showFinalGameOver();
