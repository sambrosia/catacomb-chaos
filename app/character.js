import { app } from "./engine/engine.js";
import AnimatedSprite from "./engine/animatedsprite.js";
import Vector from "./engine/vector.js";

// Common functionality for player and enemies
export default class Character extends AnimatedSprite {
    constructor(textures) {
        super(textures);
        this.anchor.set(0.5, 1);

        this.velocity = new Vector(0, 0);
        this.moveSpeed = 0.8;
        this.turnSpeed = 0.1;
    }

    move(velocityScale) {
        // Move character
        // FIXME: constrain to room
        let posVec = new Vector(this.x, this.y);
        this.position = posVec.add(this.velocity.multiply(velocityScale));
    }

    chase(target) {
        // Get desired velocity
        let targetVec = new Vector(target.x, target.y);
        let desired = targetVec
            .subtract(this.position)
            .normalize()
            .multiply(this.moveSpeed);

        // Calculate steering force
        let steering = desired.subtract(this.velocity).truncate(this.turnSpeed);

        // Integrate steering force with current velocity
        this.velocity = this.velocity.add(steering).truncate(this.moveSpeed);
    }

    avoid(target, distance) {
        // Get desired velocity
        let posVec = new Vector(this.x, this.y);
        let desired = posVec.subtract(target);

        // If within range, apply steering force to avoid t
        if (desired.length < distance) {
            // Calculate steering force
            let steering = desired.subtract(this.velocity).truncate(this.turnSpeed);

            // Integrate steering force with current velocity
            this.velocity = this.velocity.add(steering).truncate(this.moveSpeed);
        }
    }
}
