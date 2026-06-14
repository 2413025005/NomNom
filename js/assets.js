// ===== BACKGROUND =====
export const bg = new Image();
bg.src = "assets/bg.jpeg";

// ===== AUDIO =====
export const bgm = new Audio("assets/sound/bgm.mp3");
bgm.loop = true;
bgm.volume = 0.3;

export const eatSound = new Audio("assets/sound/eat.mp3");
export const gameOverSound = new Audio("assets/sound/gameover.mp3");

// ===== CHARACTER DEFINITIONS =====
// Karakter KUNING (m = mellow/yellow)
export const playerNormal_yellow = new Image();
playerNormal_yellow.src = "assets/player/normal m.png";

export const playerWalk_yellow = new Image();
playerWalk_yellow.src = "assets/player/walk m.png";

export const playerEat_yellow = new Image();
playerEat_yellow.src = "assets/player/eat m.png";

// Karakter PINK
export const playerNormal_pink = new Image();
playerNormal_pink.src = "assets/player/normal.png";

export const playerWalk_pink = new Image();
playerWalk_pink.src = "assets/player/walk.png"; // sprite walk pink

export const playerEat_pink = new Image();
playerEat_pink.src = "assets/player/eat.png";

// ===== DEFAULT (backward compat) =====
export const playerNormal = playerNormal_yellow;
export const playerWalk   = playerWalk_yellow;
export const playerEat    = playerEat_yellow;

// ===== FOOD IMAGES =====
export const foodImages = [];
for (let i = 1; i <= 10; i++) {
  const img = new Image();
  img.src = `assets/food/${i}.png`;
  foodImages.push(img);
}

export const bombImg = new Image();
bombImg.src = "assets/food/bomb.png";

export const specialImg = new Image();
specialImg.src = "assets/food/special.png";
