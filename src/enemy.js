import * as fae from "fae";
import { app } from "./app";

const enemyTemplate = {
    components: ["animatedsprite", "motion", "steering", "collision"],
    parent: app.stage.characters,

    ready() {
        this.as.anchor.set(0.5, 1);
        this.cAnchor.set(0.5, 1);

        this.w = 10;
        this.h = 16;

        this.moveSpeed = 0.6;
        this.turnSpeed = 0.02;

        this.as.textures = app.resources.skeleton.array;

        this.as.addAnimation("walk", {
            speed: 6,
            start: 0,
            end: 3
        });

        this.as.playAnimation("walk");

        this.chaseVec = new fae.Vector(Math.random() * (100 - 20) + 20, 60);
    },

    update() {
        if (this.y > 60 && this.chaseVec != app.player.position) {
            this.chaseVec = app.player.position;
        }

        if (this.velocity.x < 0) {
            this.scale.x = -1;
        }
        else if (this.velocity.x > 0) {
            this.scale.x = 1;
        }
    },

    hitbyfireball(fireball) {
        fireball.fire("landedhit");
    },

    hitbyexplosion() {
        const smoke = app.e(poofTemplate);
        smoke.position = this.position;
        smoke.y -= 4;

        this.queueDestroy();
    }
};

const particleTexture = new PIXI.Graphics()
.beginFill(0x601ac9)
.drawRect(0,0,1,1)
.endFill()
.generateCanvasTexture(PIXI.SCALE_MODES.LINEAR);

const poofTemplate = {
    components: ["emitter", "timeout"],
    parent: app.stage.characters,

    ready() {
        this.emitOptions = {
            texture: particleTexture,
            lifetime: 300,
            period: 20,
            area: 20,
            scale: 6,
            scaleRandom: 4,
            rotationRandom: 1,
            endAlpha: 0.01,
            velocityRandom: new fae.Vector(0.5, 0.5)
        };

        this.timeout(100, "kill");
    },

    kill() {
        this.queueDestroy();
    }
};

const sparkTemplate = {
    components: ["emitter", "timeout"],

    ready() {
        this.emitOptions = {
            texture: particleTexture,
            lifetime: 300,
            period: 50,
            area: 4,
            scale: 1,
            scaleRandom: 0.5,
            endAlpha: 0.01,
            velocityRandom: new fae.Vector(1, 1)
        };
    }
};

export const enemySpawnTemplate = {
    components: ["timeout"],
    parent: app.stage.characters,

    ready() {
        this.sparks = app.e(sparkTemplate);
        this.addChild(this.sparks);

        this.timeout((Math.random() + 1) * 500, "kill");
    },

    kill() {
        const smoke = app.e(poofTemplate);
        smoke.position = this.position;

        const enemy = app.e(enemyTemplate);
        enemy.position = this.position;
        enemy.y += 4;

        this.sparks.queueDestroy();
        this.queueDestroy();
    }
};
