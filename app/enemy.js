import Character from "./character.js";
import Vector from "./vector.js";

export default class Enemy extends Character {
    constructor(texture) {
        super(texture);
        this.tint = 0xff0000;

        this.target = new Vector(0, 0);
        this.steering = new Vector(0, 0);
        this.turnSpeed = 0.02;
        this.moveSpeed = 0.4;
    }

    chase(t) {
        // Get desired velocity
        this.target.x = t.x - this.x;
        this.target.y = t.y - this.y;
        this.target.normalize();
        this.target.x *= this.moveSpeed;
        this.target.y *= this.moveSpeed;

        // Calculate steering force
        this.steering.x = this.target.x - this.velocity.x;
        this.steering.y = this.target.y - this.velocity.y;
        this.steering.truncate(this.turnSpeed);

        // Integrate steering force with velocity
        this.velocity.x += this.steering.x;
        this.velocity.y += this.steering.y;
        this.velocity.truncate(this.moveSpeed);
    }
}
