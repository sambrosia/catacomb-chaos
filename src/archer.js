import * as fae from "fae";
import { app } from "./app";

import { sparkTemplate, poofTemplate } from "./enemy-effects";

const arrowTemplate = {
    components: ["sprite", "motion", "collision"],
    groups: ["arrow"],
    // TODO: Render above enemies, below player
    parent: app.stage.effects,

    ready() {
        this.sprite.anchor.set(0.5, 0.9);
        this.collisionAnchor.set(0.5);
        this.collisionGroups.add("player");
        this.w = 3;
        this.h = 3;

        this.sprite.texture = app.resources.archer.textures["arrow.png"];

        this.timeout(3000, "kill");
    },

    collided(other) {
        other.emit("hitbyarrow", this);
    },

    hitbyfireball() {
        app.score += 5;
        this.emit("kill");
    },

    hitbyexplosion() {
        app.score += 1;
        this.emit("kill");
    },

    kill() {
        app.resources.soundArrowBurn.sound.play();
        this.queueDestroy();
    }
};

export const archerTemplate = {
    components: ["animatedsprite", "collision"],
    groups: ["enemy", "archer"],
    parent: app.stage.world,

    ready() {
        this.awake = false;

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

        this.scale.x = (this.x < app.player.x) ? 1 : -1;
        this.sprite.anchor.set(0.5, 1);
        this.collisionAnchor.set(0.5, 1);

        this.y += 4;

        this.w = 10;
        this.h = 16;

        this.sprite.textures = app.resources.archer.array;

        this.sprite.addAnimation("idle", {
            speed: 4,
            start: 1,
            end: 4
        });

        this.sprite.addAnimation("shoot", {
            speed: 6,
            start: 5,
            end: 11,
            events: {
                9: "shootarrow"
            }
        });

        this.sprite.loopAnimation("idle");

        app.resources.soundSkeletonSpawn.sound.play({
            speed: 1 + Math.random() * 0.5
        });

        this.timeout(1000, "playshootanimation");
    },

    playshootanimation() {
        this.sprite.playAnimation("shoot");
        this.sprite.queueAnimation("idle", true);
        this.timeout(4000, "playshootanimation");
    },

    shootarrow() {
        const arrow = app.e(arrowTemplate);
        arrow.x = this.x + 4 * this.scale.x;
        arrow.y = this.y - 4;

        const dir = app.player.position.minus(arrow.position).normalize();
        arrow.velocity = dir.times(1.5);

        arrow.rotation = Math.atan2(dir.y, dir.x) - Math.PI * 0.5;

        app.resources.soundArrowShoot.sound.play({
            speed: 1 + (Math.random() - 0.5) * 0.5
        });
    },

    hitbyfireball(fireball) {
        fireball.emit("landedhit");
    },

    hitbyexplosion() {
        let bounty = 0;
        if (Math.random() < 0.1) bounty = 2;
        if (Math.random() < 0.01) bounty = 10;

        // TODO: Animate coin(s) coming out of skeleton

        app.purse.addGold(bounty);
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
