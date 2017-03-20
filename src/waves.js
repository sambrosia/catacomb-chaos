import * as fae from "fae";
import { app } from "./app";

import { skeletonTemplate } from "./skeleton";
import { archerTemplate } from "./archer";

export const waves = {
    // Intro/tutorial waves
    1: {
        spawn(next) {
            // TODO: Teach how to shoot and guide fireballs
            next();
        }
    },

    2: {
        spawn(next) {
            // Introduce skeleton
            const skeleton = app.e(skeletonTemplate);
            skeleton.x = 60;
            skeleton.y = 24;
            skeleton.on("kill", next);
        }
    },

    3: {
        spawn(next) {
            // Introduce archer
            const archer = app.e(archerTemplate);
            archer.x = 30;
            archer.y = 40;
            archer.on("kill", next);
        }
    },

    4: {
        spawn(next) {
            // Spawn them together
            for (let i = 0; i < 3; i++) {
                const skeleton = app.e(skeletonTemplate);
                skeleton.x = Math.random() * (100 - 20) + 20;
                skeleton.y = Math.random() * (24 - 16) + 16;
            }

            const archer = app.e(archerTemplate);
            archer.x = 90;
            archer.y = 40;

            // TODO: When all dead, do next wave
        }
    },

    // Normal waves
    5: {
        spawn(next, currentWave) {
            let n = 4;
            if (currentWave >= 10) n = 5;
            if (currentWave >= 15) n = 6;
            for (let i = 0; i < n; i++) {
                const skeleton = app.e(skeletonTemplate);
                skeleton.x = Math.random() * (100 - 20) + 20;
                skeleton.y = Math.random() * (24 - 16) + 16;
            }

            const archer = app.e(archerTemplate);
            archer.x = Math.random() * (100 - 20) + 20;
            archer.y = Math.random() * (48 - 32) + 32;

            // TODO: Spawn next wave every 3 seconds
        }
    }
};
