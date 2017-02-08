import { app } from "./engine/engine.js";
import Vector from "./engine/vector.js";
import Entity from "./entity.js";

export default class Enemy extends Entity {
    constructor(texture) {
        super(texture);
        this.tint = 0xff0000;

        this.w = 12;
        this.h = 24;

        this.attackTimer = 0;
        this.attackPos = new Vector(0, 0);
        this.attackLength = 32;
        this.attackSpeed = 6;

        this.moveSpeed = 0.6;
        this.turnSpeed = 0.02;

        this.animationSpeed = 0.08;
        this.addAnimation("idle", 0, 3);
        this.addAnimation("walk", 4, 7);
    }

    process(dt, target, others) {
        // Draw debug rect
        // let rect = this.rect;
        // app.graph.lineStyle()
        //     .beginFill(0x00ff00, 0.2)
        //     .drawRect(rect.pos.x, rect.pos.y, rect.w, rect.h)
        //     .endFill();

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
