import * as fae from "fae";

// Create application
export const app = new fae.Application(480, 640);
document.body.appendChild(app.view);

// app.view.style.width = "480px";
// app.view.style.height = "640px";

// Set up view stretching
window.addEventListener("resize", () => {
    if (app.view.parentElement.clientWidth > app.view.parentElement.clientHeight * 0.75) {
        app.view.style.height = app.view.parentElement.clientHeight + "px";
        app.view.style.width = Math.round(app.view.clientHeight * 0.75) + "px";
    } else {
        app.view.style.width = app.view.parentElement.clientWidth + "px";
        app.view.style.height = Math.round(app.view.clientWidth * (1 / 0.75)) + "px";
    }

    app.view.stretch = app.view.clientWidth / app.renderer.width;
});
window.dispatchEvent(new Event("resize"));

// TODO: Move everything below to more appropriate place (loading.js?)
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
app.highScore = 0;
