import { settings, SCALE_MODES, Container, Texture } from "pixi.js";
import { app } from "./engine/engine.js";
import Vector from "./engine/vector.js";
import TileSheet from "./engine/tilesheet.js";

import Dungeon from "./dungeon.js";
import Player from "./player.js";
import Enemy from "./enemy.js";
import MagicMissile from "./magicmissile.js";

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
const player = new Player(playerFrames.tiles);
player.animationSpeed = 0.1;

player.addAnimation("idle", 0, 3);
player.addAnimation("walk", 4, 7);

characters.addChild(player);

const missiles = [];
const enemies = [];

function spawnEnemy() {
    let enemy = new Enemy(playerFrames.tiles);
    enemy.animationSpeed = 0.05;
    enemy.addAnimation("idle", 0, 3);
    enemy.addAnimation("walk", 4, 7);
    enemy.position.set(Math.random() * 16 * 24, Math.random() * 16 * 16);
    characters.addChild(enemy);
    enemies.push(enemy);
}

// Create some enemies
for (let i = 0; i < 20; i++) {
    spawnEnemy();
}

// Update
function update(dt) {
    // Get player direction vector
    player.velocity.set(0, 0);
    if (app.input.isKeyDown.a || app.input.isKeyDown.left)  player.velocity.x -= 1;
    if (app.input.isKeyDown.d || app.input.isKeyDown.right) player.velocity.x += 1;
    if (app.input.isKeyDown.w || app.input.isKeyDown.up)    player.velocity.y -= 1;
    if (app.input.isKeyDown.s || app.input.isKeyDown.down)  player.velocity.y += 1;

    if (app.input.isMouseDown[2]) {
        let dx = app.input.mouseX - player.x;
        let dy = app.input.mouseY - player.y;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) player.velocity.set(dx, dy);
    }

    // Scale to player speed
    player.velocity.normalize();
    player.velocity.x *= player.moveSpeed;
    player.velocity.y *= player.moveSpeed;

    // Play appropriate animation based on velocity
    if (player.velocity.x !== 0 || player.velocity.y !== 0) {
        player.playAnimation("walk");
        if (player.velocity.x < 0)      player.scale.x = -1;
        else if (player.velocity.x > 0) player.scale.x = 1;
    } else {
        player.playAnimation("idle");
    }

    // Move player
    player.move(dt);



    // Shoot missiles
    if (player.spellCharge > 0 && !app.input.isMouseDown[0]) {
        let size = 8 + player.spellCharge * 8;
        let dir = new Vector(app.input.mouseX - player.x, app.input.mouseY - player.y).normalize();
        let speed = 1.5 + 4 / size;

        let missile = new MagicMissile(size, dir, speed);
        missile.position.set(player.x, player.y - 8);
        characters.addChild(missile);
        missiles.push(missile);

        player.spellCharge = 0;
    }

    // Charge missiles
    if (app.input.isMouseDown[0] && player.spellCharge < player.maxCharge) {
        player.spellCharge += app.ticker.elapsedMS / 500;
        if (player.spellCharge> player.maxCharge) player.spellCharge = player.maxCharge;
    }

    // Move missiles
    missile_check:
    for (let i = 0; i < missiles.length; i++) {
        let missile = missiles[i];

        missile.x += missile.dir.x * missile.speed * dt;
        missile.y += missile.dir.y * missile.speed * dt;

        for (let j = 0; j < enemies.length; j++) {
            let enemy = enemies[j];
            let p = new PIXI.Point(missile.x * app.stage.scale.x, missile.y * app.stage.scale.y);
            if (enemy.containsPoint(p)) {
                enemies.splice(j, 1);
                enemy.destroy();

                missile.resize(0.8);
                if (missile.size < 8) {
                    missiles.splice(i, 1);
                    missile.destroy();
                    break missile_check;
                }
            }
        }

        if (missile.x < -32 || missile.x > (app.renderer.width / app.stage.scale.x) + 32 ||
            missile.y < -32 || missile.y > (app.renderer.height / app.stage.scale.y) + 32) {
            missiles.splice(i, 1);
            missile.destroy();
        }
    }



    for (const enemy of enemies) {
        // Chase player
        enemy.chase(player.position);

        // Avoid clumping with other enemies
        for (const other of enemies) {
            if (other == enemy) continue;
            enemy.avoid(other.position, 16);
        }

        // Play appropriate animation based on velocity
        if (enemy.velocity.x !== 0 || enemy.velocity.y !== 0) {
            enemy.playAnimation("walk");
            if (enemy.velocity.x < 0)      enemy.scale.x = -1;
            else if (enemy.velocity.x > 0) enemy.scale.x = 1;
        } else {
            enemy.playAnimation("idle");
        }

        enemy.move(dt);
    }



    // Spawn enemies
    if (enemies.length < 20) {
        spawnEnemy();
    }



    // Y-Sort character sprites
    characters.children.sort((a, b) => { return (a.x + a.y) - (b.x + b.y); });

    if (app.ticker.FPS < 59) console.log("FPS dropped to: " + app.ticker.FPS);
}

app.ticker.add(update);
