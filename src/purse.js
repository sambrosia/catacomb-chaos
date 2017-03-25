import * as fae from "fae";
import { app } from "./app";

export default class Purse {
    constructor(app) {
        this.app = app;
        this.gold = Number(window.localStorage.getItem("catacombChaosGold") || 0);

        // TODO: Don't forget to remove this debug thing
        app.input.on("keydown", (key) => {
            if (key == " ") {
                this.gold = 0;
            }
        });
    }

    addGold(n) {
        if (n <= 0) return;

        const playSoundAndBumpGold = (speed) => {
            app.resources.soundCoin.sound.play({ speed: speed });
            this.gold++;
        };

        for (let i = 0; i < n; i ++) {
            const speed = 0.8 + i * 0.3 / n;
            app.timeout(i * 100 + Math.random() * 20, playSoundAndBumpGold, speed);
        }
    }

    createGoldEffect(n, pos) {

    }
}
