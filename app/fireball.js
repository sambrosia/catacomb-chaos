import { app } from "./engine/engine.js";
import Vector from "./engine/vector.js";
import Entity from "./entity.js";

let square = new PIXI.Graphics();
square.beginFill(0xff4411)
    .drawRect(0,0,1,1)
    .endFill();
let tex = square.generateCanvasTexture(PIXI.SCALE_MODES.LINEAR);

class FireParticle extends PIXI.Sprite {
    constructor(size, velocity) {
        super(tex);
        this.anchor.set(0.5);
        this.scale.set(size);

        this.rotationRate = (Math.random() - 0.5) * 0.3;
        this.growRate = -0.2 - (0.05 * size);
        this.velocity = velocity.multiply(0.6).add(new Vector(Math.random() - 0.5, Math.random() - 0.5));
    }

    process(dt) {
        this.scale.x += this.growRate * dt;
        this.scale.y += this.growRate * dt;
        this.rotation += this.rotationRate * dt;
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

        if (this.scale.x <= 0) {
            this.destroy();
        }
    }
}

export class Fireball extends Entity {
    constructor(size) {
        super([tex]);
        this.anchor.set(0.5);
        this.visible = false;

        this.resize(size);

        this.createParticle(this);
    }

    resize(size) {
        this.size = size;
        this.moveSpeed = 60 / size;
        this.turnSpeed = 0.4 * (16 / size);
    }

    process(dt, characters, player) {
        // Loosely follow mouse position
        if (app.input.isMouseDown[0]) {
            this.chase(app.input.mousePos, 2);

            // Avoid clumping
            for (const other of this.parent.children) {
                if (other == this) continue;
                this.avoid(other, this.size);
            }

            this.steer();
        }
        this.move(dt, false);

        // Check for collision
        for (const character of characters) {
            if (character != player && character.containsPoint(new Vector(this.x * app.stage.scale.x, this.y * app.stage.scale.y))) {
                console.log("Exploded!");
                character.destroy();
                this.destroy();
                break;
            }
        }
    }

    createParticle(self) {
        if (self.parent) {
            let p = self.parent.addChild(new FireParticle(self.size, self.velocity));

            p.position = self.position;
            p.x += (Math.random() - 0.5) * 0.3 * self.size;
            p.y += (Math.random() - 0.5) * 0.3 * self.size;
            p.rotation = Math.random() - 0.5;
        }

        let delay = 50 / ((self.velocity.length * 0.4) + 1);

        window.setTimeout(self.createParticle, delay, self);
    }
}

// TODO: Move fireballs so they aren't siblings to fire particles
export class FireContainer extends PIXI.particles.ParticleContainer {
    constructor() {
        super();
        this.blendMode = PIXI.BLEND_MODES.ADD;
    }

    process(dt, characters, player) {
        for (const particle of this.children) {
            particle.process(dt, characters, player);
        }
    }
}
