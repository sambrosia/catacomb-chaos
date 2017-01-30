import { app } from "./engine/engine.js";
import Vector from "./engine/vector.js";
import Entity from "./entity.js";

export default class Player extends Entity {
    constructor(textures) {
        super(textures);

        this.moveSpeed = 0.8;
        this.turnSpeed = 0.08;

        this.spellCharge = 0;
        this.maxCharge = 2;
        this.chargeRate = 2;

        this.animationSpeed = 0.1;
        this.addAnimation("idle", 0, 3);
        this.addAnimation("walk", 4, 7);
    }

    process(dt) {
        // Clear debug graph
        this.graph.clear();

        // Chase mouse
        this.chase(app.input.mousePos, 3);

        // Move player
        this.move(dt);

        // Play appropriate animation based on velocity
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            this.playAnimation("walk");
            if      (this.velocity.x < 0) this.scale.x = -1;
            else if (this.velocity.x > 0) this.scale.x = 1;
        } else {
            this.playAnimation("idle");
        }

        // Charge spell
        if (app.input.isMouseDown[0] && this.spellCharge < this.maxCharge) {
            this.spellCharge += app.ticker.elapsedMS / 1000 * this.chargeRate;
            if (this.spellCharge > this.maxCharge) this.spellCharge = this.maxCharge;
        }

        // Cast spell
        if (this.spellCharge > 0 && !app.input.isMouseDown[0]) {
            // TODO: Call spell code here
            console.log("Casting spell at " + this.spellCharge + " power");

            this.spellCharge = 0;
        }
    }
}
