import { Point } from "pixi.js";

// Vector class
export default class Vector extends PIXI.Point {
    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    normalize() {
        let l = this.length;
        if (l > 0) {
            this.x /= l;
            this.y /= l;
        }
    }

    truncate(n) {
        let s = n / this.length;
        if (s < 1) {
            this.x *= s;
            this.y *= s;
        }
    }
}
