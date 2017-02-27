import * as fae from "fae";
import { app } from "./app";

import { sparkTemplate, poofTemplate } from "./enemy-effects";

const arrowTemplate = {
    components: ["sprite", "motion", "collision", "timeout"],
    parent: app.stage.characters,

    ready() {
        this.drawCollider = true;

        this.sprite.anchor.set(0.5);
        this.cAnchor.set(0.5);
        this.w = 2;
        this.h = 2;

        // TODO: Draw arrow sprite
        // this.sprite.texture = app.resources.arrow.texture;

        this.timeout(3000, "kill");
    },

    collided(other) {
        other.fire("hitbyarrow", this);
    },

    hitbyfireball() {
        // TODO: Effect for this
        app.score += 5;
        this.queueDestroy();
    },

    hitbyexplosion() {
        app.score += 1;
        this.queueDestroy();
    },

    kill() {
        this.queueDestroy();
    }
};

const archerTemplate = {
    components: ["animatedsprite", "collision", "timeout"],
    parent: app.stage.characters,

    ready() {
        this.drawCollider = true;

        this.as.anchor.set(0.5, 1);
        this.cAnchor.set(0.5, 1);

        this.w = 10;
        this.h = 16;

        // TODO: Draw archer sprite
        // this.as.textures = app.resources.archer.array;

        // this.as.addAnimation("idle", {
        //     speed: 4,
        //     start: 0,
        //     end: 3
        // });
        //
        // this.as.playAnimation("idle");

        this.timeout(1000, "shootarrow");
    },

    shootarrow() {
        const arrow = app.e(arrowTemplate);
        arrow.x = this.x;
        arrow.y = this.y - 8;

        const dir = app.player.position.minus(arrow.position).normalize();
        arrow.velocity = dir.times(1.5);

        // TODO: rotate arrow to direction of travel

        this.timeout(4000, "shootarrow");
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

export const archerSpawnTemplate = {
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

        const archer = app.e(archerTemplate);
        archer.position = this.position;
        archer.y += 4;

        this.sparks.queueDestroy();
        this.queueDestroy();
    }
};
