const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* ===== BACKGROUND & SOUND ===== */
const bg = new Image();
bg.src = "assets/bg.jpeg";

const bgm = new Audio("assets/sound/bgm.mp3");
bgm.loop = true;
bgm.volume = 0.3;

const eatSound = new Audio("assets/sound/eat.mp3");
const gameOverSound = new Audio("assets/sound/gameover.mp3");

/* ===== PLAYER IMAGES ===== */
const playerNormal = new Image();
playerNormal.src = "assets/player/normal m.png";

const playerWalk = new Image();
playerWalk.src = "assets/player/walk m.png";

const playerEat = new Image();
playerEat.src = "assets/player/eat m.png";

/* ===== FOOD & ITEMS ===== */
const foodImages = [];
for (let i = 1; i <= 10; i++) {
  const img = new Image();
  img.src = `assets/food/${i}.png`;
  foodImages.push(img);
}

const bombImg = new Image();
bombImg.src = "assets/food/bomb.png";

const specialImg = new Image();
specialImg.src = "assets/food/special.png";

/* ===== GLOBAL ===== */
let jawabanBenar = 0;
let sudahPernahBantuan = false;
let highScore = localStorage.getItem("highScore") || 0;
let isPlaying = false;
let isDarkMode = false;

/* ===== PLAYER CLASS ===== */
class Player {
  constructor() {
    this.width = 120;
    this.height = 130;
    this.x = canvas.width / 2;
    this.y = canvas.height - 180;
    this.eatingTime = 0;

    this.isMoving = false;
    this.walkFrame = 0;
  }

  move(x) {
    this.x = x - this.width / 2;
  }

  update(keys) {
    this.isMoving = false;

    if (keys["ArrowLeft"]) {
      this.x -= 8;
      this.isMoving = true;
    }

    if (keys["ArrowRight"]) {
      this.x += 8;
      this.isMoving = true;
    }

    this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));

    if (this.isMoving) {
      this.walkFrame++;
    }

    if (this.eatingTime > 0) {
      this.eatingTime--;
    }
  }

  eat() {
    this.eatingTime = 15;
  }

  draw() {
    let img;

    if (this.eatingTime > 0) {
      img = playerEat;
    } else if (this.isMoving) {
      img = (this.walkFrame % 20 < 10) ? playerWalk : playerNormal;
    } else {
      img = playerNormal;
    }

    ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }
}

/* ===== FOOD CLASS ===== */
class Food {
  constructor(speed) {
    this.size = 90;
    this.x = Math.random() * (canvas.width - this.size);
    this.y = -60;
    this.speed = speed;

    let r = Math.random();
    if (r < 0.7) this.type = "normal";
    else if (r < 0.9) this.type = "special";
    else this.type = "bomb";

    if (this.type === "normal")
      this.img = foodImages[Math.floor(Math.random() * foodImages.length)];
    else if (this.type === "special")
      this.img = specialImg;
    else
      this.img = bombImg;
  }

  update() {
    this.y += this.speed;
  }

  draw() {
    if (this.type === "special") {
      ctx.shadowColor = "gold";
      ctx.shadowBlur = 25;
    }

    ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
    ctx.shadowBlur = 0;
  }
}

/* ===== GAME CLASS ===== */
class Game {
  constructor() {
    this.player = new Player();
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
      this.foods.push(new Food(this.speed));
    }
  }

  update() {
    this.player.update(this.keys);

    this.foods.forEach((f, i) => {
      f.update();

      // COLLISION
      if (
        f.x < this.player.x + this.player.width &&
        f.x + f.size > this.player.x &&
        f.y < this.player.y + this.player.height &&
        f.y + f.size > this.player.y
      ) {
        this.player.eat();
        eatSound.currentTime = 0;
        eatSound.play();

        if (f.type === "bomb") {
          this.end();
        } else {
          this.score += (f.type === "special" ? 30 : 10);
          this.foods.splice(i, 1);
        }
      }

      if (f.y > canvas.height) {
        if (f.type !== "bomb") this.lives--;
        this.foods.splice(i, 1);
      }
    });

    this.speed += 0.0008;

    if (this.lives <= 0) {
      this.end();
    }
  }

  draw() {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    this.player.draw();

    this.foods.forEach(f => f.draw());

    ctx.fillStyle = "red";
    ctx.font = "bold 24px Arial";
    ctx.fillText("Score: " + this.score, 20, 40);
    ctx.fillText("Lives: " + this.lives, 20, 75);
  }

  loop() {
    if (!this.running) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    canvas.style.display = "none";
    document.getElementById("gameOver").style.display = "flex";

    document.getElementById("finalScore").innerText = this.score;

    if (this.score > highScore) {
      highScore = this.score;
      localStorage.setItem("highScore", highScore);
    }

    document.getElementById("highScore").innerText = highScore;
  }
}

/* ===== INIT ===== */
const game = new Game();

document.addEventListener("keydown", e => game.keys[e.key] = true);
document.addEventListener("keyup", e => game.keys[e.key] = false);

function movePlayer(clientX) {
  const rect = canvas.getBoundingClientRect();
  game.player.move(clientX - rect.left);
}

// MOUSE
canvas.addEventListener("mousemove", (e) => {
  movePlayer(e.clientX);
});

// TOUCH (HP & sebagian touchpad)
canvas.addEventListener("touchmove", (e) => {
  movePlayer(e.touches[0].clientX);
});

// POINTER (paling modern & stabil)
canvas.addEventListener("pointermove", (e) => {
  movePlayer(e.clientX);
});

/* ===== BUTTONS ===== */
function startGame() {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  bgm.play();
  game.start();
}

function restartGame() {
  sudahPernahBantuan = false;
  gameOverSound.pause();
  bgm.currentTime = 0;
  bgm.play();

  document.getElementById("gameOver").style.display = "none";
  startGame();
}

function backToMenu() {
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("quizOverlay").style.display = "none";
  document.getElementById("menu").style.display = "flex";
  canvas.style.display = "none";

  bgm.pause();
  bgm.currentTime = 0;

  sudahPernahBantuan = false;
  isPlaying = false;
}

/* ===== QUIZ ===== */
function tanyaSoal() {
  document.getElementById("reviveBox").style.display = "none";
  document.getElementById("soalBox").style.display = "block";

  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;

  jawabanBenar = a + b;
  document.getElementById("teksSoal").innerText = `Berapa ${a} + ${b}?`;
}

function cekJawaban() {
  let val = parseInt(document.getElementById("jawabanKamu").value);

  if (val === jawabanBenar) {
    alert("PINTER!");
    document.getElementById("quizOverlay").style.display = "none";
    hidupLagi();
  } else {
    alert("Salah!");
    game.showFinalGameOver();
  }

  document.getElementById("jawabanKamu").value = "";
}

function hidupLagi() {
  sudahPernahBantuan = true;
  game.lives = 1;
  game.foods = [];
  game.running = true;

  bgm.play();
  game.loop();
}

/* ===== SOUND BUTTON ===== */
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

/* ===== THEME BUTTON ===== */
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    themeBtn.textContent = "☀️";
  } else {
    themeBtn.textContent = "🌙";
  }
});