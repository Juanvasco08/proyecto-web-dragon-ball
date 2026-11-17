// js/modules/extra.js
// Rastreador de Ki (Scouter): circuito de 3 pruebas cronometradas.

const TESTS = ["reflejos", "energia", "calculo"]; // orden del circuito
const KEYS = ["reflex", "energy", "math"];        // dónde se guarda cada resultado

const LABELS = {
  intro: "LISTO",
  reflejos: "PRUEBA 1/3",
  energia: "PRUEBA 2/3",
  calculo: "PRUEBA 3/3",
  scan: "ESCANEANDO",
  resultado: "COMPLETADO",
};

export function initExtra() {
  const root = document.getElementById("extra");
  if (!root) return; // esta página no es innovacion.html: no hacemos nada

  const screens = root.querySelectorAll("[data-screen]");
  const stepEl = root.querySelector("#scouter-step");
  const timerEl = root.querySelector("#scouter-timer");
  const progressEl = root.querySelector("#scouter-progress");

  const results = { reflex: null, energy: null, math: null };
  let cleanups = []; // funciones que cancelan lo que la pantalla actual dejó activo

  // ---------- Utilidades con limpieza automática ----------

  const track = (fn) => cleanups.push(fn);

  const clearAll = () => {
    cleanups.forEach((fn) => fn());
    cleanups = [];
  };

  // setTimeout que se cancela solo al cambiar de pantalla
  const after = (ms, fn) => {
    const id = setTimeout(fn, ms);
    track(() => clearTimeout(id));
  };

  // addEventListener que se quita solo al cambiar de pantalla
  const on = (target, type, handler, opts) => {
    target.addEventListener(type, handler, opts);
    track(() => target.removeEventListener(type, handler, opts));
  };

  // Cuenta regresiva en vivo: actualiza el cronómetro y avisa el progreso (1 → 0)
  const countdown = (ms, onTick, onEnd) => {
    const start = performance.now();
    let raf;
    const frame = (now) => {
      const left = Math.max(0, ms - (now - start));
      timerEl.textContent = `${(left / 1000).toFixed(2)} s`;
      onTick?.(left / ms);
      if (left === 0) {
        onEnd?.();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    track(() => cancelAnimationFrame(raf));
  };

  // ---------- Pantallas ----------

  function showScreen(name) {
    clearAll(); // evita temporizadores o teclas "fantasma" de la pantalla anterior
    screens.forEach((s) => s.classList.toggle("hidden", s.dataset.screen !== name));
    stepEl.textContent = LABELS[name];
    timerEl.textContent = "0.00 s";

    const i = TESTS.indexOf(name);
    const pct = i >= 0 ? (i / TESTS.length) * 100 : name === "intro" ? 0 : 100;
    progressEl.style.width = `${pct}%`;
  }

  // ---------- Pruebas (de momento son de relleno; se reemplazan en los pasos 4, 5 y 6) ----------
  // Cada una recibe `next` y debe llamarlo con su resultado cuando termine.

  function runReflejos(next) { after(1000, () => next(null)); }
  function runEnergia(next) { after(1000, () => next(null)); }
  function runCalculo(next) { after(1000, () => next(null)); }

  const runners = [runReflejos, runEnergia, runCalculo];

  // ---------- Flujo del circuito ----------

  function runTest(i) {
    showScreen(TESTS[i]);
    runners[i]((value) => {
      results[KEYS[i]] = value;
      if (i + 1 < TESTS.length) runTest(i + 1);
      else finish();
    });
  }

  function finish() {
    showScreen("scan");
    console.log("Resultados del circuito:", results); // temporal: se quita en el Paso 7
    after(1500, () => showScreen("resultado"));
  }

  function startCircuit() {
    results.reflex = results.energy = results.math = null;
    runTest(0);
  }

  // ---------- Botones (un solo listener para toda la sección) ----------

  root.addEventListener("click", (e) => {
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (action === "start") startCircuit();
    if (action === "restart") showScreen("intro");
  });

  window.addEventListener("pagehide", clearAll);

  showScreen("intro");
}