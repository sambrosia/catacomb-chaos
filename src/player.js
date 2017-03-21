import * as fae from "fae";
import { app } from "./app";

import { fireballTemplate } from "./fireball";

import "./gameover";

export const playerTemplate = {
    components: ["animatedsprite", "collision"],
    groups: ["player"],
    parent: app.stage.characters,

    ready() {
        this.health = 3;
        this.mana = 3;
        this.manaTimerMax = 700;
        this.manaTimer = this.manaTimerMax;

        this.sprite.anchor.set(0.5, 1);
        this.collisionAnchor.set(0.5, 1);

        this.w = 8;
        this.h = 4;

        this.position = new fae.Vector(60, 152);

        this.sprite.textures = this.app.resources.mage.array;

        this.sprite.addAnimation("idle", {
            speed: 4,
            start: 0,
            end: 3
        });

        this.sprite.loopAnimation("idle");

        this.shootFireball = (event) => {
            if (app.ticker.started) {
                if (this.mana >= 1) {
                    this.mana--;
                    this.manaTimer = this.manaTimerMax;

                    const fireball = app.e(fireballTemplate);
                    fireball.position = new fae.Vector(this.x + Math.random(), this.y - 12);
                    fireball.onPointerDown(event);

                    this.scale.x = event.data.getLocalPosition(app.stage).x < this.x ? -1 : 1;
                }
            }
        };

        // TODO: only fire if not clicking on gui
        app.input.on("pointerdown", this.shootFireball, this);
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
            app.scene("gameover");
        }
    },

    hitbyskeleton(skeleton) {
        this.emit("injure");
        skeleton.emit("kill");
    },

    hitbyarrow(arrow) {
        // TODO: leave arrow sticking out of player
        this.emit("injure");
        arrow.emit("kill");
    },

    injure() {
        this.health--;

        app.resources.soundHurt.sound.play({
            speed: 1 + (Math.random() - 0.5) * 0.5
        });
    },

    kill() {
        this.queueDestroy();
    },

    destroy() {
        app.input.removeListener("pointerdown", this.shootFireball);
    },
};
