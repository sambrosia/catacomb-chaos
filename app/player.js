import { app } from "./engine/engine.js";
import Vector from "./engine/vector.js";
import Entity from "./entity.js";
import { Fireball } from "./fireball.js";

export default class Player extends Entity {
    constructor(textures) {
        super(textures);

        this.fireball = null;
        this.fireContainer = null;

        this.animationSpeed = 0.1;
        this.addAnimation("idle", 0, 3);
        this.playAnimation("idle");
    }

    onMouseDown(event) {
        // Create fireball
        if (!this.fireball) {
            this.fireball = this.fireContainer.addChild(new Fireball(10));
            this.fireball.position.set(this.x, this.y - 12);
        }
    }

    onMouseUp(event) {
        // Stop charging
        this.fireball = null;
    }
}
