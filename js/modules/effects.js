// js/modules/effects.js
const PHRASES = [
  "innovadoras y seguras.",
  "modernas y rápidas.",
  "con el poder de Dragon Ball.",
];

export function initTypewriter() {
  const el = document.getElementById("typewriter-text");
  if (!el) return; // solo existe en index.html

  // Si la persona prefiere menos animaciones, dejamos el texto fijo
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const phrase = PHRASES[phraseIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = phrase.slice(0, charIndex) || "\u00A0";

    let delay = deleting ? 40 : 80;

    if (!deleting && charIndex === phrase.length) {
      deleting = true;
      delay = 1600; // pausa con la frase completa
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  };

  tick();
}