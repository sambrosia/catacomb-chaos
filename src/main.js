import * as fae from "fae";
import { app } from "./app";

import { makeDungeon } from "./dungeon";
import { playerTemplate } from "./player";
import { enemyTemplate } from "./enemy";

app.scene("main", {
    enter() {
        app.stage.dungeon.x += 12;
        makeDungeon(6, 10);

        const player = app.e(playerTemplate);

        for (let i = 0; i < 10; i++) {
            const e = app.e(enemyTemplate);
            e.x = Math.random() * 480 / 4;
            e.y = 32 + Math.random() * 64;
        }
    },

    exit() {

    }
});
