// js/modules/navigation.js
const LINKS = [
  { id: "inicio", label: "Inicio", href: "index.html" },
  { id: "sobre-mi", label: "Sobre Mí", href: "sobre-mi.html" },
  { id: "juego", label: "Reto Anti-Hack", href: "juego.html" },
  { id: "innovacion", label: "Innovación", href: "innovacion.html" },
  { id: "dragon-ball", label: "Dragon Ball API", href: "dragon-ball.html" },
];

const ACTIVE = "text-amber-400 bg-amber-500/10";
const IDLE = "text-slate-300 hover:text-white hover:bg-white/5";

function linkHTML(link, active, extra = "") {
  const isActive = link.id === active;
  const current = isActive ? ' aria-current="page"' : "";
  return `<a href="${link.href}"${current} class="${extra} px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? ACTIVE : IDLE}">${link.label}</a>`;
}

export function renderLayout() {
  const active = document.body.dataset.page;
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");

  if (header) {
    header.innerHTML = `
      <header class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Principal">
          <a href="index.html" class="font-bold text-lg text-white">Juan<span class="text-amber-400">.dev</span></a>
          <div class="hidden md:flex items-center gap-1">
            ${LINKS.map((l) => linkHTML(l, active)).join("")}
          </div>
          <button id="menu-btn" type="button" class="md:hidden p-2 rounded-lg text-slate-300 hover:bg-white/10" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
        </nav>
        <div id="mobile-menu" class="hidden md:hidden border-t border-white/10 px-4 py-3 space-y-1">
          ${LINKS.map((l) => linkHTML(l, active, "block")).join("")}
        </div>
      </header>`;

    const btn = document.getElementById("menu-btn");
    const menu = document.getElementById("mobile-menu");
    const toggle = (open) => {
      menu.classList.toggle("hidden", !open);
      btn.setAttribute("aria-expanded", String(open));
    };
    btn.addEventListener("click", () => toggle(menu.classList.contains("hidden")));
    document.addEventListener("keydown", (e) => e.key === "Escape" && toggle(false));
  }

  if (footer) {
    footer.innerHTML = `
      <footer class="border-t border-white/10 mt-12 py-8 text-center text-sm text-slate-500">
        © ${new Date().getFullYear()} Juan Manuel Vasco Vargas · Hecho con HTML, Tailwind y JavaScript
      </footer>`;
  }
}