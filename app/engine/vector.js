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
        return this;
    }

    truncate(n) {
        let s = n / this.length;
        if (s < 1) {
            this.x *= s;
            this.y *= s;
        }
        return this;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    multiply(n) {
        return new Vector(this.x * n, this.y * n);
    }
}
