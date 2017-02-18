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
        .add("red-jewel", "/sprites/title/red-jewel.png")
        .add("play-button", "/sprites/title/play-button.png")
        .add("options-button", "/sprites/title/options-button.png")
        .add("fullscreen-button", "/sprites/title/fullscreen-button.png")

        .add("dungeon", "/sprites/dungeon/spritesheet.json")
        .add("mage", "/sprites/mage/spritesheet.json")
        .add("skeleton", "/sprites/skeleton/spritesheet.json")

        .use((resource, next) => {
            if (resource.extension == "json") {
                resource.array = [];
                for (const t in resource.textures) {
                    resource.array.push(resource.textures[t]);
                }
            }
            next();
        })
        .load((loader, resources) => {
            const finishTime = new Date().getTime();
            console.log("Resources loaded in ", finishTime - startTime, "ms");

            app.scene("menu");
        });
    },

    exit() {
        // TODO: Hide/destroy nice loading screen

    }
});
