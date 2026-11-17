// js/modules/dragonball.js
const API = "https://dragonball-api.com/api/characters";

// Escapa texto de la API para que no se interprete como HTML
const esc = (text) =>
  String(text ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Traducciones de los datos que la API trae en inglés
const RACES = {
  Saiyan: "Saiyajin", Human: "Humano", Namekian: "Namekiano", Android: "Androide",
  "Frieza Race": "Raza de Freezer", "Jiren Race": "Raza de Jiren", God: "Dios",
  Angel: "Ángel", Evil: "Maligno", Majin: "Majin", Unknown: "Desconocido",
};
const AFFILIATIONS = {
  "Z Fighter": "Guerrero Z", "Red Ribbon Army": "Ejército de la Cinta Roja",
  "Namekian Warrior": "Guerrero Namekiano", "Freeza Force": "Ejército de Freezer",
  "Pride Troopers": "Tropas del Orgullo", "Army of Frieza": "Ejército de Freezer",
  God: "Dios", Other: "Otros", Unknown: "Desconocido",
};
const GENDERS = { Male: "Masculino", Female: "Femenino", Unknown: "Desconocido" };

const KI_UNITS = {
  thousand: ["mil", "mil"],
  million: ["millón", "millones"],
  billion: ["mil millones", "mil millones"],
  trillion: ["billón", "billones"],
  quadrillion: ["mil billones", "mil billones"],
  quintillion: ["trillón", "trillones"],
  sextillion: ["mil trillones", "mil trillones"],
  septillion: ["cuatrillón", "cuatrillones"],
};

const tr = (map, value) => map[value] ?? value;

function translateKi(ki) {
  const match = String(ki ?? "").match(/^([\d.,]+)\s+([a-z]+)$/i);
  const units = match && KI_UNITS[match[2].toLowerCase()];
  if (!units) return tr({ unknown: "Desconocido" }, String(ki ?? "").toLowerCase()) || "Desconocido";
  return `${match[1]} ${parseFloat(match[1].replace(",", ".")) === 1 ? units[0] : units[1]}`;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const toList = (data) => (Array.isArray(data) ? data : data.items ?? []);

async function fetchAll() {
  const first = await fetchJson(`${API}?page=1&limit=100`);
  const pages = first.meta?.totalPages ?? 1;
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) => fetchJson(`${API}?page=${i + 2}&limit=100`))
  );
  return [first, ...rest].flatMap(toList);
}

function card(c) {
  return `
    <button type="button" data-id="${esc(c.id)}" class="group glass-panel rounded-2xl p-4 text-left hover:-translate-y-1 hover:border-amber-500/40 transition-all">
      <img src="${esc(c.image)}" alt="${esc(c.name)}" loading="lazy" class="h-56 w-full object-contain mb-4 transition-transform duration-300 motion-safe:group-hover:scale-110 motion-safe:group-focus-visible:scale-110">
      <h2 class="font-display text-lg font-bold text-white">${esc(c.name)}</h2>
      <p class="text-sm text-slate-400">${esc(tr(RACES, c.race))} · ${esc(tr(AFFILIATIONS, c.affiliation))}</p>
      <p class="text-sm text-amber-400 mt-2">Ki: ${esc(translateKi(c.ki))}</p>
    </button>`;
}

function detail(c) {
  const forms = (c.transformations ?? [])
    .map(
      (t) => `
      <li class="glass-panel rounded-xl p-3 text-center">
        <img src="${esc(t.image)}" alt="${esc(t.name)}" loading="lazy" class="h-28 w-full object-contain mb-2">
        <p class="text-sm font-semibold text-white">${esc(t.name)}</p>
        <p class="text-xs text-amber-400">Ki: ${esc(translateKi(t.ki))}</p>
      </li>`
    )
    .join("");

  const planet = c.originPlanet
    ? `<h3 class="font-display text-lg font-bold text-white mt-8 mb-2">Planeta de origen: ${esc(c.originPlanet.name)}</h3>
       <p class="text-sm text-slate-400">${esc(c.originPlanet.description)}</p>`
    : "";

  return `
    <div class="grid gap-6 md:grid-cols-[240px_1fr]">
      <img src="${esc(c.image)}" alt="${esc(c.name)}" class="h-64 w-full object-contain">
      <div>
        <h2 id="db-modal-title" class="font-display text-3xl font-bold text-white">${esc(c.name)}</h2>
        <p class="text-sm text-slate-400 mt-1">${esc(tr(RACES, c.race))} · ${esc(tr(GENDERS, c.gender))} · ${esc(tr(AFFILIATIONS, c.affiliation))}</p>
        <p class="text-amber-400 mt-3">Ki: ${esc(translateKi(c.ki))}</p>
        <p class="text-cyan-400">Ki máximo: ${esc(translateKi(c.maxKi))}</p>
        <p class="text-slate-300 mt-4 leading-relaxed">${esc(c.description)}</p>
      </div>
    </div>
    ${forms ? `<h3 class="font-display text-lg font-bold text-white mt-8 mb-3">Transformaciones</h3>
    <ul class="grid gap-3 grid-cols-2 sm:grid-cols-3">${forms}</ul>` : ""}
    ${planet}`;
}

export function initDragonBall() {
  const form = document.getElementById("db-form");
  const input = document.getElementById("db-search");
  const grid = document.getElementById("db-grid");
  const status = document.getElementById("db-status");
  const modal = document.getElementById("db-modal");
  const modalBody = document.getElementById("db-modal-body");
  const modalClose = document.getElementById("db-modal-close");

  // Estos elementos solo existen en dragon-ball.html
  if (!form || !input || !grid || !status || !modal || !modalBody || !modalClose) return;
  // Estos elementos solo existen en dragon-ball.html
  if (!form || !input || !grid || !status) return;

  let lastRequest = 0;

    async function openModal(id) {
    modalBody.innerHTML = `<p class="py-16 text-center text-slate-400">Cargando...</p>`;
    modal.showModal();
    try {
      modalBody.innerHTML = detail(await fetchJson(`${API}/${encodeURIComponent(id)}`));
    } catch (error) {
      console.error(error);
      modalBody.innerHTML = `<p class="py-16 text-center text-red-400">No se pudo cargar el detalle.</p>`;
    }
  }

  grid.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-id]");
    if (btn) openModal(btn.dataset.id);
  });

  modalClose.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close(); // click fuera de la ventana
  });
  async function load(name = "") {
    const requestId = ++lastRequest;
    status.textContent = "Cargando guerreros...";
    grid.innerHTML = "";

    try {
      const list = name
        ? toList(await fetchJson(`${API}?name=${encodeURIComponent(name)}`))
        : await fetchAll();
      if (requestId !== lastRequest) return; // llegó una búsqueda más nueva

      if (!list.length) {
        status.textContent = `No encontré a "${name}". Prueba con otro nombre.`;
        return;
      }
      status.textContent = `${list.length} guerreros encontrados`;
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

  load(); // lista inicial con todos los personajes
}