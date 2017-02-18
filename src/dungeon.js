import * as fae from "fae";
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

const wallColliderTemplate = {
    components: ["collision"],
    parent: app.stage,

    hitbyfireball(fireball) {
        fireball.fire("landedhit");
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
                            tex = "wall-nw";
                            break;
                        case 1:
                            tex = "wall-nnw";
                            break;

                        case w - 2:
                            tex = "wall-nne";
                            break;

                        case w - 1:
                            tex = "wall-ne";
                            break;

                        default:
                            tex = "wall-n";
                    }
                    break;

                case 1:
                    switch (x) {
                        case 0:
                            tex = "wall-wnw";
                            break;

                        case 1:
                            tex = "floor-nw";
                            break;

                        case w - 2:
                            tex = "floor-ne";
                            break;

                        case w - 1:
                            tex = "wall-ene";
                            break;

                        default:
                            tex = "floor-n";
                    }
                    break;

                case h - 2:
                    switch (x) {
                        case 0:
                            tex = "wall-wsw";
                            break;

                        case 1:
                            tex = "floor-sw";
                            break;

                        case w - 2:
                            tex = "floor-se";
                            break;

                        case w - 1:
                            tex = "wall-ese";
                            break;

                        default:
                            tex = "floor-s";
                    }
                    break;

                    case h - 1:
                        switch (x) {
                            case 0:
                                tex = "wall-sw";
                                break;

                            case 1:
                                tex = "wall-ssw";
                                break;

                            case w - 2:
                                tex = "wall-sse";
                                break;

                            case w - 1:
                                tex = "wall-se";
                                break;

                            default:
                                tex = "wall-s";
                        }
                        break;

                default:
                    switch (x) {
                        case 0:
                            tex = "wall-w";
                            break;

                        case 1:
                            tex = "floor-w";
                            break;

                        case w - 2:
                            tex = "floor-e";
                            break;

                        case w - 1:
                            tex = "wall-e";
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

    // Create the wall colliders
    const west = app.e(wallColliderTemplate);
    west.x = app.stage.dungeon.x;
    west.y = app.stage.dungeon.y + 16;
    west.w = 16;
    west.h = 16 * 10;

    const east = app.e(wallColliderTemplate);
    east.x = app.stage.dungeon.x + (16 * 7);
    east.y = app.stage.dungeon.y + 16;
    east.w = 16;
    east.h = 16 * 10;

    const north = app.e(wallColliderTemplate);
    north.x = app.stage.dungeon.x + 16;
    north.y = app.stage.dungeon.y;
    north.w = 16 * 6;
    north.h = 16;

    // South
    const south = app.e(wallColliderTemplate);
    south.x = app.stage.dungeon.x + 16;
    south.y = app.stage.dungeon.y + (16 * 11);
    south.w = 16 * 6;
    south.h = 16;
}
