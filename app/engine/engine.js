import { Application } from "pixi.js";
import Vector from "./vector.js";

// Start PIXI
export const app = new PIXI.Application(480, 640);
document.body.appendChild(app.view);

// Set up view stretching
window.addEventListener("resize", () => {
    if (app.view.parentElement.clientWidth > app.view.parentElement.clientHeight * 0.75) {
        app.view.style.height = app.view.parentElement.clientHeight + "px";
        app.view.style.width = app.view.clientHeight * 0.75 + "px";
    } else {
        app.view.style.width = app.view.parentElement.clientWidth + "px";
        app.view.style.height = app.view.clientWidth * (1 / 0.75) + "px";
    }

    app.view.stretch = app.view.clientWidth / app.renderer.width;
});

window.dispatchEvent(new Event("resize"));

// Set world scale
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
app.stage.scale.set(4);

function formatKey(k) {
    let key = k.toLowerCase();
    if      (key == "arrowleft")  key = "left";
    else if (key == "arrowright") key = "right";
    else if (key == "arrowup")    key = "up";
    else if (key == "arrowdown")  key = "down";
    else if (key == " ")          key = "space";
    return key;
}

app.input = {
    isKeyDown: {},
    isMouseDown: [],
    mousePos: new Vector(0, 0),
    mouseDelta: new Vector(0, 0),
};

// Track pressed keys
document.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    let key = formatKey(event.key);
    app.input.isKeyDown[key] = true;
});
document.addEventListener("keyup", (event) => {
    if (event.repeat) return;
    let key = formatKey(event.key);
    app.input.isKeyDown[key] = false;
});

// Track mouse input
app.view.addEventListener("mousedown", (event) => {
    event.preventDefault();
    app.input.isMouseDown[event.button] = true;

    if (app.input.onMouseDown) app.input.onMouseDown(event);
});
document.addEventListener("mouseup", (event) => {
    event.preventDefault();
    app.input.isMouseDown[event.button] = false;
    if (app.input.onMouseUp) app.input.onMouseUp(event);
});
document.addEventListener("mousemove", (event) => {
    let rect = app.view.getBoundingClientRect();
    app.input.mousePos.set(
        Math.round((event.clientX - rect.left) / app.stage.scale.x / app.view.stretch),
        Math.round((event.clientY - rect.top) / app.stage.scale.y / app.view.stretch)
    );
    app.input.mouseDelta.set(event.movementX, event.movementY);
});

// Prevent context menu
app.view.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});
