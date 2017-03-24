import * as fae from "fae";
import ga from "gameanalytics";
import { app } from "./app";

import { playerTemplate } from "./player";
import { waves } from "./waves";

let player, scoreCounter, statusIndicators, pauseButton;

app.scene("main", {
    enter() {
        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Start, "main");

        app.resources.soundBGLoop.sound.play();

        player = app.e(playerTemplate);
        app.player = player;
        app.score = 0;

        const enemySpawner = app.e({
            ready() {
                this.currentWave = 0;

                this.spawnNextWave = () => {
                    if (app.exitingScene) return;

                    this.currentWave++;
                    app.event.emit("spawningwave", this.currentWave);

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
                this.timeout(500, this.spawnNextWave);
            }
        });

        scoreCounter = app.e({
            components: ["motion"],
            parent: app.stage.gui,

            ready() {
                this.stroke = this.addChild(new PIXI.Graphics());
                this.text = new PIXI.extras.BitmapText("", {font: "16px Sharp-Retro"});
                this.addChild(this.text);

                this.text.tint = 0xccd5ff;
                this.y = -2;
                this.alpha = 0;
            },

            update(dt) {
                if (this.alpha < 1) this.alpha += 0.05 * dt;
                else this.alpha = 1;

                this.text.text = app.score;
                this.stroke
                .clear()
                .beginFill(0x505ea1)
                .drawRect(-1, 6, this.text.textWidth + 2, this.text.textHeight - 14)
                .endFill();

                this.x = 60 - this.text.textWidth/2;
            }
        });

        pauseButton = app.e({
            components: ["sprite", "motion"],
            parent: app.stage.gui,


            ready() {
                this.sprite.texture = app.resources.gui.textures["pause-button.png"];
                this.position = new fae.Vector(76, 130);
                this.alpha = 0;

                this.interactive = true;
                this.buttonMode = true;

                this.on("pointertap", () => {
                    if (app.ticker.started) {
                        app.resources.soundPause.sound.play();
                        app.resources.soundBGLoop.sound.pause();

                        this.sprite.texture = app.resources.gui.textures["unpause-button.png"];
                        app.ticker.stop();
                        app.ticker.update();
                    } else {
                        app.resources.soundUnpause.sound.play();
                        app.resources.soundBGLoop.sound.resume();

                        app.ticker.start();
                        this.sprite.texture = app.resources.gui.textures["pause-button.png"];
                    }
                });
            },

            update(dt) {
                if (this.alpha < 1) this.alpha += 0.1 * dt;
                else this.alpha = 1;
            }
        });

        // TODO: Clean this mess up
        statusIndicators = [];
        for (let i = 0; i < 3; i++) {
            statusIndicators.push(app.e({
                components: ["sprite", "motion"],
                parent: app.stage.gui,

                ready() {
                    this.sprite.texture = app.resources.gui.textures["full-crystal.png"];
                    this.position = new fae.Vector(15 + (i * 12), 129);
                    this.alpha = 0;
                },

                update(dt) {
                    if (this.alpha < 1) this.alpha += 0.05 * dt;
                    else this.alpha = 1;

                    let tex = (player.mana < i + 1) ? "empty" : "full";
                    this.sprite.texture = app.resources.gui.textures[tex + "-crystal.png"];
                },

                animateout() {
                    this.velocity.y = 2;
                }
            }));

            statusIndicators.push(app.e({
                components: ["sprite", "motion"],
                parent: app.stage.gui,

                ready() {
                    this.sprite.texture = app.resources.gui.textures["full-heart.png"];
                    this.position = new fae.Vector(15 + (i * 12), 141);
                    this.alpha = 0;
                },

                update(dt) {
                    if (this.alpha < 1) this.alpha += 0.1 * dt;
                    else this.alpha = 1;

                    let tex = (player.health < i + 1) ? "empty" : "full";
                    this.sprite.texture = app.resources.gui.textures[tex + "-heart.png"];
                },

                animateout() {
                    this.velocity.y = 2;
                }
            }));
        }
    },

    exit(next) {
        const addProgressEvent = ga.GameAnalytics.addProgressionEvent;
        const status = ga.EGAProgressionStatus;
        if (app.score > app.highScore) {
            addProgressEvent(status.Complete, "main", null, null, app.score);
        } else {
            addProgressEvent(status.Fail, "main", null, null, app.score);
        }

        if (app.score > app.highScore) {
            app.highScore = app.score;
            window.localStorage.setItem("catacombChaosHighScore", app.highScore);
        }

        window.localStorage.setItem("catacombChaosGold", app.purse.gold);

        app.resources.soundBGLoop.sound.stop();
        app.resources.soundDeath.sound.play();

        for (const entity of app.stage.world.children) {
            entity.emit("kill");
        }

        let t = 0;
        for (const i of [5, 3, 1, 0, 2, 4]) {
            statusIndicators[i].timeout(t * 50, "animateout");
            t++;
        }

        scoreCounter.velocity.y = -2;
        pauseButton.velocity.x = 2;

        const skull = app.e({
            components: ["sprite"],
            parent: app.stage.gui,

            ready() {
                this.sprite.texture = app.resources.gui.textures["logo-skull.png"];
                this.y = 32;

                this.alpha = 0;
                this.fadingIn = true;

                this.timeout(1000, "fadeout");

                this.timer = 0;
            },

            update(dt) {
                if (this.fadingIn) {
                    this.alpha += 0.08 * dt;
                }
                else {
                    this.alpha -= 0.03 * dt;

                    if (this.alpha <= 0) next();
                }

                this.y = 32 + 3 * Math.sin(this.timer);
                this.timer += dt / 60 * 2;
            },

            fadeout() {
                this.alpha = 1;
                this.fadingIn = false;
            }
        });
    }
});
