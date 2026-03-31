const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* ===== BACKGROUND ===== */
const bg = new Image();
bg.src = "assets/bg.jpeg";

const bgm = new Audio("assets/sound/bgm.mp3");
bgm.loop = true;
bgm.volume = 0.3; 

const eatSound = new Audio("assets/sound/eat.mp3");
eatSound.volume = 0.5;

const gameOverSound = new Audio("assets/sound/gameover.mp3");
gameOverSound.volume = 0.6;

/* ===== PLAYER ===== */
const playerNormal = new Image();
playerNormal.src = "assets/player/normal.png";

const playerEat = new Image();
playerEat.src = "assets/player/eat.png";

/* ===== FOOD ===== */
const foodImages = [];
for (let i = 1; i <= 7; i++) {
  const img = new Image();
  img.src = `assets/food/${i}.png`;
  foodImages.push(img);
}

const bombImg = new Image();
bombImg.src = "assets/food/bomb.png";

const specialImg = new Image();
specialImg.src = "assets/food/special.png";

/* ===== PLAYER CLASS ===== */
class Player {
  constructor() {
    this.width = 200;
    this.height = 250;
    this.x = canvas.width / 2;
    this.y = canvas.height - 200;

    this.eatingTime = 0;
    this.frame = 0;
  }

  move(x) {
    this.x = x - this.width / 2;
  }

  update(keys) {
    if (keys["ArrowLeft"]) this.x -= 8;
    if (keys["ArrowRight"]) this.x += 8;

    this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));

    if (this.eatingTime > 0) {
      this.eatingTime--;
      this.frame++;
    }
  }

  eat() {
    this.eatingTime = 20;
    this.frame = 0;
  }

  draw() {
    let img;

    if (this.eatingTime > 0) {
      if (this.frame % 8 < 4) {
        img = playerEat;
      } else {
        img = playerNormal;
      }
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

    if (this.type === "normal") {
      this.img = foodImages[Math.floor(Math.random() * foodImages.length)];
    } else if (this.type === "special") {
      this.img = specialImg;
    } else {
      this.img = bombImg;
    }
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
    this.speed = 3;
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
  if (this.foods.length > 5) return;

  if (Math.random() < 0.01) {
    this.foods.push(new Food(this.speed));
  }
}

  update() {
    this.player.update(this.keys);

    this.foods.forEach((f, i) => {
      f.update();

      // collision
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
        } else if (f.type === "special") {
          this.score += 30;
        } else {
          this.score += 10;
        }

        this.foods.splice(i, 1);
      }

      // jatuh
      if (f.y > canvas.height) {
        if (f.type !== "bomb") this.lives--;
        this.foods.splice(i, 1);
      }
    });

    this.speed += 0.0008;

    if (this.lives <= 0) this.end();
  }

  draw() {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    this.player.draw();
    this.foods.forEach(f => f.draw());

    // UI
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
    // 🔊 SOUND GAME OVER
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
    gameOverSound.play();

    this.running = false;
    canvas.style.display = "none";
    document.getElementById("gameOver").style.display = "block";
    document.getElementById("finalScore").innerText = this.score;

    bgm.pause();
    gameOverSound.play();
  }
}

/* INIT */
const game = new Game();

/* CONTROL */
document.addEventListener("keydown", e => game.keys[e.key] = true);
document.addEventListener("keyup", e => game.keys[e.key] = false);

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  game.player.move(e.clientX - rect.left);
});

/* START */
function startGame() {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  game.start();
}

/* RESTART */
// reset sound game over
gameOverSound.pause();
gameOverSound.currentTime = 0;

function restartGame() {
  document.getElementById("gameOver").style.display = "none";
  startGame();
}

const soundBtn = document.getElementById("soundBtn");

let isPlaying = false;

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

document.addEventListener("click", () => {
  if (!isPlaying) {
    bgm.play();
    isPlaying = true;
  }
}, { once: true });