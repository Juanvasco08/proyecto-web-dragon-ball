// js/modules/navigation.js
import { toggleTheme, getTheme } from "./theme.js";

const LINKS = [
  { id: "inicio", label: "Inicio", href: "index.html" },
  { id: "sobre-mi", label: "Sobre Mí", href: "sobre-mi.html" },
  { id: "juego", label: "Reto de Clicks", href: "juego.html" },
  { id: "innovacion", label: "Medidor de KI", href: "innovacion.html" },
  { id: "dragon-ball", label: "Dragon Ball API", href: "dragon-ball.html" },
];

const ACTIVE = "text-amber-400 bg-amber-500/10";
const IDLE = "text-slate-300 hover:text-white hover:bg-white/5";

// Íconos del botón de tema (sol para ir a claro, luna para ir a oscuro)
const ICON_SUN = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/></svg>`;
const ICON_MOON = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/></svg>`;

function linkHTML(link, active, extra = "") {
  const isActive = link.id === active;
  const current = isActive ? ' aria-current="page"' : "";
  return `<a href="${link.href}"${current} class="${extra} px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? ACTIVE : IDLE}">${link.label}</a>`;
}

// Pinta el ícono y el texto accesible según el tema actual
function paintThemeButtons() {
  const isDark = getTheme() === "dark";
  const label = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.innerHTML = isDark ? ICON_SUN : ICON_MOON;
    btn.setAttribute("aria-label", label);
    btn.title = label;
  });
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
          <div class="flex items-center gap-2">
            <button type="button" data-theme-toggle class="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"></button>
            <button id="menu-btn" type="button" class="md:hidden p-2 rounded-lg text-slate-300 hover:bg-white/10" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-menu">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg>
            </button>
          </div>
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

    // Botón de tema: cambia el tema y mantiene el ícono al día
    header.querySelector("[data-theme-toggle]").addEventListener("click", toggleTheme);
    window.addEventListener("themechange", paintThemeButtons);
    paintThemeButtons();
  }

  if (footer) {
    footer.innerHTML = `
      <footer class="border-t border-white/10 mt-12 py-8 text-center text-sm text-slate-500">
        © ${new Date().getFullYear()} Juan Manuel Vasco Vargas · Hecho con HTML, Tailwind y JavaScript
      </footer>`;
  }
}