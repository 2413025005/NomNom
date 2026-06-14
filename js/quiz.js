import { setSudahPernahBantuan } from "./Game.js";
import { bgm } from "./Game.js";

let jawabanBenar = 0;

// ===== FEEDBACK MODAL (ganti alert) =====
// ← DIUBAH: fungsi baru untuk tampilkan feedback di dalam game
function showFeedback(message, isCorrect, onClose) {
  const overlay = document.getElementById("feedbackOverlay");
  const icon    = document.getElementById("feedbackIcon");
  const text    = document.getElementById("feedbackText");
  const btn     = document.getElementById("feedbackBtn");

  icon.textContent   = isCorrect ? "🎉" : "😢";
  text.textContent   = message;
  btn.textContent    = "OK";
  overlay.style.display = "flex";

  // Warna box sesuai benar/salah
  const box = document.getElementById("feedbackBox");
  box.style.borderColor = isCorrect ? "#a8e6cf" : "#ffaaa5";
  icon.style.color      = isCorrect ? "#2ecc71" : "#e74c3c";

  btn.onclick = () => {
    overlay.style.display = "none";
    if (onClose) onClose();
  };
}

// ===== QUIZ =====
export function tanyaSoal() {
  document.getElementById("reviveBox").style.display = "none";
  document.getElementById("soalBox").style.display = "block";

  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;

  // Pilih operasi secara acak: +, -, *, /
  const operasi = ["+", "-", "×", "÷"][Math.floor(Math.random() * 4)];

  let soalTeks;

  if (operasi === "+") {
    jawabanBenar = a + b;
    soalTeks = `Berapa ${a} + ${b}?`;

  } else if (operasi === "-") {
    // Pastikan hasil tidak negatif
    if (a < b) [a, b] = [b, a];
    jawabanBenar = a - b;
    soalTeks = `Berapa ${a} − ${b}?`;

  } else if (operasi === "×") {
    // Batas lebih kecil agar tidak terlalu sulit
    a = Math.floor(Math.random() * 9) + 1;
    b = Math.floor(Math.random() * 9) + 1;
    jawabanBenar = a * b;
    soalTeks = `Berapa ${a} × ${b}?`;

  } else {
    // Pembagian: buat soal yang pasti hasil bulat
    b = Math.floor(Math.random() * 9) + 1;          // pembagi 1–9
    jawabanBenar = Math.floor(Math.random() * 9) + 1; // hasil 1–9
    a = b * jawabanBenar;                             // yang ditanyakan
    soalTeks = `Berapa ${a} ÷ ${b}?`;
  }

  document.getElementById("teksSoal").innerText = soalTeks;
}

export function cekJawaban(game) {
  let val = parseInt(document.getElementById("jawabanKamu").value);

  if (val === jawabanBenar) {
    // ← DIUBAH: ganti alert("PINTER! 🎉") dengan modal in-game
    showFeedback("PINTER!", true, () => {
      document.getElementById("quizOverlay").style.display = "none";
      hidupLagi(game);
    });
  } else {
    // ← DIUBAH: ganti alert(`Salah! ...`) dengan modal in-game
    showFeedback(`Salah! Jawaban yang benar adalah ${jawabanBenar}`, false, () => {
      game.showFinalGameOver();
    });
  }

  document.getElementById("jawabanKamu").value = "";
}

export function hidupLagi(game) {
  setSudahPernahBantuan(true);
  game.lives = 1;
  game.foods = [];
  game.running = true;

  game.canvas.style.display = "block";

  bgm.play();
  game.loop();
}
