import * as fae from "fae";
import { app } from "./app";

import { fireballTemplate } from "./fireball";

import "./gameover";

export const playerTemplate = {
    components: ["animatedsprite", "collision"],
    groups: ["player"],
    parent: app.stage.world,

    ready() {
        this.health = 3;
        this.mana = 3;
        this.manaTimerMax = 650;
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
            // Don't shoot if clicking a button or paused
            if (event.target || !app.ticker.started) return;

            if (this.mana <= 0) {
                if (app.purse.potions.mana > 0) {
                    app.resources.soundPotion.sound.play();
                    app.purse.potions.mana--;
                    this.mana = 4;
                    app.event.emit("potionchanged", app.purse.potions.mana, "mana");
                }
                else return;
            }

            this.mana--;
            this.manaTimer = this.manaTimerMax;

            const fireball = app.e(fireballTemplate);
            fireball.position = new fae.Vector(this.x + Math.random(), this.y - 12);
            fireball.onPointerDown(event);

            this.scale.x = event.data.getLocalPosition(app.stage).x < this.x ? -1 : 1;
        };

        app.input.on("pointerdown", this.shootFireball);

        // TODO: Don't forget to remove this debug thing
        app.input.on("keydown", (key) => {
            if (key == "k") {
                this.health = 0;
            }
        });
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
        this.emit("injure");
        arrow.emit("kill");
    },

    injure() {
        this.health--;

        app.resources.soundHurt.sound.play({
            speed: 1 + (Math.random() - 0.5) * 0.5
        });

        if (this.health <= 0) {
            if (app.purse.potions.health > 0) {
                app.resources.soundPotion.sound.play();
                app.purse.potions.health--;
                this.health = 3;
                app.event.emit("potionchanged", app.purse.potions.health, "health");
            }
        }
    },

    kill() {
        this.queueDestroy();
    },

    destroy() {
        app.input.removeListener("pointerdown", this.shootFireball);
    },
};
