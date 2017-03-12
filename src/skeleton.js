import * as fae from "fae";
import { app } from "./app";

import { sparkTemplate, poofTemplate } from "./enemy-effects";

export const skeletonTemplate = {
    components: ["animatedsprite", "motion", "steering", "collision", "timeout"],
    parent: app.stage.characters,

    ready() {
        this.sleeping = true;
        this.steer = false;

        const sparks = app.e(sparkTemplate);
        this.addChild(sparks);

        const t = (Math.random() + 1) * 500;
        sparks.timeout(t, "kill");
        this.timeout(t, "spawn");
    },

    spawn() {
        const smoke = app.e(poofTemplate);
        smoke.position = this.position;

        this.sleeping = false;
        this.steer = true;

        this.as.anchor.set(0.5, 1);
        this.cAnchor.set(0.5, 1);

        this.y += 4;

        this.w = 10;
        this.h = 16;

        this.moveSpeed = 0.6;
        this.turnSpeed = 0.02;
        this.chaseVec = new fae.Vector(Math.random() * (88 - 32) + 32, 60);

        this.as.textures = app.resources.skeleton.array;

        this.as.addAnimation("walk", {
            speed: 6,
            start: 0,
            end: 3
        });
        this.as.loopAnimation("walk");

        app.resources.soundSkeletonSpawn.sound.play({
            speed: 1 + Math.random() * 0.5
        });
    },

    update() {
        if (this.y > 60 && this.chaseVec != app.player.position) {
            this.chaseVec = app.player.position;
        }

        if (this.velocity.x < 0) {
            this.scale.x = -1;
        }
        else if (this.velocity.x > 0) {
            this.scale.x = 1;
        }
    },

    collided(other) {
        other.fire("hitbyskeleton", this);
    },

    hitbyfireball(fireball) {
        fireball.fire("landedhit");
    },

    hitbyexplosion() {
        app.score += 10;
        this.fire("kill");
    },

    kill() {
        const smoke = app.e(poofTemplate);
        smoke.position = this.position;
        smoke.y -= 4;

        this.queueDestroy();
    }
};
