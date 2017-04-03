import * as fae from "fae";
import { app } from "./app";

let score, highScore, gold, playButton, healthPotionButton, manaPotionButton;

app.scene("gameover", {
    enter() {
        score = app.e({
            components: ["motion", "largeText"],
            parent : app.stage.gui,

            ready() {
                this.setText(app.score);

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
            components: ["motion", "mediumText"],
            parent : app.stage.gui,

            ready() {
                this.text.tint = 0x9af9b7;
                this.stroke.color = 0x2dd96a;
                this.setText("high: " + app.highScore);

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
            components: ["motion", "mediumText"],
            parent : app.stage.gui,

            ready() {
                this.text.tint = 0xffce7a;
                this.stroke.color = 0xfbae2b;
                this.text.y = -10;
                this.stroke.y = -10;

                // TODO: Componentize purse icon
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

                this.updateText = (amt) => {
                    this.setText(amt);
                    this.position = new fae.Vector(60 - this.width/2 + this.icon.width, 58);
                };
                this.updateText(app.purse.gold);
                app.event.on("goldchanged", this.updateText, this);

                this.alpha = 0;
                this.timeout(400, () => { this.fade = true; });
            },

            update(dt) {
                if (this.fade) {
                    this.alpha += 0.03 * dt;
                    if (this.alpha >= 1) this.fade = false;
                }
            },

            destroy() {
                app.event.removeListener("goldchanged", this.updateText);
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

        healthPotionButton = app.e({
            components: ["sprite", "motion"],
            parent: app.stage.gui,

            ready() {
                this.sprite.texture = app.resources.gui.textures["potion-health.png"];
                this.sprite.anchor.set(0.5);
                this.position = new fae.Vector(40, 90);

                this.interactive = true;
                this.buttonMode = true;

                this.on("pointertap", () => {
                    app.purse.buyPotion("health");
                    // TODO: Update gold counter
                });

                this.addChild(app.e({
                    components: ["smallText"],
                    ready() {
                        this.text.tint = 0xffce7a;
                        this.setText("50 gp");

                        this.x = -this.text.textWidth / 2;
                        this.y = -12;
                    }
                }));

                this.addChild(app.e({
                    components: ["mediumText"],
                    ready() {
                        this.text.tint = 0xff9daa;
                        this.stroke.color = 0xf64f5e;
                        this.y = 1;
                    },
                    update() {
                        this.setText(app.purse.potions.health);
                        this.x = -this.text.textWidth / 2;
                    }
                }));

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

        manaPotionButton = app.e({
            components: ["sprite", "motion"],
            parent: app.stage.gui,

            ready() {
                this.sprite.texture = app.resources.gui.textures["potion-mana.png"];
                this.sprite.anchor.set(0.5);
                this.position = new fae.Vector(80, 90);

                this.interactive = true;
                this.buttonMode = true;

                this.on("pointertap", () => {
                    app.purse.buyPotion("mana");
                    // TODO: Update gold counter
                });

                this.addChild(app.e({
                    components: ["smallText"],
                    ready() {
                        this.text.tint = 0xffce7a;
                        this.setText("10 gp");

                        this.x = -this.text.textWidth / 2;
                        this.y = -12;
                    }
                }));

                this.addChild(app.e({
                    components: ["mediumText"],
                    ready() {
                        this.text.tint = 0xafe1ff;
                        this.stroke.color = 0x4a9ef1;
                        this.y = 1;
                    },
                    update() {
                        this.setText(app.purse.potions.mana);
                        this.x = -this.text.textWidth / 2;
                    }
                }));

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

        healthPotionButton.on("update", (dt) => {
            healthPotionButton.velocity.x -= 0.3 * dt;
        });

        manaPotionButton.on("update", (dt) => {
            manaPotionButton.velocity.x += 0.3 * dt;
        });

        playButton.timeout(400, next);
    }
});
