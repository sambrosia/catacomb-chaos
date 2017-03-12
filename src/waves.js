import * as fae from "fae";
import { app } from "./app";

import { skeletonTemplate } from "./skeleton";
import { archerTemplate } from "./archer";

export const waves = {
    // Intro/tutorial waves
    1: {
        spawn(next) {
            // Teaches how to shoot and guide fireballs
            next();
        }
    },

    2: {
        spawn(next) {
            // Introduce skeleton
            const skeleton = app.e(skeletonTemplate);
            skeleton.x = 60;
            skeleton.y = 24;
            skeleton.bind("kill", next);
        }
    },

    3: {
        spawn(next) {
            // Introduce archer
            const archer = app.e(archerTemplate);
            archer.x = 30;
            archer.y = 40;
            archer.bind("kill", next);
        }
    },

    4: {
        spawn(next) {
            // Spawn them together
            for (let i = 0; i < 3; i++) {
                const skeleton = app.e(skeletonTemplate);
                skeleton.x = Math.random() * (100 - 20) + 20;
                skeleton.y = Math.random() * (24 - 16) + 16;
                skeleton.bind("destroy", () => {
                    console.log(app.stage.characters.children.length);
                    if (app.stage.characters.children.length <= 2) next();
                });
            }

            const archer = app.e(archerTemplate);
            archer.x = 90;
            archer.y = 40;
            archer.bind("destroy", () => {
                console.log(app.stage.characters.children.length);
                if (app.stage.characters.children.length <= 2) next();
            });

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

            app.e({
                components: ["timeout"],
                parent: app.stage.characters,

                ready() { this.timeout(3000, "next"); },

                next() {
                    this.fire("kill");
                    next();
                },

                kill() { this.queueDestroy(); }
            });
        }
    }
};
