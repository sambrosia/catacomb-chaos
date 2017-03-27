import * as fae from "fae";
import { app } from "./app";

import "./menu";

let container;

app.scene("settings", {
    enter() {
        container = app.e({
            parent: app.stage.gui,

            ready() {
                this.x = 19;
                this.y = 9;

                this.alpha = 0;
                this.fading = true;
            },

            update(dt) {
                if (this.fading) this.alpha += 0.05 * dt;
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
                this.y = 8;
                this.setText("Created by");
            }
        });
        app.e({
            components: ["mediumText"],
            parent: container,

            ready() {
                this.y = 7;
                this.setText("Sam Woodruff");
            }
        });

        // With sounds by
        // app.e({
        //     components: ["smallText"],
        //     parent: container,
        //
        //     ready() {
        //         this.y = 20;
        //         this.setText("Sounds");
        //     }
        // });
        // app.e({
        //     components: ["mediumText"],
        //     parent: container,
        //
        //     ready() {
        //         this.y = 19;
        //         this.setText("SOUND_GUYS");
        //     }
        // });

        // And music by
        // app.e({
        //     components: ["smallText"],
        //     parent: container,
        //
        //     ready() {
        //         this.y = 40;
        //         this.setText("Music");
        //     }
        // });
        // app.e({
        //     components: ["mediumText"],
        //     parent: container,
        //
        //     ready() {
        //         this.y = 39;
        //         this.setText("MUSIC_GUY");
        //     }
        // });

        // TODO:
        // Back button
        // Disable analytics button
        // Toggle fullscreen button
        // Mute music button
        // Mute sound button?

        // Privacy
        app.e({
            components: ["smallText"],
            parent: container,

            ready() {
                this.y = 133;
                this.setText("Privacy");

                this.underline = this.addChild(new PIXI.Graphics());
                this.underline.lineStyle(1, this.text.tint)
                .moveTo(0, 6.5)
                .lineTo(this.text.textWidth - 1, 6.5);

                this.interactive = true;
                this.buttonMode = true;

                // TODO: Link to policy
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
        container.on("update", (dt) => {
            this.alpha -= 0.1 * dt;
            if (this.alpha < 0) next();
        });
    }
});
