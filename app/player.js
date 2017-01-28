import Character from "./character.js";

export default class Player extends Character {
    constructor(textures) {
        super(textures);

        this.spellCharge = 0;
        this.maxCharge = 2;
    }
    blink(x, y) {
        this.position.set(x, y);
        this.move(0);
    }
}
