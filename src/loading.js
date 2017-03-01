import * as fae from "fae";
import { app } from "./app";

import "./menu";

app.scene("loading", {
    enter() {
        // TODO: Show nice loading screen

        // Start loading resources
        const startTime = new Date().getTime();

        // TODO: load sounds
        app.loader.baseUrl = "/assets";
        app.loader
        .add("gui", "/sprites/gui/spritesheet.json")
        .add("dungeon", "/sprites/dungeon/spritesheet.json")
        .add("mage", "/sprites/mage/spritesheet.json")
        .add("skeleton", "/sprites/skeleton/spritesheet.json")
        .add("archer", "/sprites/archer/spritesheet.json")
        .use((resource, next) => {
            if (resource.extension == "json") {
                resource.array = [];
                for (const t in resource.textures) {
                    resource.array.push(resource.textures[t]);
                }
            }
            next();
        })
        .load((loader, res) => {
            const finishTime = new Date().getTime();
            console.log("Resources loaded in ", finishTime - startTime, "ms");

            app.scene("menu");
        });
    },

    exit() {
        // TODO: Hide/destroy nice loading screen

    }
});
