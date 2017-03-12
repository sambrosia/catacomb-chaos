import * as fae from "fae";
import { app } from "./app";

import { sparkTemplate, poofTemplate } from "./enemy-effects";

const arrowTemplate = {
    components: ["sprite", "motion", "collision", "timeout"],
    parent: app.stage.arrows,

    ready() {
        this.sprite.anchor.set(0.5, 0.9);
        this.cAnchor.set(0.5);
        this.w = 3;
        this.h = 3;

        this.sprite.texture = app.resources.archer.textures["arrow.png"];

        this.timeout(3000, "kill");
    },

    collided(other) {
        other.fire("hitbyarrow", this);
    },

    hitbyfireball() {
        // TODO: Effect for this
        app.score += 5;
        this.fire("kill");
    },

    hitbyexplosion() {
        app.score += 1;
        this.fire("kill");
    },

    kill() {
        app.resources.soundArrowBurn.sound.play();
        this.queueDestroy();
    }
};

export const archerTemplate = {
    components: ["animatedsprite", "collision", "timeout"],
    parent: app.stage.characters,

    ready() {
        this.sleeping = true;

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

        this.scale.x = (this.x < app.player.x) ? 1 : -1;
        this.as.anchor.set(0.5, 1);
        this.cAnchor.set(0.5, 1);

        this.y += 4;

        this.w = 10;
        this.h = 16;

        this.as.textures = app.resources.archer.array;

        this.as.addAnimation("idle", {
            speed: 4,
            start: 1,
            end: 4
        });

        this.as.addAnimation("shoot", {
            speed: 6,
            start: 5,
            end: 11,
            events: {
                9: "shootarrow"
            }
        });

        this.as.loopAnimation("idle");

        app.resources.soundSkeletonSpawn.sound.play({
            speed: 1 + Math.random() * 0.5
        });

        this.timeout(1000, "playshootanimation");
    },

    playshootanimation() {
        this.as.playAnimation("shoot");
        this.as.queueAnimation("idle", true);
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
