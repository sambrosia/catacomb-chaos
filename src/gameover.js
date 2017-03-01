import * as fae from "fae";
import { app } from "./app";

let skull, score, highScore, playButton;

app.scene("gameover", {
    enter() {
        skull = app.e({
            components: ["sprite", "timeout"],
            parent: app.stage,

            ready() {
                this.sprite.texture = app.resources["logo-skull"].texture;
                this.sprite.anchor.set(0.5);
                this.x = 60;
                this.y = 80;

                this.alpha = 0;
                this.fadingIn = true;

                this.timeout(1000, "fadeout");
            },

            update(dt) {
                if (this.alpha < 0) this.queueDestroy();

                if (this.fadingIn) {
                    this.alpha += 0.08 * dt;
                }
                else {
                    this.alpha -= 0.03 * dt;
                }
            },

            fadeout() {
                this.alpha = 1;
                this.fadingIn = false;
            }
        });

        score = app.e({
            components: ["text", "timeout"],
            parent : app.stage,

            ready() {
                this.text.anchor.set(0.5);
                this.position = new fae.Vector(60, 48);

                this.text.style = new PIXI.TextStyle({
                    fontFamily: "Sharp-Retro",
                    fontSize: 32,
                    letterSpacing: -2,
                    lineHeight: 1,
                    textBaseline: "alphabetic",
                    fill: 0xccd5ff,
                    stroke: 0x505ea1,
                    strokeThickness: 4,
                });

                this.text.text = app.score + "";

                this.alpha = 0;
                this.timeout(1000, "fadein");
            },

            update(dt) {
                if (this.fade) {
                    this.alpha += 0.03 * dt;
                    if (this.alpha >= 1) this.fade = false;
                }
            },

            fadein() {
                this.fade = true;
            }
        });

        // TODO: Save highscore in browser
        if (app.score > app.highScore) app.highScore = app.score;

        // TODO: Show old highscore if new score beats it
        highScore = app.e({
            components: ["text", "timeout"],
            parent : app.stage,

            ready() {
                this.text.anchor.set(0.5);
                this.position = new fae.Vector(60, 66);

                this.text.style = new PIXI.TextStyle({
                    fontFamily: "Sharp-Retro",
                    fontSize: 16,
                    letterSpacing: -1,
                    lineHeight: 1,
                    textBaseline: "alphabetic",
                    fill: 0x9af9b7,
                    stroke: 0x2dd96a,
                    strokeThickness: 2,
                });

                this.text.text = "best: " + app.highScore;

                this.alpha = 0;
                this.timeout(1300, "fadein");
            },

            update(dt) {
                if (this.fade) {
                    this.alpha += 0.03 * dt;
                    if (this.alpha >= 1) this.fade = false;
                }
            },

            fadein() {
                this.fade = true;
            }
        });

        // TODO: Animate into position to avoid accidentally clicking upon death
        playButton = app.e({
            components: ["sprite", "timeout"],
            parent: app.stage,

            ready() {
                this.sprite.texture = app.resources["play-button"].texture;
                this.sprite.anchor.set(0.5);
                this.position = new fae.Vector(60, 128);

                this.interactive = true;
                this.buttonMode = true;

                this.hitArea = new PIXI.RoundedRectangle(-13, -13, 26, 27, 6);

                this.on("click", () => {
                    app.scene("main");
                });

                this.on("tap", () => {
                    app.scene("main");
                });

                this.alpha = 0;
                this.interactive = false;
                this.timeout(1600, "fadein");
            },

            update(dt) {
                if (this.fade) {
                    this.alpha += 0.03 * dt;
                    if (this.alpha >= 1) this.fade = false;
                }
            },

            fadein() {
                this.fade = true;
                this.interactive = true;
            }
        });
    },

    exit() {
        skull.queueDestroy();
        score.queueDestroy();
        highScore.queueDestroy();
        playButton.queueDestroy();
    }
});
