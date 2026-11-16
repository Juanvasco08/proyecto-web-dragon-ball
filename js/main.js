// js/main.js
import { renderLayout } from "./modules/navigation.js";
import { initApiMonitor } from "./modules/api-monitor.js";
import { initTypewriter, initCounters } from "./modules/effects.js";

renderLayout();
initApiMonitor();
initTypewriter();
initCounters();