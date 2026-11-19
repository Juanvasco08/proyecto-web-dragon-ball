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

export function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return; // solo hay contadores en sobre-mi.html

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animate = (el) => {
    const target = Number(el.dataset.count);
    if (reduceMotion) {
      el.textContent = target;
      return;
    }

    const duration = 1500; // milisegundos
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // empieza rápido y frena al final
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  // Arranca cada contador solo cuando aparece en pantalla
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target); // una sola vez
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => observer.observe(el));
}

export function initSkillBars() {
  const fills = document.querySelectorAll("[data-skill]");
  if (!fills.length) return; // solo hay barras en sobre-mi.html

  const fill = (el) => {
    el.style.width = `${el.dataset.skill}%`;
  };

  // Si la persona prefiere menos animaciones, las barras aparecen ya llenas
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    fills.forEach((el) => {
      el.style.transition = "none";
      fill(el);
    });
    return;
  }

  // Cada barra entra un poquito después que la anterior
  fills.forEach((el, i) => {
    el.style.transitionDelay = `${i * 120}ms`;
  });

  // Se llenan cuando aparecen en pantalla (se observa el contenedor, que sí tiene ancho)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        fill(entry.target.querySelector("[data-skill]"));
        observer.unobserve(entry.target); // una sola vez
      }
    });
  }, { threshold: 0.5 });

  fills.forEach((el) => observer.observe(el.parentElement));
}