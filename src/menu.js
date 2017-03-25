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
            components: ["sprite", "motion"],
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
            components: ["sprite", "motion"],
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
                    toggleFullscreen(app.view);
                });
            }
        });

        // TODO: Button for Info/credit screen

    },

    exit(next) {
        playButton.interactive = false;
        playButton.on("update", (dt) => {
            playButton.velocity.y += 0.3 * dt;
        });

        optionsButton.timeout(100, () => {
            optionsButton.interactive = false;
            optionsButton.on("update", (dt) => {
                optionsButton.velocity.y += 0.3 * dt;
            });
        });

        for (let i = 0; i < logo.length; i++) {
            logo[i].on("update", (dt) => {
                logo[i].alpha -= 0.03 * (1 + i) * dt;
            });
        }

        playButton.timeout(600, next);
    }
});

function toggleFullscreen(element) {
    if (document.fullscreenElement == element) document.exitFullscreen();
    else if (document.webkitFullscreenElement == element) document.webkitExitFullscreen();
    else if (document.mozRequestFullscreen == element) document.mozExitFullscreen();
    else if (document.msRequestFullscreen == element) document.msExitFullscreen();

    else if (element.requestFullscreen) element.requestFullscreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.mozRequestFullscreen) element.mozRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
}
