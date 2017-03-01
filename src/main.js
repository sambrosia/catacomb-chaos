import * as fae from "fae";
import { app } from "./app";

import { playerTemplate } from "./player";
import { skeletonSpawnTemplate } from "./skeleton";
import { archerSpawnTemplate } from "./archer";

let player, scoreCounter, statusIndicators, pauseButton, enemySpawner;

app.scene("main", {
    enter() {
        player = app.e(playerTemplate);
        app.player = player;

        app.score = 0;

        // TODO: Fix blurry text on windows
        scoreCounter = app.e({
            components: ["text", "motion"],
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
                this.text.text = app.score + "";
            }
        });

        statusIndicators = [];

        // TODO: Clean this mess up
        for (let i = 0; i < 3; i++) {
            statusIndicators.push(app.e({
                components: ["sprite", "motion", "timeout"],
                parent: app.stage,

                ready() {
                    this.sprite.texture = app.resources["crystal-full"].texture;
                    this.position = new fae.Vector(15 + (i * 12), 129);
                },

                update() {
                    let tex = (player.mana < i + 1) ? "crystal-empty" : "crystal-full";
                    this.sprite.texture = app.resources[tex].texture;
                },

                animateout() {
                    this.velocity.y = 2;
                }
            }));

            statusIndicators.push(app.e({
                components: ["sprite", "motion", "timeout"],
                parent: app.stage,

                ready() {
                    this.sprite.texture = app.resources["heart-full"].texture;
                    this.position = new fae.Vector(15 + (i * 12), 141);
                },

                update() {
                    let tex = (player.health < i + 1) ? "heart-empty" : "heart-full";
                    this.sprite.texture = app.resources[tex].texture;
                },

                animateout() {
                    this.velocity.y = 2;
                }
            }));
        }

        pauseButton = app.e({
            components: ["sprite", "motion"],
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

        enemySpawner = app.e({
            components: ["timeout"],

            ready() {
                this.currentWave = 1;
                this.fire("spawnwave", 1);
            },

            spawnwave() {
                // TODO: Increment score multiplier every 5 waves of not being injured

                const size = Math.min(this.currentWave * 2 - 1, 6);

                for (let i = 0; i < size; i++) {
                    const skeleton = app.e(skeletonSpawnTemplate);
                    skeleton.x = Math.random() * (100 - 20) + 20;
                    skeleton.y = Math.random() * (24 - 16) + 16;
                }

                // TODO: limit number of archers on screen
                if (this.currentWave >= 7 && this.currentWave % 2 === 1) {
                    const archer = app.e(archerSpawnTemplate);
                    archer.x = Math.random() * (100 - 20) + 20;
                    archer.y = Math.random() * (48 - 32) + 32;
                }

                this.currentWave++;

                this.timeout(3000, "spawnwave");
            }
        });

        app.once("smoothexitmain", (scene) => {
            app.scene(scene);
            enemySpawner.queueDestroy();

            for (const character of app.stage.characters.children) {
                character.fire("kill");
            }

            for (const fireball of app.stage.fireballs.children) {
                fireball.fire("kill");
            }

            scoreCounter.velocity.y = -2;
            pauseButton.velocity.x = 2;

            let t = 0;
            for (const i of [5, 3, 1, 0, 2, 4]) {
                statusIndicators[i].timeout(t * 50, "animateout");
                t++;
            }

            app.e({
                components: ["timeout"],

                ready() {
                    this.timeout(800, "changescene");
                },

                changescene() {
                    this.queueDestroy();
                    scoreCounter.queueDestroy();
                    pauseButton.queueDestroy();

                    for (const indicator of statusIndicators) {
                        indicator.queueDestroy();
                    }
                }
            });
        });
    },

    exit() {}
});
