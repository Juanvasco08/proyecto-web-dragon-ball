// js/modules/click-counter.js
const MIN_GAP_MS = 80; // más rápido que esto no es humano

export function createClickCounter(goal, onChange) {
  let count = 0; // privado: no existe como variable global
  let lastClick = 0;
  let finished = false;

  function register(event) {
    if (finished) return false;
    if (!event.isTrusted) return false; // click falso hecho por un script

    const now = performance.now();
    if (now - lastClick < MIN_GAP_MS) return false; // autoclicker
    lastClick = now;

    count += 1;
    if (count >= goal) finished = true;

    onChange(count, finished);
    return true;
  }

  return Object.freeze({ register, getCount: () => count });
}