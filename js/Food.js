import { foodImages, bombImg, specialImg } from "./assets.js";

// ===== FOOD CLASS =====
export class Food {
  constructor(canvas, speed) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

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
      this.ctx.shadowColor = "gold";
      this.ctx.shadowBlur = 25;
    }

    this.ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
    this.ctx.shadowBlur = 0;
  }
}
