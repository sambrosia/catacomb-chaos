import { app } from "./engine/engine.js";
import Vector from "./engine/vector.js";
import Entity from "./entity.js";

let square = new PIXI.Graphics();
square.beginFill(0xff4411)
    .drawRect(0, 0, 10, 10)
    .endFill();
let tex = square.generateCanvasTexture(PIXI.SCALE_MODES.NEAREST);

class FireParticle extends PIXI.Sprite {
    constructor() {
        super(tex);
        this.anchor.set(0.5);
        this.blendMode = PIXI.BLEND_MODES.ADD;

        this.rotationRate = (Math.random() - 0.5) * 0.3;
        this.growRate = -0.02;
        this.riseRate = -0.3;
    }

    process(dt) {
        this.scale.x += this.growRate * dt;
        this.scale.y += this.growRate * dt;
        this.position.y += this.riseRate * dt;
        this.rotation += this.rotationRate * dt;

        if (this.alpha <= 0 || this.scale.x <= 0) {
            this.destroy();
        }
    }
}

export class Fireball extends Entity {
    constructor() {
        super([tex]);
        this.anchor.set(0.5);
        this.visible = false;

        this.moveSpeed = 8;
        this.turnSpeed = 0.8;

        console.log(this);
        this.createParticle(this);
    }

    process(dt) {
        this.chase(app.input.mousePos, 3);

        this.move(dt);
    }

    createParticle(self) {
        if (self.parent) {
            let p = self.parent.addChild(new FireParticle());

            p.position = self.position;
            p.x += (Math.random() - 0.5) * 6;
            p.y += ((Math.random() - 0.5) * 6);
        }

        let delay = 80 / (self.velocity.length + 1);

        window.setTimeout(self.createParticle, delay, self);
    }
}

export class FireContainer extends PIXI.Container {
    constructor() { super(); }

    process(dt) {
        for (const particle of this.children) {
            particle.process(dt);
        }
    }
}
