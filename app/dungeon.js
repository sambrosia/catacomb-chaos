import { Container, Sprite } from "pixi.js";

export default class Dungeon extends PIXI.Container {
    constructor(width, height, tilesheet) {
        super();

        // Map data
        let level = [];
        // Walls
        for (let x = 0; x < width; x++) {
            level[x] = [];
            for (let y = 0; y < height; y++) {
                level[x][y] = 1;
            }
        }
        // Floor
        for (let x = 1; x < width - 1; x++) {
            for (let y = 1; y < height - 1; y++) {
                level[x][y] = 0;
            }
        }

        // Turn data in to tiles
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let spriteIndex = 12;

                switch (y) {
                    case 0:
                        switch (x) {
                            case 0:
                                spriteIndex = 0;
                                break;
                            case 1:
                                spriteIndex = 1;
                                break;
                            case width - 2:
                                spriteIndex = 3;
                                break;
                            case width - 1:
                                spriteIndex = 4;
                                break;
                            default:
                                spriteIndex = 2;
                        }
                        break;
                    case 1:
                        switch (x) {
                            case 0:
                                spriteIndex = 5;
                                break;
                            case 1:
                                spriteIndex = 6;
                                break;
                            case width - 2:
                                spriteIndex = 8;
                                break;
                            case width - 1:
                                spriteIndex = 9;
                                break;
                            default:
                                spriteIndex = 7;
                        }
                        break;
                    case height - 2:
                        switch (x) {
                            case 0:
                                spriteIndex = 15;
                                break;
                            case 1:
                                spriteIndex = 16;
                                break;
                            case width - 2:
                                spriteIndex = 18;
                                break;
                            case width - 1:
                                spriteIndex = 19;
                                break;
                            default:
                                spriteIndex = 17;
                        }
                        break;
                    case height - 1:
                        switch (x) {
                            case 0:
                                spriteIndex = 20;
                                break;
                            case 1:
                                spriteIndex = 21;
                                break;
                            case width - 2:
                                spriteIndex = 23;
                                break;
                            case width - 1:
                                spriteIndex = 24;
                                break;
                            default:
                                spriteIndex = 22;
                        }
                        break;
                    default:
                        switch (x) {
                            case 0:
                                spriteIndex = 10;
                                break;
                            case 1:
                                spriteIndex = 11;
                                break;
                            case width - 2:
                                spriteIndex = 13;
                                break;
                            case width - 1:
                                spriteIndex = 14;
                                break;
                            default:
                                spriteIndex = 12;
                                if (Math.random() < 0.35) {
                                    spriteIndex = Math.floor(Math.random() * (27 - 26 + 1)) + 26;
                                }
                        }
                }

                let sprite = new PIXI.Sprite(tilesheet.tiles[spriteIndex]);
                sprite.position.set(x * tilesheet.tileSize.x, y * tilesheet.tileSize.y);
                this.addChild(sprite);
            }
        }
    }
}
