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
    groups: ["fireball"],
    parent: app.stage.world,

    ready() {
        this.w = 6;
        this.h = 6;
        this.collisionAnchor.set(0.5);
        this.collisionGroups.add("wall").add("enemy").add("arrow");

        this.emitOptions = {
            texture: fireTexture,
            lifetime: 300,
            area: 4,
            scale: 6,
            endScale: 0.01,
            rotationRandom: 1.5,
            velocityRandom: new fae.Vector(1, 1)
        };

        this.steer = false;
        this.moveSpeed = 5;
        this.turnSpeed = 0.65;

        app.resources.soundFireball.sound.play({
            speed: 1 + (Math.random() - 0.5) * 0.5
        });

        this.onPointerDown = (event) => {
            if (!this.steer) {
                this.steer = true;
                this.pointerId = event.data.identifier;
                this.chaseVec = new fae.Vector(event.data.getLocalPosition(app.stage));
            }
        };

        this.onPointerUp = (event) => {
            if (this.pointerId == event.data.identifier) this.steer = false;
        };

        this.onPointerMove = (event) => {
            if (this.steer && this.pointerId == event.data.identifier) {
                this.chaseVec = new fae.Vector(event.data.getLocalPosition(app.stage));
            }
        };

        app.input.on("pointerdown", this.onPointerDown);
        app.input.on("pointerup", this.onPointerUp);
        app.input.on("pointermove", this.onPointerMove);
    },

    update() {
        this.emitOptions.velocity = this.velocity.times(0.6);
        this.emitOptions.period = 30 / (this.velocity.length / 4 + 1);

        this.avoidVecs = [];
        for (const fireball of app.groups.fireball) {
            if (fireball == this) continue;
            this.avoidVecs.push(fireball.position);
        }
    },

    collided(other) {
        other.emit("hitbyfireball", this);
    },

    landedhit() {
        this.sleeping = true;
        this.emit("kill");
    },

    kill() {
        const explosion = app.e(explosionTemplate);
        explosion.position = this.position;
        this.queueDestroy();
    },

    destroy() {
        app.input.removeListener("pointerdown", this.onPointerDown);
        app.input.removeListener("pointerup", this.onPointerUp);
        app.input.removeListener("pointermove", this.onPointerMove);
    }
};
