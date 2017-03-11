import * as fae from "fae";
import { app } from "./app";

let skull, score, highScore, playButton;

app.scene("gameover", {
    enter() {
        app.resources.soundDeath.sound.play();

        skull = app.e({
            components: ["sprite", "timeout"],
            parent: app.stage,

            ready() {
                this.sprite.texture = app.resources.gui.textures["logo-skull.png"];
                this.y = 32;

                this.alpha = 0;
                this.fadingIn = true;

                this.timeout(1000, "fadeout");

                this.timer = 0;
            },

            update(dt) {
                if (this.alpha < 0) this.queueDestroy();

                if (this.fadingIn) {
                    this.alpha += 0.08 * dt;
                }
                else {
                    this.alpha -= 0.03 * dt;
                }

                this.y = 32 + 3 * Math.sin(this.timer);
                this.timer += dt / 60 * 2;
            },

            fadeout() {
                this.alpha = 1;
                this.fadingIn = false;
            }
        });

        // TODO: Fix text not centered
        score = app.e({
            components: ["timeout"],
            parent : app.stage,

            ready() {
                this.stroke = this.addChild(new PIXI.Graphics());
                this.text = new PIXI.extras.BitmapText("", {font: "32px Sharp-Retro"});
                this.addChild(this.text);

                this.text.tint = 0xccd5ff;
                this.text.text = app.score;
                this.stroke
                .beginFill(0x505ea1)
                .drawRect(-2, 12, this.text.textWidth + 4, this.text.textHeight - 28)
                .endFill();

                this.position = new fae.Vector(60 - this.width/2, 24);

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

        if (app.score > app.highScore) {
            app.highScore = app.score;
            window.localStorage.setItem("catacombChaosHighScore", app.highScore);
        }

        // TODO: Show old highscore if new score beats it
        highScore = app.e({
            components: ["timeout"],
            parent : app.stage,

            ready() {
                this.stroke = this.addChild(new PIXI.Graphics());
                this.text = new PIXI.extras.BitmapText("", {font: "16px Sharp-Retro"});
                this.addChild(this.text);

                this.text.tint = 0x9af9b7;
                this.text.text = "best: " + app.highScore;
                this.stroke
                .beginFill(0x2dd96a)
                .drawRect(-1, 6, this.text.textWidth + 2, this.text.textHeight - 14)
                .endFill();

                this.position = new fae.Vector(60 - this.width/2, 52);

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

        playButton = app.e({
            components: ["sprite", "timeout"],
            parent: app.stage,

            ready() {
                this.sprite.texture = app.resources.gui.textures["play-button.png"];
                this.sprite.anchor.set(0.5);
                this.position = new fae.Vector(60, 128);

                this.interactive = true;
                this.buttonMode = true;

                this.hitArea = new PIXI.RoundedRectangle(-13, -13, 26, 27, 6);

                this.onClick = () => {
                    app.resources.soundButton.sound.play();
                    app.scene("main");
                };

                this.on("click", this.onClick);
                this.on("tap", this.onClick);

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
