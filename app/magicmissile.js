import { Sprite, Graphics, SCALE_MODES } from "pixi.js";

export default class MagicMissile extends PIXI.Sprite {
    constructor(size, dir, speed) {
        let rect = new PIXI.Graphics();
        rect.beginFill(0xffffff, 1);
        rect.drawRect(0, 0, size, size);
        rect.endFill();
        let texture = rect.generateCanvasTexture(PIXI.SCALE_MODES.NEAREST);

        super(texture);

        this.anchor.set(0.5);
        this.size = size;
        this.speed = speed;
        this.dir = dir;
    }

    resize(factor) {
        this.size *= factor;
        this.scale.set(this.scale.x * factor);
    }
}
