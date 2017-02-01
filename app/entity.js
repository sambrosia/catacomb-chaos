import { app } from "./engine/engine.js";
import Vector from "./engine/vector.js";
import AnimatedSprite from "./engine/animatedsprite.js";

// Common functionality for game objects
export default class Entity extends AnimatedSprite {
    constructor(textures) {
        super(textures);
        this.anchor.set(0.5, 1);

        this.velocity = new Vector(0, 0);
        this.desiredVelocity = new Vector(0, 0);
        this.moveSpeed = 1;
        this.turnSpeed = 1;

        this.graph = this.addChild(new PIXI.Graphics());
        this.graph.visible = false;
    }

    process(dt) {}

    move(velocityScale, steer) {
        // Move character
        // TODO: constrain to room
        if (steer === undefined) steer = true;
        if (steer) this.steer();

        let posVec = new Vector(this.x, this.y);
        this.position = posVec.add(this.velocity.multiply(velocityScale));

        this.graphVector(this.velocity, 0xff0000, 50);

        // Play appropriate animation based on velocity
        if (this.animations.walk && (this.velocity.x !== 0 || this.velocity.y !== 0)) {
            this.playAnimation("walk");
            if      (this.velocity.x < 0) this.scale.x = -1;
            else if (this.velocity.x > 0) this.scale.x = 1;
        } else if (this.animations.idle) {
            this.playAnimation("idle");
        }
    }

    steer() {
        // Calculate steering force
        let desired = this.desiredVelocity;
        let steering = desired.subtract(this.velocity).truncate(this.turnSpeed);

        // Integrate steering force with current velocity
        this.velocity = this.velocity.add(steering).truncate(this.moveSpeed);

        this.graph.clear();
        this.graphVector(desired, 0x0000ff, 50);
        this.graphVector(steering, 0x00ff00, 50);

        desired.set(0, 0);
    }

    chase(target, radius) {
        // Get desired velocity
        let targetVec = new Vector(target.x, target.y);
        let diff = targetVec.subtract(this.position);

        // Add to other desired velocities
        if (diff.length > radius) {
            let desired = diff.normalize().multiply(this.moveSpeed);
            this.desiredVelocity = this.desiredVelocity.add(desired);
        }
    }

    avoid(target, radius) {
        // Get desired velocity
        let posVec = new Vector(this.x, this.y);
        let diff = posVec.subtract(target);
        let desired = diff.multiply(1 / Math.pow(diff.length, 2));

        // Add to other desired velocities
        if (diff.length < radius)
            this.desiredVelocity = this.desiredVelocity.add(desired);
    }

    graphVector(vector, color, scale) {
        scale = scale || 1;
        this.graph
            .lineStyle(1, color)
            .moveTo(0, 0)
            .lineTo(vector.x * scale, vector.y * scale);
    }
}
