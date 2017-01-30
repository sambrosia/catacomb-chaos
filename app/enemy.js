import Vector from "./engine/vector.js";
import Entity from "./entity.js";

export default class Enemy extends Entity {
    constructor(texture) {
        super(texture);
        this.tint = 0xff0000;

        this.moveSpeed = 0.4;
        this.turnSpeed = 0.02;

        this.animationSpeed = 0.05;
        this.addAnimation("idle", 0, 3);
        this.addAnimation("walk", 4, 7);
    }

    process(target, others, dt) {
        // Clear debug graph
        this.graph.clear();

        // Chase target
        this.chase(target, 32);

        // Avoid clumping with other enemies
        for (const other of others) {
            if (other == this) continue;
            this.avoid(other, 16);
        }

        this.move(dt);

        // Play appropriate animation based on velocity
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            this.playAnimation("walk");
            if      (this.velocity.x < 0) this.scale.x = -1;
            else if (this.velocity.x > 0) this.scale.x = 1;
        } else {
            this.playAnimation("idle");
        }

    }
}
