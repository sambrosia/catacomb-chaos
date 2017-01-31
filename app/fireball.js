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
        this.blendMode = PIXI.BLEND_MODES.ADD;
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
    constructor() {
        super([tex]);
        this.anchor.set(0.5);
        this.visible = false;

        this.resize(10);

        this.createParticle(this);
    }

    resize(size) {
        this.size = size;
        this.moveSpeed = 60 / size;
        this.turnSpeed = 0.4 * (16 / size);
    }

    process(dt) {
        this.chase(app.input.mousePos, 2);
        this.move(dt);
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

export class FireContainer extends PIXI.Container {
    process(dt) {
        for (const particle of this.children) {
            particle.process(dt);
        }
    }
}
