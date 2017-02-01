import { app } from "./engine/engine.js";
import Vector from "./engine/vector.js";
import Entity from "./entity.js";
import { Fireball } from "./fireball.js";

export default class Player extends Entity {
    constructor(textures) {
        super(textures);

        this.moveSpeed = 0.8;
        this.turnSpeed = 0.08;

        this.charging = null;
        this.fContainer = null;

        this.animationSpeed = 0.1;
        this.addAnimation("idle", 0, 3);
        this.addAnimation("walk", 4, 7);
    }

    onMouseDown(event) {
        // Create fireball
        if (!this.charging && app.input.mousePos.subtract(this.position).length < 64) {
            this.charging = this.fContainer.addChild(new Fireball(10));
            this.charging.position.set(this.x, this.y - 12);
        }
    }

    onMouseUp(event) {
        // Stop charging
        this.charging = null;
    }

    process(dt) {
        // Chase mouse
        if (app.input.isMouseDown[2]) this.chase(app.input.mousePos, 3);

        // Move player
        this.move(dt);

        // Stop charging if mouse moves away from player
        if (this.charging && app.input.mousePos.subtract(this.position).length > 64) {
            this.charging = null;
        }

        // Charge fireball
        if (this.charging && this.charging.size < 20) {
            this.charging.resize(this.charging.size + app.ticker.elapsedMS / 200);
        }
    }
}
