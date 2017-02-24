import * as fae from "fae";
import { app } from "./app";

import { fireballTemplate } from "./fireball";

export const playerTemplate = {
    components: ["animatedsprite", "collision"],
    parent: app.stage.characters,

    ready() {
        this.score = 0;
        this.health = 3;
        this.mana = 3;
        this.manaTimer = 500;

        this.as.anchor.set(0.5, 1);
        this.cAnchor.set(0.5, 1);

        this.w = 8;
        this.h = 4;

        this.position = new fae.Vector(60, 152);

        this.as.textures = this.app.resources.mage.array;

        this.as.addAnimation("idle", {
            speed: 4,
            start: 0,
            end: 3
        });

        this.as.playAnimation("idle");

        // TODO: only fire if not clicking on gui
        app.stage.on("pointerdown", () => {
            if (app.ticker.started) {
                if (this.mana >= 1) {
                    this.mana--;
                    this.manaTimer = 500;

                    const fireball = app.e(fireballTemplate);
                    fireball.position = new fae.Vector(this.x, this.y - 12);

                    this.scale.x = this.app.input.pointerPos.x < this.x ? -1 : 1;
                }
            }
        }, this);
    },

    update() {
        if (this.mana < 3) {
            this.manaTimer -= app.ticker.deltaTime / 60 * 1000;

            if (this.manaTimer <= 0) {
                this.mana++;
                this.manaTimer = 500;
            }
        }

        if (this.health <= 0) {
            // TODO: this
            console.log("Player died!");
            app.ticker.stop();
        }
    },

    hitbyskeleton(skeleton) {
        this.health--;
        skeleton.queueDestroy();
    }
};
