import * as fae from "fae";
import { app } from "./app";

const particleGraphics = new PIXI.Graphics()
.beginFill(0x601ac9)
.drawRect(0,0,2,2)
.endFill();

const particleTexture = app.renderer.generateTexture(particleGraphics);

export const poofTemplate = {
    components: ["emitter", "timeout"],
    parent: app.stage.effects,

    ready() {
        this.emitOptions = {
            texture: particleTexture,
            lifetime: 300,
            period: 20,
            area: 20,
            scale: 3,
            scaleRandom: 2,
            rotationRandom: 1,
            endAlpha: 0.01,
            velocityRandom: new fae.Vector(0.5, 0.5)
        };

        this.timeout(100, "kill");
    },

    kill() {
        this.queueDestroy();
    }
};

export const sparkTemplate = {
    components: ["emitter"],

    ready() {
        this.emitOptions = {
            texture: particleTexture,
            lifetime: 300,
            period: 50,
            area: 4,
            scale: 0.5,
            scaleRandom: 0.3,
            endAlpha: 0.01,
            velocityRandom: new fae.Vector(1, 1)
        };
    }
};
