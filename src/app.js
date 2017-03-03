import * as fae from "fae";

// Create application
export const app = new fae.Application(480, 640, {
    view: document.getElementById("catacomb-chaos-canvas")
});

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
app.stage.dungeon =     app.stage.addChildAt(new PIXI.Container(), 0);
app.stage.characters =  app.stage.addChildAt(new PIXI.Container(), 1);
app.stage.effects =     app.stage.addChildAt(new PIXI.Container(), 2);
app.stage.arrows =      app.stage.addChildAt(new PIXI.Container(), 3);
app.stage.fireballs =   app.stage.addChildAt(new PIXI.Container(), 4);

app.bind("update", () => {
    // Y-Sort characters
    app.stage.characters.children.sort((a, b) => { return a.y - b.y; });
});

app.score = 0;
app.highScore = Number(window.localStorage.getItem("catacombChaosHighScore") || 0);
