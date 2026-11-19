// js/main.js
import { renderLayout } from "./modules/navigation.js";
import { initApiMonitor } from "./modules/api-monitor.js";
import { initGame } from "./modules/game.js";
import { initDragonBall } from "./modules/dragonball.js";
import { initExtra } from "./modules/extra.js";
import { initTheme } from "./modules/theme.js";
import { initTypewriter, initCounters, initSkillBars } from "./modules/effects.js";

renderLayout();
initApiMonitor();
initTypewriter();
initCounters();
initGame();
initDragonBall();
initExtra();
initTheme();
initSkillBars();