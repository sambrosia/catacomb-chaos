import * as fae from "fae";
import { app } from "./app";

import { playerTemplate } from "./player";
import { skeletonSpawnTemplate } from "./skeleton";

let player, scoreCounter, statusIndicators, pauseButton, skeletonSpawner;

app.scene("main", {
    enter() {
        player = app.e(playerTemplate);
        app.player = player;

        // TODO: Fix blurry text on windows
        scoreCounter = app.e({
            components: ["text"],
            parent: app.stage,

            ready() {
                this.text.anchor.x = 0.5;
                this.text.x = 60;

                this.text.style = new PIXI.TextStyle({
                    fontFamily: "Sharp-Retro",
                    fontSize: 16,
                    letterSpacing: -1,
                    lineHeight: 1,
                    textBaseline: "alphabetic",
                    fill: 0xccd5ff,
                    stroke: 0x505ea1,
                    strokeThickness: 2,
                });
            },

            update() {
                this.text.text = player.score + "";
            }
        });

        statusIndicators = [];

        for (let i = 0; i < 3; i++) {
            statusIndicators.push(app.e({
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
            }));

            statusIndicators.push(app.e({
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
            }));
        }

        pauseButton = app.e({
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

        skeletonSpawner = app.e({
            components: ["timeout"],

            ready() {
                this.fire("spawnwave", 1);
            },

            spawnwave(size) {
                // TODO: Increment score multiplier every 5 waves of not being injured
                size = Math.min(size, 6);

                for (let i = 0; i < size; i++) {
                    const skeleton = app.e(skeletonSpawnTemplate);
                    skeleton.x = Math.random() * (100 - 20) + 20;
                    skeleton.y = Math.random() * (24 - 16) + 16;
                }

                this.timeout(3000, "spawnwave", size + 1);
            }
        });
    },

    exit() {
        app.lastScore = app.player.score;

        scoreCounter.queueDestroy();
        pauseButton.queueDestroy();
        skeletonSpawner.queueDestroy();

        for (const indicator of statusIndicators) {
            indicator.queueDestroy();
        }

        for (const character of app.stage.characters.children) {
            character.fire("kill");
            character.queueDestroy();
        }

        for (const fireball of app.stage.fireballs.children) {
            fireball.queueDestroy();
        }
    }
});
