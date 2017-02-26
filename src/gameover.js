import * as fae from "fae";
import { app } from "./app";

let playButton, score, highScore;

app.scene("gameover", {
    enter() {
        score = app.e({
            components: ["text"],
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
            }
        });

        // TODO: Save highscore in browser
        if (app.score > app.highScore) app.highScore = app.score;

        highScore = app.e({
            components: ["text"],
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
            }
        });

        playButton = app.e({
            components: ["sprite"],
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
            }
        });
    },

    exit() {
        // TODO: Clear scene
        score.queueDestroy();
        highScore.queueDestroy();
        playButton.queueDestroy();
    }
});
