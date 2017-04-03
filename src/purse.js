import * as fae from "fae";
import { app } from "./app";

const prefix = "catacombChaos";

export default class Purse {
    constructor(app) {
        this.app = app;
        this.potions = {
            health: Number(localStorage.getItem(prefix + "PotionsHealth") || 0),
            mana: Number(localStorage.getItem(prefix + "PotionsMana") || 0)
        };
        this.gold = Number(localStorage.getItem(prefix + "Gold") || 0);

        // TODO: Don't forget to remove this debug thing
        app.input.on("keydown", (key) => {
            if (key == "0") {
                this.gold = 0;
            }
            else if (key == "1") {
                this.addGold(1);
            }
            else if (key == "2") {
                this.addGold(10);
            }
            else if (key == "3") {
                this.addGold(100);
            }

            else if (key == "h") {
                this.buyPotion("health");
            }
            else if (key == "m") {
                this.buyPotion("mana");
            }
        });
    }

    addGold(n) {
        if (n < 0) return;

        const playSoundAndBumpGold = (i) => {
                const speed = 0.8 + i * 0.3 / n;
                app.resources.soundCoin.sound.play({ speed: speed });
                this.gold++;
                app.event.emit("goldchanged", this.gold);
            };

        for (let i = 0; i < Math.abs(n); i ++) {
            app.timeout(i * 100 + Math.random() * 20, playSoundAndBumpGold, i);
        }
    }

    buyPotion(type) {
        let price;

        switch (type) {
            case "health":
                price = 50;
                break;

            case "mana":
                price = 10;
                break;

            default:
                return;
        }

        if (this.gold < price) {
            app.resources.soundNegative.sound.play();
            return;
        }

        this.potions[type]++;
        this.gold -= price;

        app.resources.soundSpendCoin.sound.play();
        app.event.emit("goldchanged", this.gold);
        app.event.emit("potionchanged", this.potions[type], type);
    }
}
