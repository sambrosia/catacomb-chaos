import * as fae from "fae";
import { app } from "./app";

export const enemyTemplate = {
    components: ["animatedsprite", "motion", "steering", "collision"],
    parent: app.stage.characters,

    ready() {
        this.as.anchor.set(0.5, 1);
        this.cAnchor.set(0.6, 1);

        this.w = 12;
        this.h = 24;

        this.moveSpeed = 0.6;
        this.turnSpeed = 0.02;

        this.as.textures = this.app.resources.mage.array;

        this.as.addAnimation("idle", {
            speed: 4,
            start: 0,
            end: 3
        });

        this.as.addAnimation("walk", {
            speed: 4,
            start: 4,
            end: 7
        });

        this.as.playAnimation("idle");
    },

    hitbyfireball(fireball) {
        fireball.fire("landedhit");
    },

    hitbyexplosion() {
        this.queueDestroy();
    }
};
