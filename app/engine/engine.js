import { Application } from "pixi.js";

// Start PIXI
export const app = new PIXI.Application(1280, 720, { transparent: true });
document.body.appendChild(app.view);

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
    isMouseDown: {},
    mouseX: null,
    mouseY: null
};

// Track pressed keys
document.onkeydown = (event) => {
    if (event.repeat) return;
    let key = formatKey(event.key);
    app.input.isKeyDown[key] = true;
};
document.onkeyup = (event) => {
    if (event.repeat) return;
    let key = formatKey(event.key);
    app.input.isKeyDown[key] = false;
};

// Track mouse input
app.view.onmousedown = (event) => {
    event.preventDefault();
    app.input.isMouseDown[event.button] = true;
};
document.onmouseup = (event) => {
    event.preventDefault();
    app.input.isMouseDown[event.button] = false;
};
document.onmousemove = (event) => {
    let rect = app.view.getBoundingClientRect();
    app.input.mouseX = Math.round((event.clientX - rect.left) / app.stage.scale.x);
    app.input.mouseY = Math.round((event.clientY - rect.top) / app.stage.scale.y);
};

// Prevent context menu
app.view.oncontextmenu = (event) => {
    event.preventDefault();
};
