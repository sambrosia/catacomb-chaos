import * as fae from "fae";
import { app } from "./app";

import { makeDungeon } from "./dungeon";
import "./main";

let logo, playButton, optionsButton;

app.scene("menu", {
    enter() {
        app.stage.dungeon.position = new fae.Vector(-4, 0);
        makeDungeon(8, 11);

        // TODO: Animate text?
        logo = [];
        for (const tex of ["skull", "catacomb", "chaos"]) {
            logo.push(app.e({
                components: ["sprite"],
                parent: app.stage.gui,

                ready() {
                    this.sprite.texture = app.resources.gui.textures["logo-" + tex + ".png"];
                }
            }));
        }

        let t = 0;
        logo[0].on("update", (dt) => {
            logo[0].y = 3 * Math.sin(t);
            t += dt / 60 * 2;
        });

        playButton = app.e({
            components: ["sprite"],
            parent: app.stage.gui,

            ready() {
                this.sprite.texture = app.resources.gui.textures["play-button.png"];
                this.sprite.anchor.set(0.5);
                this.position = new fae.Vector(40, 136);

                this.interactive = true;
                this.buttonMode = true;

                this.hitArea = new PIXI.RoundedRectangle(-13, -13, 26, 27, 6);

                this.on("pointertap", () => {
                    // TODO: detect whether user tapped or clicked so we can
                    // show appropriate graphic on first tutorial wave
                    app.resources.soundButton.sound.play();
                    app.scene("main");
                });
            }
        });

        optionsButton = app.e({
            components: ["sprite"],
            parent: app.stage.gui,

            ready() {
                this.sprite.texture = app.resources.gui.textures["fullscreen-button.png"];
                this.sprite.anchor.set(0.5);
                this.position = new fae.Vector(80, 136);

                this.interactive = true;
                this.buttonMode = true;

                this.hitArea = new PIXI.Circle(1, 1, 14);

                this.on("pointertap", () => {
                    app.resources.soundButton.sound.play();
                    // TODO: Make this a toggle
                    goFullscreen(app.view);
                });
            }
        });
    }
});

function goFullscreen(element) {
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.mozRequestFullscreen) element.mozRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
}
