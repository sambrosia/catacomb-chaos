import * as fae from "fae";
import { app } from "./app";

import "./main";

let playButton, optionsButton;

app.scene("menu", {
    enter() {
        // const jewel = app.e({
        //     components: ["sprite"],
        //     parent: app.stage,
        //
        //     ready() {
        //         this.sprite.texture = app.resources["red-jewel"].texture;
        //         this.sprite.anchor.set(0.5);
        //         this.position = new fae.Vector(60, 48);
        //     }
        // });

        playButton = app.e({
            components: ["sprite"],
            parent: app.stage,

            ready() {
                this.sprite.texture = app.resources["play-button"].texture;
                this.sprite.anchor.set(0.5);
                this.position = new fae.Vector(32, 128);

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

        optionsButton = app.e({
            components: ["sprite"],
            parent: app.stage,

            ready() {
                this.sprite.texture = app.resources["fullscreen-button"].texture;
                this.sprite.anchor.set(0.5);
                this.position = new fae.Vector(88, 128);

                this.interactive = true;
                this.buttonMode = true;

                this.hitArea = new PIXI.Circle(1, 1, 14);

                this.on("click", () => {
                    app.view.webkitRequestFullscreen();
                });

                this.on("tap", () => {
                    app.view.webkitRequestFullscreen();
                });
            }
        });
    },

    exit() {
        // TODO: Clean up for gameplay
        playButton.queueDestroy();
        optionsButton.queueDestroy();
    }
});
