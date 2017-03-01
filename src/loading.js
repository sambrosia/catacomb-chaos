import * as fae from "fae";
import { app } from "./app";

import "./menu";

app.scene("loading", {
    enter() {
        // TODO: Show nice loading screen

        // Start loading resources
        const startTime = new Date().getTime();

        // TODO: Combine gui/title elements into a spritesheet
        // TODO: load sounds
        app.loader.baseUrl = "/assets";
        app.loader
        .add("logo", "/sprites/title/logo.png")
        .add("logo-skull", "/sprites/title/logo-skull.png")
        .add("logo-catacomb", "/sprites/title/logo-catacomb.png")
        .add("logo-chaos", "/sprites/title/logo-chaos.png")
        .add("logo-chaos-mask", "/sprites/title/logo-chaos-mask.png")

        .add("play-button", "/sprites/title/play-button.png")
        .add("options-button", "/sprites/title/options-button.png")
        .add("fullscreen-button", "/sprites/title/fullscreen-button.png")

        .add("pause-button", "/sprites/gui/pause-button.png")
        .add("unpause-button", "/sprites/gui/unpause-button.png")

        .add("heart-full", "/sprites/gui/full-heart.png")
        .add("heart-empty", "/sprites/gui/empty-heart.png")
        .add("crystal-full", "/sprites/gui/full-crystal.png")
        .add("crystal-empty", "/sprites/gui/empty-crystal.png")

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
