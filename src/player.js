import * as fae from "fae";
import { app } from "./app";

import { fireballTemplate } from "./fireball";

import "./gameover";

export const playerTemplate = {
    components: ["animatedsprite", "collision"],
    parent: app.stage.characters,

    ready() {
        this.health = 3;
        this.mana = 3;
        this.manaTimerMax = 700;
        this.manaTimer = this.manaTimerMax;

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

        // TODO:
        // FIXME: Fireball sometimes explodes at 0,0 when spawning with multitouch?
        this.shootFireball = () => {
            if (app.ticker.started) {
                if (this.mana >= 1) {
                    this.mana--;
                    this.manaTimer = this.manaTimerMax;

                    const fireball = app.e(fireballTemplate);
                    fireball.position = new fae.Vector(this.x, this.y - 12);

                    this.scale.x = this.app.input.pointerPos.x < this.x ? -1 : 1;
                }
            }
        };

        // TODO: only fire if not clicking on gui
        app.stage.on("pointerdown", this.shootFireball, this);
    },

    update() {
        if (this.mana < 3) {
            this.manaTimer -= app.ticker.deltaTime / 60 * 1000;

            if (this.manaTimer <= 0) {
                this.mana++;
                this.manaTimer = this.manaTimerMax;
            }
        }

        if (this.health <= 0) {
            app.fire("smoothexitmain", "gameover");
        }
    },

    // TODO: Injured effect/sound
    hitbyskeleton(skeleton) {
        this.health--;
        skeleton.fire("kill");
    },

    hitbyarrow(arrow) {
        // TODO: leave arrow sprite sticking out of player
        this.health--;
        arrow.fire("kill");
    },

    kill() {
        this.queueDestroy();
    },

    destroy() {
        app.stage.removeListener("pointerdown", this.shootFireball);
    },
};
