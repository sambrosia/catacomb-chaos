import { settings, SCALE_MODES, Container, Texture } from "pixi.js";
import { app } from "./engine.js";

import TileSheet from "./tilesheet.js";
import Dungeon from "./dungeon.js";
import Character from "./character.js";
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

// Set scale
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
app.stage.scale.set(3);

// Create the dungeon
const dungeonTexture = PIXI.Texture.fromImage("sprites/dungeon.png");
const dungeonTiles = new TileSheet(dungeonTexture, 5, 6, 16);
const dungeon = new Dungeon(
    Math.round(app.renderer.width / app.stage.scale.x / dungeonTiles.tileSize.x),
    Math.round(app.renderer.height / app.stage.scale.y / dungeonTiles.tileSize.y),
    dungeonTiles
);
app.stage.addChild(dungeon);

// Container for characters
const characters = app.stage.addChild(new PIXI.Container());

// Create player
const playerTexture = PIXI.Texture.fromImage("sprites/mage.png");
const playerFrames = new TileSheet(playerTexture, 4, 2, 24, 30);
const player = new Character(playerFrames.tiles);
player.animationSpeed = 0.1;

player.addAnimation("idle", 0, 3);
player.addAnimation("walk", 4, 7);

characters.addChild(player);

// Create an enemy
let enemy = new Enemy(playerFrames.tiles);
enemy.animationSpeed = 0.05;
enemy.addAnimation("idle", 0, 3);
enemy.addAnimation("walk", 4, 7);
enemy.position.set(200, 100);
characters.addChild(enemy);

// Update
function update(dt) {
    // Get player direction vector
    player.velocity.set(0, 0);
    if (app.keyDown.a) { player.velocity.x -= 1; player.scale.x = -1; }
    if (app.keyDown.d) { player.velocity.x += 1; player.scale.x = 1; }
    if (app.keyDown.w) player.velocity.y -= 1;
    if (app.keyDown.s) player.velocity.y += 1;
    player.velocity.normalize();

    // Scale to player speed
    player.velocity.x *= player.moveSpeed;
    player.velocity.y *= player.moveSpeed;

    // Play appropriate animation based on velocity
    if (player.velocity.x !== 0 || player.velocity.y !== 0) {
        player.playAnimation("walk");
    } else {
        player.playAnimation("idle");
    }

    // Move player
    player.move(dt);

    // Steer enemy
    enemy.chase(player.position);

    if (enemy.velocity.x < 0) enemy.scale.x = -1;
    else enemy.scale.x = 1;

    // Play appropriate animation based on velocity
    if (enemy.velocity.x !== 0 || enemy.velocity.y !== 0) {
        enemy.playAnimation("walk");
    } else {
        enemy.playAnimation("idle");
    }

    enemy.move(dt);

    // Y-Sort character sprites
    characters.children.sort(function(a, b) { return a.y > b.y; });

    if (app.ticker.FPS < 59) console.log(app.ticker.FPS);
}

app.ticker.add(update);
