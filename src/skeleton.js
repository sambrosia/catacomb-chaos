import * as fae from "fae";
import { app } from "./app";

import { sparkTemplate, poofTemplate } from "./enemy-effects";

export const skeletonTemplate = {
    components: ["animatedsprite", "motion", "steering", "collision"],
    groups: ["enemy"],
    parent: app.stage.world,

    ready() {
        this.awake = false;
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

        this.awake = true;
        this.steer = true;

        this.sprite.anchor.set(0.5, 1);
        this.collisionAnchor.set(0.5, 1);
        this.collisionGroups.add("player");

        this.y += 4;

        this.w = 10;
        this.h = 16;

        this.moveSpeed = 0.6;
        this.turnSpeed = 0.02;
        this.chaseVec = new fae.Vector(Math.random() * (88 - 32) + 32, 60);

        this.sprite.textures = app.resources.skeleton.array;

        this.sprite.addAnimation("walk", {
            speed: 6,
            start: 0,
            end: 3
        });
        this.sprite.loopAnimation("walk");

        app.resources.soundSkeletonSpawn.sound.play({
            speed: 1 + Math.random() * 0.5
        });

        // TODO: Coin above skeleton
        this.bounty = 0;

        let r = Math.random();
        if (r < 0.01) this.bounty = 5;
        else if (r < 1/3) this.bounty = 1;
    },

    update() {
        if (this.y > 60 && this.chaseVec != app.player.position) {
            this.chaseVec = app.player.position;
        }

        if (this.velocity.x < 0) { this.scale.x = -1; }
        else if (this.velocity.x > 0) { this.scale.x = 1; }
    },

    collided(other) {
        other.emit("hitbyskeleton", this);
    },

    hitbyfireball(fireball) {
        fireball.emit("landedhit");
    },

    hitbyexplosion() {
        app.purse.addGold(this.bounty);
        app.score += 10;
        this.emit("kill");
    },

    kill() {
        const smoke = app.e(poofTemplate);
        smoke.position = this.position;
        smoke.y -= 4;

        this.queueDestroy();
    }
};
