import { Application } from "pixi.js";

// Start PIXI
export const app = new PIXI.Application(1280, 720, { transparent: true });
document.body.appendChild(app.view);

// Track pressed keys
app.keyDown = {};
function formatKey(k) {
    let key = k.toLowerCase();
    if      (key == "arrowleft")  key = "left";
    else if (key == "arrowright") key = "right";
    else if (key == "arrowup")    key = "up";
    else if (key == "arrowdown")  key = "down";
    else if (key == " ")          key = "space";
    return key;
}
document.onkeydown = function(event) {
    if (event.repeat) return;
    let key = formatKey(event.key);
    app.keyDown[key] = true;
};
document.onkeyup = function(event) {
    if (event.repeat) return;
    let key = formatKey(event.key);
    app.keyDown[key] = false;
};
