import Character from "./character.js";
import Vector from "./engine/vector.js";

export default class Enemy extends Character {
    constructor(texture) {
        super(texture);
        this.tint = 0xff0000;

        this.moveSpeed = 0.4;
        this.turnSpeed = 0.02;
    }
}
