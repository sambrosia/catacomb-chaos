import * as fae from "fae";
import { app } from "./app";

import { sparkTemplate, poofTemplate, ghostlyTemplate } from "./enemy-effects";

export const ghostSkeletonTemplate = {
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

        this.ghost = app.e(ghostlyTemplate);
        this.addChild(this.ghost);
        this.ghost.x = 2;
        this.ghost.y = -13;

        this.hp = 2;
        this.hitExplosions = [];

        app.resources.soundSkeletonSpawn.sound.play({
            speed: 1 + Math.random() * 0.5
        });
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

    hitbyexplosion(explosion) {
        if (this.hitExplosions.includes(explosion)) return;
        this.hitExplosions.push(explosion);

        this.hp--;
        if (this.hp == 1) {
            this.ghost.queueDestroy();
        }
        else if (this.hp <= 0) {
            app.score += 10;
            this.emit("kill");
        }
    },

    kill() {
        const smoke = app.e(poofTemplate);
        smoke.position = this.position;
        smoke.y -= 4;

        this.queueDestroy();
    }
};