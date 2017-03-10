import * as fae from "fae";
import ga from "gameanalytics";
import { app } from "./app";

import { playerTemplate } from "./player";
import { skeletonSpawnTemplate } from "./skeleton";
import { archerSpawnTemplate } from "./archer";

let player, scoreCounter, statusIndicators, pauseButton, enemySpawner;

app.scene("main", {
    enter() {
        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Start, "main");

        // TODO: Animate entrance

        // TODO: Brief visual tutorial

        player = app.e(playerTemplate);
        app.player = player;

        app.score = 0;

        // TODO: Fix blurry text on windows
        scoreCounter = app.e({
            components: ["motion"],
            parent: app.stage.dungeon,

            ready() {
                this.stroke = this.addChild(new PIXI.Graphics());
                this.text = new PIXI.extras.BitmapText("", {font: "16px Sharp-Retro"});
                this.addChild(this.text);

                this.text.tint = 0xccd5ff;
                this.y = -2;
            },

            update() {
                this.text.text = app.score;
                this.stroke
                .clear()
                .beginFill(0x505ea1)
                .drawRect(-1, 6, this.text.textWidth + 2, this.text.textHeight - 14)
                .endFill();

                this.x = (-this.parent.x + 60) - this.width/2;
            }
        });

        statusIndicators = [];

        // TODO: Clean this mess up
        for (let i = 0; i < 3; i++) {
            statusIndicators.push(app.e({
                components: ["sprite", "motion", "timeout"],
                parent: app.stage,

                ready() {
                    this.sprite.texture = app.resources.gui.textures["full-crystal.png"];
                    this.position = new fae.Vector(15 + (i * 12), 129);
                },

                update() {
                    let tex = (player.mana < i + 1) ? "empty" : "full";
                    this.sprite.texture = app.resources.gui.textures[tex + "-crystal.png"];
                },

                animateout() {
                    this.velocity.y = 2;
                }
            }));

            statusIndicators.push(app.e({
                components: ["sprite", "motion", "timeout"],
                parent: app.stage,

                ready() {
                    this.sprite.texture = app.resources.gui.textures["full-heart.png"];
                    this.position = new fae.Vector(15 + (i * 12), 141);
                },

                update() {
                    let tex = (player.health < i + 1) ? "empty" : "full";
                    this.sprite.texture = app.resources.gui.textures[tex + "-heart.png"];
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
                this.sprite.texture = app.resources.gui.textures["pause-button.png"];
                this.position = new fae.Vector(76, 130);

                this.interactive = true;
                this.buttonMode = true;

                // TODO: Unify click and tap callbacks
                this.on("click", () => {
                    if (app.ticker.started) {
                        this.sprite.texture = app.resources.gui.textures["unpause-button.png"];
                        app.ticker.stop();
                    } else {
                        app.ticker.start();
                        this.sprite.texture = app.resources.gui.textures["pause-button.png"];
                    }
                    app.ticker.update();
                }, this);

                this.on("tap", () => {
                    if (app.ticker.started) {
                        this.sprite.texture = app.resources.gui.textures["unpause-button.png"];
                        app.ticker.stop();
                    } else {
                        app.ticker.start();
                        this.sprite.texture = app.resources.gui.textures["pause-button.png"];
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
                const size = Math.min(this.currentWave * 2 - 1, 6);

                for (let i = 0; i < size; i++) {
                    const skeleton = app.e(skeletonSpawnTemplate);
                    skeleton.x = Math.random() * (100 - 20) + 20;
                    skeleton.y = Math.random() * (24 - 16) + 16;
                }

                // TODO: limit number of archers
                if (this.currentWave >= 7 && this.currentWave % 2 === 1) {
                    const archer = app.e(archerSpawnTemplate);
                    archer.x = Math.random() * (100 - 20) + 20;
                    archer.y = Math.random() * (48 - 32) + 32;
                    archer.scale.x = (archer.x < player.x) ? 1 : -1;
                }

                this.currentWave++;

                this.timeout(3000, "spawnwave");
            }
        });

        app.once("smoothexitmain", (scene) => {
            app.scene(scene);
            enemySpawner.queueDestroy();

            for (const layer of ["characters", "arrows", "fireballs"]) {
                for (const entity of app.stage[layer].children) {
                    entity.fire("kill");
                }
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
                    scoreCounter.queueDestroy();
                    pauseButton.queueDestroy();
                    this.queueDestroy();

                    for (const indicator of statusIndicators) {
                        indicator.queueDestroy();
                    }
                }
            });
        });
    },

    exit() {
        if (app.score > app.highScore) {
            ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Complete, "main", null, null, app.score);
        } else {
            ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Fail, "main", null, null, app.score);
        }
    }
});
