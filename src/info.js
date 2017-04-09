import * as fae from "fae";
import { app } from "./app";

let container;

app.scene("info", {
    enter() {
        const guiTex = app.resources.gui.textures;

        container = app.e({
            parent: app.stage.gui,
            ready() {
                this.x = 19;
                this.y = 9;

                this.alpha = 0;
                this.deltaAlpha = 0.05;
                this.fading = true;
            },

            update(dt) {
                if (this.fading) this.alpha += this.deltaAlpha * dt;
                if (this.alpha > 1) {
                    this.alpha = 1;
                    this.fading = false;
                }
            }
        });

        // Created by
        app.e({
            components: ["smallText"],
            parent: container,
            ready() {
                this.y = 16;
                this.setText("Created by");
            }
        });
        app.e({
            components: ["mediumText"],
            parent: container,

            ready() {
                this.x = 1;
                this.y = 15;
                this.setText("Sam Woodruff");
            }
        });

        app.e({
            components: ["sprite"],
            parent: container,
            ready() {
                this.interactive = true;
                this.buttonMode = true;

                this.sprite.anchor.set(0.5);
                this.position = new fae.Vector(41, 104);
                this.hitArea = new PIXI.Circle(1, 1, 14);

                this.sprite.texture = guiTex["back-button.png"];

                this.on("pointertap", () => {
                    app.scene("menu");
                });
            }
        });

        // Privacy
        app.e({
            components: ["smallText"],
            parent: container,
            ready() {
                this.y = 124;
                this.setText("Privacy");

                this.underline = this.addChild(new PIXI.Graphics());
                this.underline.lineStyle(1, this.text.tint)
                .moveTo(0, 6.5)
                .lineTo(this.text.textWidth - 1, 6.5);

                this.interactive = true;
                this.buttonMode = true;

                this.on("pointertap", () => {
                    window.open("http://www.gameanalytics.com/privacy");
                });
            }
        });

        app.e({
            components: ["smallText"],
            parent: container,
            ready() {
                this.y = 133;
                this.text.tint = 0x72ee97;
                this.setText("Disable Analytics");

                this.underline = this.addChild(new PIXI.Graphics());
                this.underline.lineStyle(1, this.text.tint)
                .moveTo(0, 6.5)
                .lineTo(this.text.textWidth - 1, 6.5);

                this.interactive = true;
                this.buttonMode = true;
                this.toggled = true;

                // TODO: toggle analytics
                this.on("pointertap", () => {
                    if (this.toggled) {
                        this.text.tint = 0x72ee97;
                        this.setText("Disable Analytics");
                    } else {
                        this.text.tint = 0xf64f5e;
                        this.setText("Enable Analytics");
                    }
                    this.underline.clear()
                    .lineStyle(1, this.text.tint)
                    .moveTo(0, 6.5)
                    .lineTo(this.text.textWidth - 1, 6.5);

                    this.toggled = !this.toggled;
                });
            }
        });

        // Copyright
        app.e({
            components: ["smallText"],
            parent: container,
            ready() {
                this.y = 142;
                this.setText("(c) 2017 Sam Woodruff");
            }
        });
    },

    exit(next) {
        container.deltaAlpha = -0.1;
        container.fading = true;
        container.on("update", (dt) => {
            if (container.alpha <= 0) {
                next();
            }
        });
    }
});
