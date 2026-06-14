import { Player } from "./Player.js";
import { Food } from "./Food.js";
import { bg, bgm, eatSound, gameOverSound } from "./assets.js";

export { bgm, gameOverSound };

// ===== GLOBALS =====
export let highScore = localStorage.getItem("highScore") || 0;
export let sudahPernahBantuan = false;

export function setSudahPernahBantuan(val) {
  sudahPernahBantuan = val;
}

// ===== GAME CLASS =====
export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.player = new Player(canvas);
    this.foods = [];
    this.score = 0;
    this.lives = 3;
    this.speed = 2;
    this.keys = {};
    this.running = false;
  }

  start() {
    this.foods = [];
    this.score = 0;
    this.lives = 3;
    this.speed = 2;
    this.running = true;
    this.loop();
  }

  spawnFood() {
    if (this.foods.length < 5 && Math.random() < 0.01) {
      this.foods.push(new Food(this.canvas, this.speed));
    }
  }

  update() {
    this.player.update(this.keys);

    // Iterasi dari belakang agar splice tidak menggeser index
    for (let i = this.foods.length - 1; i >= 0; i--) {
      const f = this.foods[i];
      f.update();

      // COLLISION
      const hit =
        f.x < this.player.x + this.player.width &&
        f.x + f.size > this.player.x &&
        f.y < this.player.y + this.player.height &&
        f.y + f.size > this.player.y;

      if (hit) {
        this.player.eat();
        eatSound.currentTime = 0;
        eatSound.play();
        this.foods.splice(i, 1); // selalu hapus dulu baru cek tipe

        if (f.type === "bomb") {
          this.end();
          return; // stop update, game sudah selesai
        } else {
          this.score += (f.type === "special" ? 30 : 10);
        }
        continue;
      }

      // Keluar layar
      if (f.y > this.canvas.height) {
        if (f.type !== "bomb") this.lives--;
        this.foods.splice(i, 1);
      }
    }

    this.speed += 0.0008;

    if (this.lives <= 0) {
      this.end();
    }
  }

draw() {
  // ✅ UBAH INI
  const isDark = document.body.classList.contains("dark-mode");

  this.ctx.drawImage(bg, 0, 0, this.canvas.width, this.canvas.height);

  if (isDark) {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  this.player.draw();
  this.foods.forEach(f => f.draw());

  // ✅ UBAH BARIS INI
  this.ctx.fillStyle = isDark ? "#ffe066" : "red";
  this.ctx.font = "bold 24px Arial";
  this.ctx.fillText("Score: " + this.score, 20, 40);
  this.ctx.fillText("Lives: " + this.lives, 20, 75);
}

  loop() {
    if (!this.running) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.spawnFood();
    this.update();
    this.draw();

    requestAnimationFrame(() => this.loop());
  }

end() {
  this.running = false;
  bgm.pause();

  gameOverSound.currentTime = 0;
  gameOverSound.play();

  // ✅ TAMBAH INI — sembunyikan canvas agar overlay bisa diklik
  this.canvas.style.display = "none";

  if (!sudahPernahBantuan) {
    document.getElementById("quizOverlay").style.display = "flex";
    document.getElementById("reviveBox").style.display = "block";
    document.getElementById("soalBox").style.display = "none";
  } else {
    this.showFinalGameOver();
  }
}

  showFinalGameOver() {
    document.getElementById("quizOverlay").style.display = "none";
    this.canvas.style.display = "none";
    document.getElementById("gameOver").style.display = "flex";

    document.getElementById("finalScore").innerText = this.score;

    if (this.score > highScore) {
      highScore = this.score;
      localStorage.setItem("highScore", highScore);
    }

    document.getElementById("highScore").innerText = highScore;
  }
}