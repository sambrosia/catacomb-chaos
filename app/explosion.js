import { app } from "./engine/engine.js";
import SAT from "sat";
import Vector from "./engine/vector.js";
import Entity from "./entity.js";
import Player from "./player.js";

export default class Explosion {
    constructor(position, size, velocity, entities) {
        // TODO: Screen shake

        // Create explosion effect
        let ent = app.stage.explosionContainer.addChild(new ExplosionEntity(position, size, velocity));

        // Get explosion circle for SAT
        let circ = new SAT.Circle(new SAT.Vector(position.x, position.y), size * 1.5);

        // Draw debug circle
        // app.graph.lineStyle()
        //     .beginFill(0xff0000, 0.2)
        //     .drawCircle(circ.pos.x, circ.pos.y, circ.r)
        //     .endFill();

        // Check for entities in explosion
        for (const e of entities) {
            // TODO: Fix hacky player check
            if (!(e instanceof Player) && SAT.testPolygonCircle(e.rect.toPolygon(), circ)) {
                app.ticker.addOnce(e.destroy, e);
            }
        }

        ent.destroy();
    }
}

// Explosion particles
let square = new PIXI.Graphics();
square.beginFill(0xff4411)
    .drawRect(0,0,1,1)
    .endFill();
let tex = square.generateCanvasTexture(PIXI.SCALE_MODES.LINEAR);

class SparkParticle extends PIXI.Sprite {
    constructor(size, velocity) {
        super(tex);
        this.anchor.set(0.5);
        this.scale.set(1);

        this.rotationRate = Math.random() - 0.5;
        this.fadeRate = -0.04;
        this.velocity = velocity.multiply(0.15).add(new Vector(Math.random() - 0.5, Math.random() - 0.5).multiply(0.3 * size));
    }

    process(dt) {
        this.rotation += this.rotationRate * dt;
        this.alpha += this.fadeRate * dt;
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

        if (this.alpha <= 0) {
            this.destroy();
        }
    }
}

class ExplosionParticle extends PIXI.Sprite {
    constructor(size, velocity) {
        super(tex);
        this.anchor.set(0.5);
        this.scale.set(Math.random() * size);

        this.rotationRate = (Math.random() - 0.5) * 0.04;
        this.growRate = 0.28;
        this.fadeRate = -0.04;
        this.velocity = new Vector(Math.random() - 0.5, Math.random() - 0.5).multiply(0.15 * size);
    }

    process(dt) {
        this.scale.x += this.growRate * dt;
        this.scale.y += this.growRate * dt;
        this.rotation += this.rotationRate * dt;
        this.alpha += this.fadeRate * dt;
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

        if (this.alpha <= 0) {
            this.destroy();
        }
    }
}

export class ExplosionEntity extends Entity {
    constructor(position, size, velocity) {
        super([tex]);
        this.anchor.set(0.5);
        this.visible = false;

        for (let i = 0; i < size * 1.4; i++) {
            // Explosion particles
            let exp = app.stage.explosionContainer.addChild(new ExplosionParticle(size, velocity));

            exp.position = position;
            exp.x += (Math.random() - 0.5) * 0.3 * size;
            exp.y += (Math.random() - 0.5) * 0.3 * size;

            exp.rotation = Math.random() - 0.5;

            // Spark particles
            let spark = app.stage.explosionContainer.addChild(new SparkParticle(size, velocity));

            spark.position = position;
            spark.x += (Math.random() - 0.5) * 0.3 * size;
            spark.y += (Math.random() - 0.5) * 0.3 * size;
        }
    }
}

export class ExplosionContainer extends PIXI.particles.ParticleContainer {
    constructor() {
        super(1000, { scale: true, rotation: true, alpha: true }, 1000);
        this.blendMode = PIXI.BLEND_MODES.ADD;
    }

    process(dt) {
        for (const particle of this.children) {
            particle.process(dt);
        }
    }
}
