import * as fae from "fae";
import { app } from "./app";

import { sparkTemplate, poofTemplate } from "./enemy-effects";

const skeletonTemplate = {
    components: ["animatedsprite", "motion", "steering", "collision"],
    parent: app.stage.characters,

    ready() {
        this.as.anchor.set(0.5, 1);
        this.cAnchor.set(0.5, 1);

        this.w = 10;
        this.h = 16;

        this.moveSpeed = 0.6;
        this.turnSpeed = 0.02;

        this.as.textures = app.resources.skeleton.array;

        this.as.addAnimation("walk", {
            speed: 6,
            start: 0,
            end: 3
        });

        this.as.playAnimation("walk");

        this.chaseVec = new fae.Vector(Math.random() * (88 - 32) + 32, 60);

        // TODO: Sometimes spawn carrying potions/powerups

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
        const smoke = app.e(poofTemplate);
        smoke.position = this.position;
        smoke.y -= 4;

        app.score += 10;

        this.queueDestroy();
    }
};

export const skeletonSpawnTemplate = {
    components: ["timeout"],
    parent: app.stage.characters,

    ready() {
        this.sparks = app.e(sparkTemplate);
        this.addChild(this.sparks);

        this.timeout((Math.random() + 1) * 500, "kill");
    },

    kill() {
        const smoke = app.e(poofTemplate);
        smoke.position = this.position;

        const skeleton = app.e(skeletonTemplate);
        skeleton.position = this.position;
        skeleton.y += 4;

        this.sparks.queueDestroy();
        this.queueDestroy();
    }
};
