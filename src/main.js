import * as fae from "fae";
import { app } from "./app";

import { playerTemplate } from "./player";
import { enemySpawnTemplate } from "./enemy";

app.scene("main", {
    enter() {
        const player = app.e(playerTemplate);
        app.player = player;

        const pauseButton = app.e({
            components: ["sprite"],
            parent: app.stage,


            ready() {
                this.sprite.texture = app.resources["pause-button"].texture;
                this.sprite.anchor.set(0.5);
                this.position = new fae.Vector(90, 140);

                this.interactive = true;
                this.buttonMode = true;

                this.on("click", () => {
                    if (app.ticker.started) {
                        this.sprite.texture = app.resources["unpause-button"].texture;
                        app.ticker.stop();
                    } else {
                        app.ticker.start();
                        this.sprite.texture = app.resources["pause-button"].texture;
                    }
                    app.ticker.update()
                }, this);

                this.on("tap", () => {
                    if (app.ticker.started) {
                        this.sprite.texture = app.resources["unpause-button"].texture;
                        app.ticker.stop();
                    } else {
                        app.ticker.start();
                        this.sprite.texture = app.resources["pause-button"].texture;
                    }
                    app.ticker.update()
                }, this);
            }
        });

        app.e({
            components: ["timeout"],

            ready() {
                this.fire("spawnwave", 5);
            },

            spawnwave(size) {
                size = Math.min(size, 10);

                for (let i = 0; i < size; i++) {
                    const enemy = app.e(enemySpawnTemplate);
                    enemy.x = Math.random() * (100 - 20) + 20;
                    enemy.y = Math.random() * (24 - 16) + 16;
                }

                this.timeout(3000, "spawnwave", size + 1);
            }
        });
    },

    exit() {

    }
});
