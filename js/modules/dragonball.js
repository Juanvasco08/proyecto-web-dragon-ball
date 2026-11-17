// js/modules/dragonball.js
const API = "https://dragonball-api.com/api/characters";

// Escapa texto de la API para que no se interprete como HTML
const esc = (text) =>
  String(text ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function card(c) {
  return `
    <button type="button" data-id="${esc(c.id)}" class="glass-panel rounded-2xl p-4 text-left hover:-translate-y-1 hover:border-amber-500/40 transition-all">
      <img src="${esc(c.image)}" alt="${esc(c.name)}" loading="lazy" class="h-56 w-full object-contain mb-4">
      <h2 class="font-display text-lg font-bold text-white">${esc(c.name)}</h2>
      <p class="text-sm text-slate-400">${esc(c.race)} · ${esc(c.affiliation)}</p>
      <p class="text-sm text-amber-400 mt-2">Ki: ${esc(c.ki)}</p>
    </button>`;
}

export function initDragonBall() {
  const form = document.getElementById("db-form");
  const input = document.getElementById("db-search");
  const grid = document.getElementById("db-grid");
  const status = document.getElementById("db-status");

  // Estos elementos solo existen en dragon-ball.html
  if (!form || !input || !grid || !status) return;

  let lastRequest = 0;

  async function load(name = "") {
    const requestId = ++lastRequest;
    status.textContent = "Cargando guerreros...";
    grid.innerHTML = "";

    try {
      const url = name ? `${API}?name=${encodeURIComponent(name)}` : `${API}?limit=12`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (requestId !== lastRequest) return; // llegó una búsqueda más nueva

      const list = Array.isArray(data) ? data : data.items ?? [];
      if (!list.length) {
        status.textContent = `No encontré a "${name}". Prueba con otro nombre.`;
        return;
      }
      status.textContent = "";
      grid.innerHTML = list.map(card).join("");
    } catch (error) {
      if (requestId !== lastRequest) return;
      console.error(error);
      status.textContent = "No se pudo conectar con la API. Intenta de nuevo.";
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    load(input.value.trim());
  });

  load(); // lista inicial
}