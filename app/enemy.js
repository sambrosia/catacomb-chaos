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

    process(dt, target, others) {
        // Chase target
        this.chase(target.position, 32);

        // Avoid clumping with other enemies
        for (const other of others) {
            if (other == this || other == target) continue;
            this.avoid(other, 16);
        }

        this.move(dt);
    }
}
