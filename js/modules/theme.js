// js/modules/theme.js
// Modo oscuro / claro: aplica el tema, lo recuerda y respeta el del sistema.

const STORAGE_KEY = "theme";
const THEMES = ["dark", "light"];
const root = document.documentElement; // la etiqueta <html>
const systemQuery = window.matchMedia("(prefers-color-scheme: light)");

// Lee el tema guardado. Si no hay (o el navegador bloquea el guardado), devuelve null.
function readSaved() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(value) ? value : null;
  } catch {
    return null;
  }
}

function save(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* si no se puede guardar, el tema igual funciona en esta visita */
  }
}

// Tema que está aplicado ahora mismo
export function getTheme() {
  return root.dataset.theme === "light" ? "light" : "dark";
}

// Aplica el tema en la página y avisa a quien quiera enterarse (por ejemplo el botón)
function applyTheme(theme) {
  root.dataset.theme = theme;                       // el CSS claro se activa con [data-theme="light"]
  root.classList.toggle("dark", theme === "dark");  // mantiene la clase "dark" que ya usas
  root.style.colorScheme = theme;                   // barras de scroll y campos del navegador acordes
  window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
}

// Cambia entre oscuro y claro, y lo recuerda
export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  save(next);
  return next;
}

// Se ejecuta al cargar: usa el tema guardado o, si no hay, el del sistema
export function initTheme() {
  applyTheme(readSaved() ?? (systemQuery.matches ? "light" : "dark"));

  // Si el usuario nunca eligió, seguimos al sistema cuando este cambie
  systemQuery.addEventListener("change", (e) => {
    if (!readSaved()) applyTheme(e.matches ? "light" : "dark");
  });
}