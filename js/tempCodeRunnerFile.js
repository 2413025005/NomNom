import { setSudahPernahBantuan } from "./Game.js";
import { bgm } from "./Game.js";

let jawabanBenar = 0;

// ===== QUIZ =====
export function tanyaSoal() {
  document.getElementById("reviveBox").style.display = "none";
  document.getElementById("soalBox").style.display = "block";

  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;

  jawabanBenar = a + b;
  document.getElementById("teksSoal").innerText = `Berapa ${a} + ${b}?`;
}

export function cekJawaban(game) {
  let val = parseInt(document.getElementById("jawabanKamu").value);

  if (val === jawabanBenar) {
    alert("PINTER!");
    document.getElementById("quizOverlay").style.display = "none";
    hidupLagi(game);
  } else {
    alert("Salah!");
    game.showFinalGameOver();
  }

  document.getElementById("jawabanKamu").value = "";
}

export function hidupLagi(game) {
  setSudahPernahBantuan(true);
  game.lives = 1;
  game.foods = [];
  game.running = true;

  // ✅ TAMBAH INI — tampilkan canvas kembali
  game.canvas.style.display = "block";

  bgm.play();
  game.loop();
}
