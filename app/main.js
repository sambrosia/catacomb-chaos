import { settings, SCALE_MODES, Container, Texture } from "pixi.js";
import { app } from "./engine/engine.js";
import Vector from "./engine/vector.js";
import TileSheet from "./engine/tilesheet.js";

import Dungeon from "./dungeon.js";
import Entity from "./entity.js";
import Player from "./player.js";
import { Fireball, FireContainer } from "./fireball.js";
import { ExplosionContainer } from "./explosion.js";
import Enemy from "./enemy.js";

// NOTE: (ideas)
// Player and enemies are 1 hit kill
// Progress bar showing no of minions (or time) remaining before skeleton king comes

// Enemies spawn from magic circles or maybe trap doors
// Melee enemies - telegraphed wind-up when close to player
// Bow enemies - arrows can be burned w/o stopping fireball
// Caster enemies - magic missile/fireball blow eachother up
// Skirmisher enemies?
// Defender enemy protects ranged enemies?

// Minor environmental stuff (torches, barrels, etc.)
// Trap tiles
// Power-up pickups? (shield, multi-ball, bouncing fireballs?)

// Gameplay progression:
// Intro: you stole skeleton king's magic crystal; he trapped you in his dungeon
// - Player alone, shown walking mechanic
// - A baddy is sent in, player is shown fireball mechanic
// - Humorous skeleton king chattering in textbox occasionally
// - Faster spawning and more diverse enemies as game goes on
// - Mini-boss?
// - Skeleton king shows up after all minions are dead
// - The end

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
player.position.set(100);

// Container for explosion particles
app.stage.explosionContainer = app.stage.addChild(new ExplosionContainer());

// Container for fire particles
const fire = app.stage.addChild(new FireContainer());
player.fireContainer = fire;

// Debug graph
app.graph = app.stage.addChild(new PIXI.Graphics());

// Start enemy spawning
let enemiesSpawned = 0;
function spawnEnemy() {
    enemiesSpawned++;
    let enemy = characters.addChild(new Enemy(playerFrames.tiles));
    enemy.position.set(Math.random() * 16 * 27, Math.random() * 16 * 15);

    window.setTimeout(spawnEnemy, Math.max(1500 - enemiesSpawned * 10, 500));
}
spawnEnemy();

// On mouse down
app.input.onMouseDown = (event) => {
    player.onMouseDown(event);
};

// On mouse up
app.input.onMouseUp = (event) => {
    player.onMouseUp(event);
};

// Update
function update(dt) {
    // Update characters
    for (const character of characters.children) {
        character.process(dt, player, characters.children);
    }

    // Update particles
    fire.process(dt, characters.children, player);
    app.stage.explosionContainer.process(dt);

    // Y-Sort characters
    characters.children.sort((a, b) => { return a.y - b.y; });
}

app.ticker.add(update);
