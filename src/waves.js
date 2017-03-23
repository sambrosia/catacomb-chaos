import * as fae from "fae";
import { app } from "./app";

import { skeletonTemplate } from "./skeleton";
import { ghostSkeletonTemplate } from "./ghost-skeleton";
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

            const nextIfCleared = () => {
                if (app.groups.enemy.size === 0) {
                    app.event.removeListener("entitydestroyed", nextIfCleared);
                    next();
                }
            };

            app.event.on("entitydestroyed", nextIfCleared);
        }
    },

    // Normal waves
    5: {
        spawn(next, currentWave) {
            let n = 4;
            if (currentWave >= 10) n = 5;
            if (currentWave >= 15) n = 6;
            for (let i = 0; i < n; i++) {
                const template = i < 4 ? skeletonTemplate : ghostSkeletonTemplate;
                const skeleton = app.e(template);
                skeleton.x = Math.random() * (100 - 20) + 20;
                skeleton.y = Math.random() * (24 - 16) + 16;
            }

            const archer = app.e(archerTemplate);
            archer.x = Math.random() * (100 - 20) + 20;
            archer.y = Math.random() * (48 - 32) + 32;

            app.e({
                ready() {
                    this.timeout(3000, next);
                    app.event.once("spawningwave", () => {
                        this.destroy();
                    });
                }
            });
        }
    }
};
