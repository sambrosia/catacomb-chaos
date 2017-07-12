import * as fae from 'fae'
import { app } from '../app'
import { fireTexture } from './fireball'

export const explosionTemplate = {
  components: ['emitter', 'collision'],
  parent: app.stage.effects,

  ready () {
    this.r = 0
    this.collisionGroups.add('enemy').add('arrow')

    this.emitOptions = {
      texture: fireTexture,
      period: 30,
      lifetime: 500,
      area: 10,
      scale: 5,
      endScale: 12,
      endScaleRandom: 6,
      rotationRandom: 1.5,
      endRotationRandom: 1.5,
      endAlpha: 0.01,
      velocityRandom: new fae.Vector(0.6, 0.6)
    }

    this.sparks = app.e({
      components: ['emitter'],
      parent: this,

      ready () {
        this.emitOptions = {
          texture: fireTexture,
          period: 1,
          lifetime: 300,
          area: 4,
          scale: 0.4,
          endScaleRandom: 0.3,
          velocityRandom: new fae.Vector(3, 3)
        }
      }
    })

    const n = Math.ceil(Math.random() * 4)
    app.resources['soundExplosion' + n].sound.play({
      speed: 0.75 - Math.random() * 0.35
    })

    this.timeout(200, 'kill')
  },

  update (dt) {
    this.r += (12 - this.r) * 0.2
  },

  collided (other) {
    other.emit('hitbyexplosion', this)
  },

  kill () {
    this.sparks.queueDestroy()
    this.queueDestroy()
  }
}
