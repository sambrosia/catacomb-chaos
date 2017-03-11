import * as fae from "fae";
import { app } from "./app";

import { explosionTemplate } from "./explosion";

const fireGraphics = new PIXI.Graphics()
.beginFill(0xff4411)
.drawRect(0,0,2,2)
.endFill();

export const fireTexture = app.renderer.generateTexture(fireGraphics);

export const fireballTemplate = {
    components: ["emitter", "motion", "steering", "collision"],
    parent: app.stage.fireballs,

    ready() {
        this.w = 6;
        this.h = 6;
        this.cAnchor.set(0.5);

        this.emitOptions = {
            texture: fireTexture,
            lifetime: 300,
            area: 4,
            scale: 6,
            endScale: 0.01,
            rotationRandom: 1.5,
            velocityRandom: new fae.Vector(1, 1)
        };

        this.moveSpeed = 5;
        this.turnSpeed = 0.65;

        app.resources.soundFireball.sound.play({
            speed: 1 + (Math.random() - 0.5) * 0.5
        });
    },

    update() {
        this.emitOptions.velocity = this.velocity.times(0.6);
        this.emitOptions.period = 30 / (this.velocity.length / 4 + 1);

        this.steer = this.app.input.pointerDown ? true : false;
        if (this.steer) this.chaseVec = this.app.input.pointerPos;

        this.avoidVecs = [];
        for (let i = 0; i < app.stage.fireballs.children.length; i++) {
            if (app.stage.fireballs.children[i] == this) continue;
            this.avoidVecs.push(app.stage.fireballs.children[i].position);
        }
    },

    collided(other) {
        other.fire("hitbyfireball", this);
    },

    landedhit() {
        this.sleeping = true;
        this.fire("kill");
    },

    kill() {
        const explosion = app.e(explosionTemplate);
        explosion.position = this.position;
        this.queueDestroy();
    }
};
