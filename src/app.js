import * as fae from "fae";
import ga from "gameanalytics";

import { smallText, mediumText, largeText } from "./text";
import Purse from "./purse";

// Configure analytics
ga.logging.GALogger.debugEnabled = false;
ga.GameAnalytics.setEnabledInfoLog(false);
ga.GameAnalytics.setEnabledVerboseLog(false);
// ga.GameAnalytics.setEnabledManualSessionHandling(true);

ga.GameAnalytics.configureBuild("html5 0.1.0");

ga.GameAnalytics.initialize("d2874ef493b5e62c0a632b94933445e1", "9965ecf15c5e8d6d6aa692e3ee33388a84ccf2f2");

// ga.GameAnalytics.startSession();
// window.addEventListener("beforeunload", ga.GameAnalytics.endSession);
// window.addEventListener("unload", ga.GameAnalytics.endSession);

// Create application
export const app = new fae.Application(480, 640, {
    view: document.getElementById("catacomb-chaos-canvas"),
    resolution: 1
});

// Load custom components
app.c("smallText", smallText);
app.c("mediumText", mediumText);
app.c("largeText", largeText);

// Set up view stretching
function resize() {
    const parentWidth = app.view.parentElement.clientWidth;
    const parentHeight = app.view.parentElement.clientHeight;

    if (parentWidth > parentHeight * 0.75) {
        app.view.style.height = parentHeight + "px";
        app.view.style.width = Math.round(app.view.clientHeight * 0.75) + "px";
    } else {
        app.view.style.width = parentWidth + "px";
        app.view.style.height = Math.round(app.view.clientWidth * (1 / 0.75)) + "px";
    }

    window.requestAnimationFrame(resize);
}

resize();

// Scale world
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
app.stage.scale.set(4);

// Some PIXI layers
app.stage.removeChild(app.stage.particles);
app.stage.dungeon = app.stage.addChildAt(new PIXI.Container(), 0);
app.stage.world = app.stage.addChildAt(new PIXI.Container(), 1);
app.stage.effects = app.stage.addChildAt(new PIXI.Container(), 2);
app.stage.addChildAt(app.stage.particles, 3);
app.stage.gui = app.stage.addChildAt(new PIXI.Container(), 4);

app.stage.dungeon.interactiveChildren = false;
app.stage.world.interactiveChildren = false;
app.stage.effects.interactiveChildren = false;

// Y-Sort characters
app.event.on("update", () => {
    app.stage.world.children.sort((a, b) => { return a.y - b.y; });
});

app.score = 0;
app.highScore = Number(window.localStorage.getItem("catacombChaosHighScore") || 0);
app.purse = new Purse(app);

app.settings = {
    musicMuted: false,
    musicVolume: 1.5,
    soundVolume: 0.1,
    fullscreen: false
};
