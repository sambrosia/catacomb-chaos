import * as fae from "fae";
import { app } from "./app";

import { playerTemplate } from "./player";
import { enemySpawnTemplate } from "./enemy";

app.scene("main", {
    enter() {
        const player = app.e(playerTemplate);
        app.player = player;

        const scoreCounter = app.e({
            components: ["text"],
            parent: app.stage.dungeon,

            ready() {
                this.text.anchor.set(0.5, 0);
                this.x = -this.parent.x + 60;
                this.y = -3;

                this.text.style = new PIXI.TextStyle({
                    fontFamily: "Sharp-Retro",
                    fontSize: 16,
                    letterSpacing: -1,
                    fill: 0xccd5ff,
                    stroke: 0x505ea1,
                    strokeThickness: 2,
                });
            },

            update() {
                this.text.text = player.score;
            }
        });

        for (let i = 0; i < 3; i++) {
            app.e({
                components: ["sprite"],
                parent: app.stage,

                ready() {
                    this.sprite.texture = app.resources["crystal-full"].texture;
                    this.position = new fae.Vector(15 + (i * 12), 129);
                },

                update() {
                    let tex = (player.mana < i + 1) ? "crystal-empty" : "crystal-full";
                    this.sprite.texture = app.resources[tex].texture;
                }
            });

            app.e({
                components: ["sprite"],
                parent: app.stage,

                ready() {
                    this.sprite.texture = app.resources["heart-full"].texture;
                    this.position = new fae.Vector(15 + (i * 12), 141);
                },

                update() {
                    let tex = (player.health < i + 1) ? "heart-empty" : "heart-full";
                    this.sprite.texture = app.resources[tex].texture;
                }
            });
        }

        const pauseButton = app.e({
            components: ["sprite"],
            parent: app.stage,


            ready() {
                this.sprite.texture = app.resources["pause-button"].texture;
                this.position = new fae.Vector(76, 130);

                this.interactive = true;
                this.buttonMode = true;

                // TODO: Unify click and tap callbacks
                this.on("click", () => {
                    if (app.ticker.started) {
                        this.sprite.texture = app.resources["unpause-button"].texture;
                        app.ticker.stop();
                    } else {
                        app.ticker.start();
                        this.sprite.texture = app.resources["pause-button"].texture;
                    }
                    app.ticker.update();
                }, this);

                this.on("tap", () => {
                    if (app.ticker.started) {
                        this.sprite.texture = app.resources["unpause-button"].texture;
                        app.ticker.stop();
                    } else {
                        app.ticker.start();
                        this.sprite.texture = app.resources["pause-button"].texture;
                    }
                    app.ticker.update();
                }, this);
            }
        });

        const enemySpawner = app.e({
            components: ["timeout"],

            ready() {
                this.fire("spawnwave", 1);
            },

            spawnwave(size) {
                // TODO: Increment score multiplier every 5 waves of not being injured
                size = Math.min(size, 6);

                for (let i = 0; i < size; i++) {
                    const enemy = app.e(enemySpawnTemplate);
                    enemy.x = Math.random() * (100 - 20) + 20;
                    enemy.y = Math.random() * (24 - 16) + 16;
                }

                this.timeout(3000, "spawnwave", size + 1);
            }
        });
    },

    exit() {

    }
});
