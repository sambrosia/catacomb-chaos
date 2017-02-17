import * as fae from "fae";
import { app } from "./app";

export const explosionTemplate = {
    components: ["emitter", "collision"],
    parent: app.stage.characters,

    ready() {
        this.r = 10;
        this.killTimer = 100;

        this.emitOptions = {
            period: 20,
            lifetime: 500,
            area: 10,
            scale: 10,
            endScale: 20,
            endScaleRandom: 12,
            rotationRandom: 1.5,
            endRotationRandom: 1.5,
            endAlpha: 0.01,
            velocityRandom: new fae.Vector(0.5, 0.5)
        };

        this.sparks = app.e({
            components: ["emitter"],
            parent: this,

            ready() {
                this.emitOptions = {
                    period: 1,
                    lifetime: 600,
                    area: 4,
                    scale: 0.8,
                    endScaleRandom: 0.5,
                    velocityRandom: new fae.Vector(1.5, 1.5)
                };
            }
        });
    },

    update() {
        // TODO: Componentize this behaviour
        // Maybe a method like so:
        // this.timeout(100, "selfdestruct", args);

        this.killTimer -= app.ticker.elapsedMS;

        // TODO: See if calling queueDestroy() multiple times can cause bugs
        if (this.killTimer <= 0) {
            this.sparks.queueDestroy();
            this.queueDestroy();
        }

    },

    collided(other) {
        other.fire("hitbyexplosion", this);
    }
};
