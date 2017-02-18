import * as fae from "fae";
import { app } from "./app";

export const explosionTemplate = {
    components: ["emitter", "collision", "timeout"],
    parent: app.stage.characters,

    ready() {
        this.r = 10;

        this.emitOptions = {
            period: 30,
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
                    velocityRandom: new fae.Vector(2, 2)
                };
            }
        });

        this.timeout(150, "kill");
    },

    kill() {
        this.sparks.queueDestroy();
        this.queueDestroy();
    },

    collided(other) {
        other.fire("hitbyexplosion", this);
    }
};
