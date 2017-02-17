import * as fae from "./engine";
import { app } from "./app";

import { explosionTemplate } from "./explosion";

export const fireballTemplate = {
    components: ["emitter", "motion", "steering", "collision"],
    parent: app.stage.fireballs,

    ready() {
        this.w = 4;
        this.h = 4;
        this.cAnchor.set(0.5);

        this.emitOptions = {
            lifetime: 300,
            area: 4,
            scale: 12,
            endScale: 0.01,
            rotationRandom: 1.5,
            velocityRandom: new fae.Vector(1, 1)
        };

        this.moveSpeed = 5;
        this.turnSpeed = 0.65;
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
        const explosion = app.e(explosionTemplate);
        explosion.position = this.position;

        this.sleeping = true;
        this.queueDestroy();
    }
};
