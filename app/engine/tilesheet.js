import { Texture, Rectangle } from "pixi.js";

export default class TileSheet {
    // tilesheet texture, width and height in tiles, side length of tile in pixels
    constructor(texture, width, height, sizeX, sizeY) {
        sizeY = sizeY || sizeX;
        this.tileSize = { x: sizeX, y: sizeY };
        this.tiles = [];

        // Get tiles from tile sheet
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.tiles.push(new PIXI.Texture(
                    texture,
                    new PIXI.Rectangle(x * sizeX, y * sizeY, sizeX, sizeY)
                ));
            }
        }
    }
}
