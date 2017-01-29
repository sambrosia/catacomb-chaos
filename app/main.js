import { settings, SCALE_MODES, Container, Texture } from "pixi.js";
import { app } from "./engine/engine.js";
import Vector from "./engine/vector.js";
import TileSheet from "./engine/tilesheet.js";

import Dungeon from "./dungeon.js";
import Player from "./player.js";
import Enemy from "./enemy.js";

// NOTE: (ideas)
// Big XP bar that fills up as you kill enemies
// Player and enemies are 1 hit kill

// Independent upper body, legs, arms components of player sprite
// Charge missile spell on LMB
// Charge blink spell on RMB
// Mega laser special attack?
// Shield bubble?

// Enemies spawn from magic circle in middle
// Melee enemies
// Bow enemies
// Skirmisher enemies?

// Minor environmental stuff (torches, barrels, etc.)
// Trap tiles
// variant floor tiles make musical tone when stepped on, based on their Y coord
// playing mary had a little lamb will spawn sheep?
// Sheep line up and follow player, but stop on spawners to block them

// Set scale
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
app.stage.scale.set(3);

// Create the dungeon
const dungeonTexture = PIXI.Texture.fromImage("sprites/dungeon.png");
const dungeonTiles = new TileSheet(dungeonTexture, 5, 6, 16);
const dungeon = app.stage.addChild(new Dungeon(
    Math.round(app.renderer.width / app.stage.scale.x / dungeonTiles.tileSize.x),
    Math.round(app.renderer.height / app.stage.scale.y / dungeonTiles.tileSize.y),
    dungeonTiles
));

// Container for characters
const characters = app.stage.addChild(new PIXI.Container());

// Create player
const playerTexture = PIXI.Texture.fromImage("sprites/mage.png");
const playerFrames = new TileSheet(playerTexture, 4, 2, 24, 30);
const player = characters.addChild(new Player(playerFrames.tiles));

// Arrays for iterating through active projectiles and enemies
const missiles = [];
const enemies = [];

// Create some enemies
function spawnEnemy() {
    let enemy = characters.addChild(new Enemy(playerFrames.tiles));
    enemy.position.set(Math.random() * 16 * 27, Math.random() * 16 * 15);
    enemies.push(enemy);
}

for (let i = 0; i < 20; i++) {
    spawnEnemy();
}

// Update
function update(dt) {
    // Update player
    player.process(dt);

    // Spawn enemies
    if (enemies.length < 20) {
        spawnEnemy();
    }

    // Update enemies
    for (const enemy of enemies) {
        enemy.process(player.position, enemies, dt);
    }

    // Y-Sort characters
    characters.children.sort((a, b) => { return (a.x + a.y) - (b.x + b.y); });
}

app.ticker.add(update);
