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
    const stop = () => cancelAnimationFrame(raf);
    track(stop);
    return stop; // permite detener la cuenta antes de tiempo
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

  // PRUEBA 1: Reflejos. Resultado: tiempo de reacción en milisegundos.
  function runReflejos(next) {
    const target = root.querySelector("#reflex-target");
    const msg = root.querySelector("#reflex-msg");
    const out = root.querySelector("#reflex-result");

    let state = "wait"; // wait → go → done (o early si se adelanta)
    let t0 = 0;         // instante exacto en que el núcleo se puso verde
    let delayId = 0;    // temporizador de la espera aleatoria
    let raf = 0;        // animación del cronómetro en vivo

    // Si el usuario sale de esta pantalla, se cancela todo lo pendiente
    track(() => {
      clearTimeout(delayId);
      cancelAnimationFrame(raf);
    });

    const setState = (s, label) => {
      state = s;
      target.dataset.state = s; // el CSS pinta el botón según este atributo
      target.textContent = label;
    };

    const rate = (ms) =>
      ms < 200 ? "¡Reflejos de Saiyajin!" :
      ms < 300 ? "Muy rápido" :
      ms < 450 ? "Normal" : "Lento… ¡a entrenar!";

    // Prepara la ronda: espera un tiempo aleatorio entre 1.5 y 4 segundos
    function arm() {
      setState("wait", "ESPERA");
      msg.textContent = "Espera a que el núcleo se ponga verde…";
      out.textContent = "";
      timerEl.textContent = "0.00 s";

      delayId = setTimeout(() => {
        setState("go", "¡YA!");
        msg.textContent = "¡Ahora! ¡Haz clic!";
        t0 = performance.now();

        const tick = () => {
          timerEl.textContent = `${((performance.now() - t0) / 1000).toFixed(2)} s`;
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }, 1500 + Math.random() * 2500);
    }

    on(target, "click", () => {
      if (state === "wait") {
        // Se adelantó: cancelamos la señal y repetimos la ronda
        clearTimeout(delayId);
        setState("early", "MUY PRONTO");
        msg.textContent = "¡Te adelantaste! Inténtalo de nuevo…";
        after(1400, arm);
      } else if (state === "go") {
        cancelAnimationFrame(raf);
        const ms = Math.round(performance.now() - t0);
        setState("done", `${ms} ms`);
        msg.textContent = "¡Registrado!";
        out.textContent = `${ms} ms · ${rate(ms)}`;
        after(1500, () => next(ms)); // pasa a la Prueba 2 con el resultado
      }
    });

    arm();
  }  
  
  
  // PRUEBA 2: Energía. Resultado: cantidad de pulsos en 5 segundos.
  function runEnergia(next) {
    const DURATION = 5000;
    const core = root.querySelector("#energy-core");
    const countEl = root.querySelector("#energy-count");
    const bar = root.querySelector("#energy-bar");

    let count = 0;
    let started = false;  // el tiempo arranca con el primer pulso
    let finished = false;
    let hitId = 0;

    // Estado inicial de la pantalla
    countEl.textContent = "0";
    bar.style.width = "100%";
    timerEl.textContent = "5.00 s";
    track(() => clearTimeout(hitId));

    function end() {
      finished = true;
      core.classList.remove("is-hit");
      after(1500, () => next(count)); // pasa a la Prueba 3 con el resultado
    }

    function pulse() {
      if (finished) return;

      if (!started) {
        started = true;
        countdown(DURATION, (left) => { bar.style.width = `${left * 100}%`; }, end);
      }

      count++;
      countEl.textContent = String(count);

      // Efecto visual breve en el núcleo
      core.classList.add("is-hit");
      clearTimeout(hitId);
      hitId = setTimeout(() => core.classList.remove("is-hit"), 60);
    }

    // Clic o toque en el núcleo (pointerdown responde más rápido que click)
    on(core, "pointerdown", (e) => {
      if (!e.isTrusted) return; // ignora clics simulados por código
      e.preventDefault();
      pulse();
    });

    // Barra espaciadora
    on(document, "keydown", (e) => {
      if (e.code !== "Space" || e.repeat || !e.isTrusted) return; // e.repeat: mantenerla pulsada no cuenta
      e.preventDefault(); // evita que la página haga scroll
      pulse();
    });

    // Evita el menú contextual al mantener el dedo en el celular
    on(core, "contextmenu", (e) => e.preventDefault());
  }
  
  // PRUEBA 3: Control mental. Resultado: { correct, ms, errors }
  function runCalculo(next) {
    const DURATION = 6000;
    const qEl = root.querySelector("#math-question");
    const form = root.querySelector("#math-form");
    const input = root.querySelector("#math-input");
    const bar = root.querySelector("#math-bar");

    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Genera una operación aleatoria y su respuesta (la respuesta solo vive en esta función)
    function makeQuestion() {
      const kind = randInt(0, 2);
      if (kind === 0) {
        const a = randInt(10, 99), b = randInt(10, 99);
        return { text: `${a} + ${b}`, answer: a + b };
      }
      if (kind === 1) {
        const a = randInt(30, 99), b = randInt(10, a); // nunca da negativo
        return { text: `${a} − ${b}`, answer: a - b };
      }
      const a = randInt(6, 15), b = randInt(3, 12);
      return { text: `${a} × ${b}`, answer: a * b };
    }

    const { text, answer } = makeQuestion();
    let finished = false;
    let errors = 0;
    let flashId = 0;
    const t0 = performance.now();

    // Estado inicial de la pantalla
    qEl.textContent = text;
    input.value = "";
    input.disabled = false;
    bar.style.width = "100%";
    timerEl.textContent = "6.00 s";
    track(() => clearTimeout(flashId));

    const stop = countdown(
      DURATION,
      (left) => { bar.style.width = `${left * 100}%`; },
      () => finish(false) // se acabó el tiempo
    );

    function finish(correct) {
      if (finished) return;
      finished = true;
      stop(); // detiene el cronómetro
      input.disabled = true;
      qEl.textContent = correct ? "✔ ¡Correcto!" : `✘ Era ${answer}`;
      const ms = Math.min(Math.round(performance.now() - t0), DURATION);
      after(1500, () => next({ correct, ms, errors }));
    }

    // Solo deja escribir dígitos (y el signo menos)
    on(input, "input", () => {
      input.value = input.value.replace(/[^0-9-]/g, "");
    });

    on(form, "submit", (e) => {
      e.preventDefault();
      if (finished) return;

      const raw = input.value.trim();
      if (raw === "") return;

      if (Number(raw) === answer) {
        finish(true);
      } else {
        // Respuesta mala: se puede reintentar mientras quede tiempo
        errors++;
        input.value = "";
        input.classList.add("border-red-400");
        clearTimeout(flashId);
        flashId = setTimeout(() => input.classList.remove("border-red-400"), 400);
      }
    });

    input.focus();
  }
  
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