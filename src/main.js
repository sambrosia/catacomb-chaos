import * as fae from "fae";
import { app } from "./app";

import { playerTemplate } from "./player";
import { enemySpawnTemplate } from "./enemy";

app.scene("main", {
    enter() {
        const player = app.e(playerTemplate);
        app.player = player;

        for (let i = 0; i < 5; i++) {
            const enemy = app.e(enemySpawnTemplate);
            enemy.x = Math.random() * (100 - 20) + 20;
            enemy.y = Math.random() * (24 - 16) + 16;
        }
    },

    exit() {

    }
});
