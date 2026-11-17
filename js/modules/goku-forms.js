// js/modules/goku-forms.js
const API = "https://dragonball-api.com/api/characters";
const BASE_IMAGE = "https://dragonball-api.com/characters/goku_normal.webp";

// Cada forma aparece cuando los clicks llegan a "from"
export const FORMS = Object.freeze([
  { name: "Goku Base",          from: 0,  color: "#38bdf8", match: null },
  { name: "Super Saiyan",       from: 7,  color: "#facc15", match: /^(?!.*(2|3|4|god|dios|blue|azul|ros)).*(super saiyan|super saiyajin|ssj)/i },
  { name: "Super Saiyan 2",     from: 14, color: "#fde047", match: /(super saiyan|super saiyajin|ssj)\s*2/i },
  { name: "Super Saiyan 3",     from: 21, color: "#f59e0b", match: /(super saiyan|super saiyajin|ssj)\s*3/i },
  { name: "Super Saiyan 4",     from: 28, color: "#ef4444", match: /(super saiyan|super saiyajin|ssj)\s*4/i },  
  { name: "Super Saiyan Blue",  from: 35, color: "#3b82f6", match: /(blue|azul|ssjb)/i },
  { name: "Ultra Instinto",     from: 42, color: "#e2e8f0", match: /(ultra|instinto|instinct)/i },
]);

export async function loadFormImages() {
  let base = BASE_IMAGE;
  let transformations = [];

  try {
    const res = await fetch(`${API}/1`);
    if (res.ok) {
      const goku = await res.json();
      base = goku.image || base;
      transformations = Array.isArray(goku.transformations) ? goku.transformations : [];
    }
  } catch {
    // Plan B: se queda la imagen base
  }

  let last = base;
  return FORMS.map((form) => {
    const found = form.match && transformations.find((t) => form.match.test(t.name ?? ""));
    last = found?.image || last;
    return last;
  });
}

