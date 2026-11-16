// js/modules/game.js
import { FORMS, loadFormImages } from "./goku-forms.js";
import { createClickCounter } from "./click-counter.js";

const GOAL = 50;
const $ = (id) => document.getElementById(id);

export async function initGame() {
  const img = $("goku-img");
  const aura = $("goku-aura");
  const formName = $("goku-form");
  const button = $("game-button");

  // Estos elementos solo existen en juego.html
  if (!img || !aura || !formName || !button) return;

  const counterEl = $("game-counter");
  const bar = $("game-bar");
  const progress = $("game-progress");
  const status = $("game-status");
  const final = $("game-final");

  const images = await loadFormImages();
  let currentForm = -1;

  function showForm(index) {
    currentForm = index;
    img.src = images[index];
    img.classList.remove("hidden");
    aura.style.setProperty("--aura", FORMS[index].color);
    formName.textContent = FORMS[index].name;
  }

  function play(className) {
    img.classList.remove("goku-hit", "goku-power");
    void img.offsetWidth; // reinicia la animación
    img.classList.add(className);
    img.addEventListener("animationend", () => img.classList.remove(className), { once: true });
  }

  const counter = createClickCounter(GOAL, (count, finished) => {
    counterEl.textContent = count;
    progress.style.width = `${(count / GOAL) * 100}%`;
    bar.setAttribute("aria-valuenow", count);
    status.textContent = "";

    const index = FORMS.findLastIndex((form) => count >= form.from);
    if (index !== currentForm) {
      showForm(index);
      play("goku-power"); // se transforma
    } else {
      play("goku-hit"); // solo golpe
    }

    if (finished) {
      button.disabled = true;
      status.textContent = "¡Lo lograste!";
      final.classList.remove("hidden");
    }
  });

  button.addEventListener("click", (event) => {
    if (!counter.register(event)) {
      status.textContent = "Ese click no cuenta: muy rápido o automático.";
    }
  });

  showForm(0);
}