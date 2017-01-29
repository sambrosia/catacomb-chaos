import { extras } from "pixi.js";

export default class AnimatedSprite extends PIXI.extras.AnimatedSprite {
    constructor(textures) {
        super(textures);

        this.animations = {};
        this.currentAnimation = null;
    }

    addAnimation(name, start, end) {
        this.animations[name] = { start: start, end: end };
    }

    playAnimation(name) {
        if (!this.animations[name]) {
            console.log("Animation '" + name + "' does not exist on this AnimatedSprite");
            return;
        }

        if (this.currentAnimation == name) return;
        this.currentAnimation = name;

        this.onFrameChange = function() {
            if (this.currentFrame > this.animations[name].end ||
                this.currentFrame < this.animations[name].start
            ) { this.gotoAndPlay(this.animations[name].start); }
        };

        this.play();
    }
}
