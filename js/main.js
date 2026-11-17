// js/main.js
import { renderLayout } from "./modules/navigation.js";
import { initApiMonitor } from "./modules/api-monitor.js";
import { initTypewriter, initCounters } from "./modules/effects.js";
import { initGame } from "./modules/game.js";
import { initDragonBall } from "./modules/dragonball.js";

renderLayout();
initApiMonitor();
initTypewriter();
initCounters();
initGame();
initDragonBall();