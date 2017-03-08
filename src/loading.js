import * as fae from "fae";
import { app } from "./app";

import "./menu";

app.scene("loading", {
    enter() {
        // TODO: Show nice loading screen

        // Start loading resources
        const startTime = new Date().getTime();

        // TODO: load sounds
        app.loader.baseUrl = "assets";
        app.loader
        .add("sharpRetroFont", "fonts/Sharp-Retro.xml")
        .add("gui", "sprites/gui/spritesheet.json")
        .add("dungeon", "sprites/dungeon/spritesheet.json")
        .add("mage", "sprites/mage/spritesheet.json")
        .add("skeleton", "sprites/skeleton/spritesheet.json")
        .add("archer", "sprites/archer/spritesheet.json")
        .use((res, next) => {
            if (res.extension == "json") {
                const keys = [];
                for (const key in res.textures) keys.push(key);
                keys.sort();

                res.array = [];
                for (const key of keys) res.array.push(res.textures[key]);
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
