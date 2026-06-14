import { bgm, setSudahPernahBantuan } from "./Game.js";

let isPlaying = false;
let isDarkMode = false;

// ===== SOUND BUTTON =====
export function initSoundButton() {
  const soundBtn = document.getElementById("soundBtn");
  soundBtn.addEventListener("click", () => {
    if (!isPlaying) {
      bgm.play();
      soundBtn.textContent = "🔊";
      isPlaying = true;
    } else {
      bgm.pause();
      soundBtn.textContent = "🔇";
      isPlaying = false;
    }
  });
}

// ===== THEME BUTTON =====
export function initThemeButton() {
  const themeBtn = document.getElementById("themeBtn");
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;
    themeBtn.textContent = isDarkMode ? "☀️" : "🌙";
  });
}

// ===== MENU BUTTONS =====
export function startGame(canvas, game) {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";

  // Tandai game sedang aktif — CSS yang mengurus visibilitas joystick
  document.body.classList.add("game-active");

  if (document.body.classList.contains("dark-mode")) {
    canvas.classList.add("dark-mode");
  } else {
    canvas.classList.remove("dark-mode");
  }

  // Simpan referensi game untuk mobile joystick
  window.__game = game;

  bgm.play();
  game.start();
}

export function restartGame(canvas, game) {
  setSudahPernahBantuan(false);

  bgm.currentTime = 0;
  bgm.play();

  document.getElementById("gameOver").style.display = "none";
  startGame(canvas, game);
}

export function backToMenu(canvas) {
  document.getElementById("gameOver").style.display   = "none";
  document.getElementById("quizOverlay").style.display = "none";
  document.getElementById("menu").style.display        = "flex";
  document.body.classList.remove("game-active");
  canvas.style.display = "none";

  bgm.pause();
  bgm.currentTime = 0;

  setSudahPernahBantuan(false);
  isPlaying = false;

  // Refresh high score di menu setiap kembali
  const saved = parseInt(localStorage.getItem("highScore")) || 0;
  const el  = document.getElementById("menuHighScore");
  const msg = document.getElementById("menuHighScoreMsg");
  if (el) el.textContent = saved;
  if (msg) {
    if (saved === 0)       msg.textContent = "Belum ada rekor — jadilah yang pertama!";
    else if (saved < 50)   msg.textContent = "Kamu bisa lebih tinggi! 💪";
    else if (saved < 150)  msg.textContent = "Bagus! Coba kalahkan rekormu! 🔥";
    else                   msg.textContent = "Luar biasa! Pertahankan! 🏆";
  }
}
