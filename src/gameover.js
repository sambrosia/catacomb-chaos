import * as fae from "fae";
import { app } from "./app";

let score, highScore, gold, playButton;

app.scene("gameover", {
    enter() {
        score = app.e({
            components: ["motion"],
            parent : app.stage.gui,

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

                this.position = new fae.Vector(60 - this.text.textWidth/2, 8);

                this.alpha = 0;
                this.fade = true;
            },

            update(dt) {
                if (this.fade) {
                    this.alpha += 0.03 * dt;
                    if (this.alpha >= 1) this.fade = false;
                }
            }
        });

        // TODO: Show previous highscore if new score beats it
        highScore = app.e({
            components: ["motion"],
            parent : app.stage.gui,

            ready() {
                this.stroke = this.addChild(new PIXI.Graphics());
                this.text = new PIXI.extras.BitmapText("", {font: "16px Sharp-Retro"});
                this.addChild(this.text);

                this.text.tint = 0x9af9b7;
                this.text.text = "high: " + app.highScore;
                this.stroke
                .beginFill(0x2dd96a)
                .drawRect(-1, 6, this.text.textWidth + 2, this.text.textHeight - 14)
                .endFill();

                this.position = new fae.Vector(60 - this.text.textWidth/2, 36);

                this.alpha = 0;
                this.timeout(200, () => { this.fade = true; });
            },

            update(dt) {
                if (this.fade) {
                    this.alpha += 0.03 * dt;
                    if (this.alpha >= 1) this.fade = false;
                }
            }
        });

        gold = app.e({
            components: ["motion"],
            parent : app.stage.gui,

            ready() {
                this.stroke = this.addChild(new PIXI.Graphics());
                this.text = new PIXI.extras.BitmapText("", {font: "16px Sharp-Retro"});
                this.addChild(this.text);

                this.text.tint = 0xffce7a;
                this.text.text = app.purse.gold;
                this.stroke
                .beginFill(0xfbae2b)
                .drawRect(-1, 6, this.text.textWidth + 2, this.text.textHeight - 14)
                .endFill();

                const guiTex = app.resources.gui.textures;

                this.icon = app.e({
                    components: ["sprite"],
                    ready() {
                        this.sprite.texture = guiTex["purse-overflowing.png"];
                        this.sprite.anchor.set(1, 0.5);
                    }
                });
                this.addChild(this.icon);

                if (app.purse.gold < 10) {
                    this.icon.sprite.texture = guiTex["purse-empty.png"];
                }
                else if (app.purse.gold < 30) {
                    this.icon.sprite.texture = guiTex["purse-middling.png"];
                }
                else if (app.purse.gold < 50) {
                    this.icon.sprite.texture = guiTex["purse-full.png"];
                }
                else {
                    this.icon.sprite.texture = guiTex["purse-overflowing.png"];
                }

                this.text.y = -10;
                this.stroke.y = -10;
                this.position = new fae.Vector(60 - this.width/2 + this.icon.width, 58);

                this.alpha = 0;
                this.timeout(400, () => { this.fade = true; });
            },

            update(dt) {
                if (this.fade) {
                    this.alpha += 0.03 * dt;
                    if (this.alpha >= 1) this.fade = false;
                }
            }
        });

        playButton = app.e({
            components: ["sprite", "motion"],
            parent: app.stage.gui,

            ready() {
                this.sprite.texture = app.resources.gui.textures["play-button.png"];
                this.sprite.anchor.set(0.5);
                this.position = new fae.Vector(60, 136);

                this.interactive = true;
                this.buttonMode = true;

                this.hitArea = new PIXI.RoundedRectangle(-13, -13, 26, 27, 6);

                this.on("pointertap", () => {
                    app.resources.soundButton.sound.play();
                    app.scene("main");
                });

                this.alpha = 0;
                this.interactive = false;
                this.timeout(600, () => {
                    this.fade = true;
                    this.interactive = true;
                });
            },

            update(dt) {
                if (this.fade) {
                    this.alpha += 0.03 * dt;
                    if (this.alpha >= 1) this.fade = false;
                }
            }
        });
    },

    exit(next) {
        playButton.interactive = false;
        playButton.on("update", (dt) => {
            playButton.velocity.y += 0.5 * dt;
        });

        score.on("update", (dt) => {
            score.velocity.x -= 0.6 * dt;
        });

        highScore.on("update", (dt) => {
            highScore.velocity.x += dt;
        });

        gold.on("update", (dt) => {
            gold.velocity.x -= 0.3 * dt;
        });

        playButton.timeout(400, next);
    }
});
