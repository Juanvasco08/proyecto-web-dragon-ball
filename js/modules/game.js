// js/modules/game.js
import { FORMS, loadFormImages } from "./goku-forms.js";

export async function initGame() {
  const img = document.getElementById("goku-img");
  const aura = document.getElementById("goku-aura");
  const formName = document.getElementById("goku-form");

  // Estos elementos solo existen en juego.html
  if (!img || !aura || !formName) return;

  const images = await loadFormImages();

  img.src = images[0];
  img.classList.remove("hidden");
  aura.style.setProperty("--aura", FORMS[0].color);
  formName.textContent = FORMS[0].name;
}