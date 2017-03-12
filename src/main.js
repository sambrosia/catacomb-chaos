import * as fae from "fae";
import ga from "gameanalytics";
import { app } from "./app";

import { playerTemplate } from "./player";
import { waves } from "./waves";

let player, scoreCounter, statusIndicators, pauseButton, enemySpawner;

app.scene("main", {
    enter() {
        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Start, "main");

        app.resources.soundBGLoop.sound.loop = true;
        app.resources.soundBGLoop.sound.play();

        // TODO: Animate entrance

        // TODO: Brief visual tutorial

        player = app.e(playerTemplate);
        app.player = player;

        app.score = 0;

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

        // TODO: Clean this mess up
        statusIndicators = [];
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

                this.onClick = () => {
                    if (app.ticker.started) {
                        app.resources.soundPause.sound.play();
                        app.resources.soundBGLoop.sound.pause();

                        this.sprite.texture = app.resources.gui.textures["unpause-button.png"];
                        app.ticker.stop();
                    } else {
                        app.resources.soundUnpause.sound.play();
                        app.resources.soundBGLoop.sound.resume();

                        app.ticker.start();
                        this.sprite.texture = app.resources.gui.textures["pause-button.png"];
                    }
                    app.ticker.update();
                };

                this.on("click", this.onClick, this);
                this.on("tap", this.onClick, this);
            }
        });

        enemySpawner = app.e({
            components: ["timeout"],

            ready() {
                this.currentWave = 0;

                this.spawnNextWave = () => {
                    this.currentWave++;

                    if (waves[this.currentWave] && waves[this.currentWave].spawn) {
                        this.lastExistingWave = this.currentWave;
                        waves[this.currentWave].spawn(this.spawnNextWave, this.currentWave);
                    }
                    else {
                        waves[this.lastExistingWave].spawn(this.spawnNextWave, this.currentWave);
                    }
                };

                // Next wave is 1 in this case
                // There is no wave 0
                this.spawnNextWave();
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

        app.resources.soundBGLoop.sound.stop();
    }
});
