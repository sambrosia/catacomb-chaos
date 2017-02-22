import * as fae from "fae";
import { app } from "./app";

import { fireballTemplate } from "./fireball";

export const playerTemplate = {
    components: ["animatedsprite"],
    parent: app.stage.characters,

    ready() {
        this.as.anchor.set(0.5, 1);
        this.position = new fae.Vector(240/4, 600/4);

        this.as.textures = this.app.resources.mage.array;

        this.as.addAnimation("idle", {
            speed: 4,
            start: 0,
            end: 3
        });

        this.as.playAnimation("idle");

        // TODO: only fire if not clicking on gui
        app.stage.on("pointerdown", () => {
            if (app.ticker.started) {
                const fireball = app.e(fireballTemplate);
                fireball.position = new fae.Vector(this.x, this.y - 12);

                this.scale.x = this.app.input.pointerPos.x < this.x ? -1 : 1;
            }
        }, this);
    }
};