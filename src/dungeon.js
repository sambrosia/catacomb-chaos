import * as fae from "./engine";
import { app } from "./app";

const tileTemplate = {
    components: ["sprite"],
    parent: app.stage.dungeon,

    ready() {
        this.w = 16;
        this.h = 16;

        this.sprite.texture = app.resources.dungeon.textures.floor;
    }
};

export function makeDungeon(w, h) {
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let tex = "floor";

            switch (y) {
                case 0:
                    switch (x) {
                        case 0:
                            tex = "floor-nw";
                            break;

                        case w - 1:
                            tex = "floor-ne";
                            break;

                        default:
                            tex = "floor-n";
                    }
                    break;

                case h - 1:
                    switch (x) {
                        case 0:
                            tex = "floor-sw";
                            break;

                        case w - 1:
                            tex = "floor-se";
                            break;

                        default:
                            tex = "floor-s";
                    }
                    break;

                default:
                    switch (x) {
                        case 0:
                            tex = "floor-w";
                            break;

                        case w - 1:
                            tex = "floor-e";
                            break;

                        default:
                            tex = "floor";

                            let r = Math.random();
                            if (r < 0.15) tex = "floor-tile";
                            else if (r < 0.3) tex = "floor-tiles";
                    }
            }

            const tile = app.e(tileTemplate);
            tile.position = new fae.Vector(x * 16, y * 16);
            tile.sprite.texture = app.resources.dungeon.textures[tex];
        }
    }
}
