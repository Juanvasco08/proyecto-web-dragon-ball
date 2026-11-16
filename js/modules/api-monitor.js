// js/modules/api-monitor.js
const API_URL = "https://dragonball-api.com/api/characters?limit=1";

const $ = (id) => document.getElementById(id);

export async function initApiMonitor() {
  const dot = $("api-status-dot");
  const text = $("api-status-text");
  const latency = $("api-latency");
  const total = $("api-total");

  // Estos elementos solo existen en index.html
  if (!dot || !text || !latency || !total) return;

  const start = performance.now();

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const ms = Math.round(performance.now() - start);

    dot.className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse";
    text.textContent = "En línea";
    latency.textContent = `${ms} ms`;
    total.textContent = data.meta?.totalItems ?? "--";
  } catch (error) {
    dot.className = "w-2 h-2 rounded-full bg-red-500";
    text.textContent = "Sin conexión";
    latency.textContent = "-- ms";
    total.textContent = "--";
  }
}