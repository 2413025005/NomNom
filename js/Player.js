import {
  playerNormal_yellow, playerWalk_yellow, playerEat_yellow,
  playerNormal_pink,   playerWalk_pink,   playerEat_pink
} from "./assets.js";

// Karakter yang sedang aktif (default: kuning)
export let activeCharacter = "yellow";

export function setCharacter(char) {
  activeCharacter = char;
}

export class Player {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.width = 120;
    this.height = 130;
    this.x = canvas.width / 2;
    this.y = canvas.height - 180;
    this.eatingTime = 0;

    this.isMoving = false;
    this.walkFrame = 0;
    this.prevX = this.x;
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

    if (Math.abs(this.x - this.prevX) > 1) {
      this.isMoving = true;
    }
    this.prevX = this.x;

    this.x = Math.max(0, Math.min(this.canvas.width - this.width, this.x));

    if (this.isMoving) {
      this.walkFrame++;
    }

    if (this.eatingTime > 0) {
      this.eatingTime--;
    }
  }

  eat() {
    this.eatingTime = 8; // ← DIUBAH: dari 15 → 8 agar animasi mengunyah lebih cepat
  }

  draw() {
    // Pilih sprite sesuai karakter aktif
    const isYellow = activeCharacter === "yellow";
    const normal = isYellow ? playerNormal_yellow : playerNormal_pink;
    const walk   = isYellow ? playerWalk_yellow   : playerWalk_pink;
    const eat    = isYellow ? playerEat_yellow     : playerEat_pink;

    let img;
    if (this.eatingTime > 0) {
      img = eat;
    } else if (this.isMoving) {
      img = (this.walkFrame % 10 < 5) ? walk : normal; // ← DIUBAH: dari % 20 < 10 → % 10 < 5 (animasi walk 2x lebih cepat)
    } else {
      img = normal;
    }

    this.ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }
}
