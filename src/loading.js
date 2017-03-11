import * as fae from "fae";
import { app } from "./app";

import "./menu";

app.scene("loading", {
    enter() {
        // TODO: Show nice loading screen

        // Start loading resources
        const startTime = new Date().getTime();

        app.loader.baseUrl = "assets";
        app.loader
        .add("sharpRetroFont", "fonts/Sharp-Retro.xml")
        .add("gui", "sprites/gui/spritesheet.json")

        .add("dungeon", "sprites/dungeon/spritesheet.json")
        .add("mage", "sprites/mage/spritesheet.json")
        .add("skeleton", "sprites/skeleton/spritesheet.json")
        .add("archer", "sprites/archer/spritesheet.json")

        .add("soundHurt", "sounds/hurt.wav")
        .add("soundDeath", "sounds/death.wav")
        .add("soundFireball", "sounds/foom.mp3")
        .add("soundExplosion1", "sounds/explosion1.wav")
        .add("soundExplosion2", "sounds/explosion2.wav")
        .add("soundExplosion3", "sounds/explosion3.wav")
        .add("soundExplosion4", "sounds/explosion4.wav")

        .add("soundArrowBurn", "sounds/arrowburn.wav")
        .add("soundArrowShoot", "sounds/arrowshoot.wav")

        .add("soundSpawn", "sounds/spawn1.mp3")

        .add("soundBGLoop", "sounds/victoriana.mp3")

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
            resources.soundBGLoop.sound.loop = true;
            resources.soundBGLoop.sound.volume = 3;

            resources.soundHurt.sound.volume = 2;
            resources.soundDeath.sound.volume = 2;
            resources.soundDeath.sound.speed = 0.75;

            resources.soundArrowShoot.sound.volume = 1.5;
            resources.soundSpawn.sound.volume = 0.5;


            const finishTime = new Date().getTime();
            console.log("Resources loaded in ", finishTime - startTime, "ms");

            app.scene("menu");
        });
    },

    exit() {
        // TODO: Hide/destroy nice loading screen

    }
});
