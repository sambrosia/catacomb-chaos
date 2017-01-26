import { app } from "./engine.js";
import AnimatedSprite from "./animatedsprite.js";
import Vector from "./vector.js";

// Common functionality for player and enemies
export default class Character extends AnimatedSprite {
    constructor(textures) {
        super(textures);

        this.anchor.set(0.5, 1);

        this.velocity = new Vector(0, 0);
        this.moveSpeed = 0.8;
    }

    move(velocityScale) {
        // Move character
        this.x += this.velocity.x * velocityScale;
        this.y += this.velocity.y * velocityScale;

        let scaledW = app.renderer.width / app.stage.scale.x;
        let scaledH = app.renderer.height / app.stage.scale.y;

        // Constrain to screen
        if      (this.x < 22)       this.x = 22;
        else if (this.x > scaledW - 22) this.x = scaledW - 22;
        if      (this.y < 16)       this.y = 16;
        else if (this.y > scaledH - 28) this.y = scaledH - 28;
    }
}
