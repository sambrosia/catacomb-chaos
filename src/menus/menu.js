import * as fae from 'fae'
import { app } from '../app'

import '../main'
import './info'

let logo, playButton, optionsButton

app.scene('menu', {
  enter () {
    app.stage.gui.alpha = 0

    app.e({
      update (dt) {
        if (app.stage.gui.alpha < 1) app.stage.gui.alpha += 0.1 * dt
      }
    })

    logo = []
    for (const tex of ['skull', 'catacomb', 'chaos']) {
      logo.push(app.e({
        components: ['sprite'],
        parent: app.stage.gui,

        ready () {
          this.sprite.texture = app.resources.gui.textures['logo-' + tex + '.png']
        }
      }))
    }

    let t = 0
    logo[0].on('update', (dt) => {
      logo[0].y = 3 * Math.sin(t)
      t += dt / 60 * 2
    })

    playButton = app.e({
      components: ['sprite', 'motion'],
      parent: app.stage.gui,

      ready () {
        this.sprite.texture = app.resources.gui.textures['play-button.png']
        this.sprite.anchor.set(0.5)
        this.position = new fae.Vector(40, 136)

        this.interactive = true
        this.buttonMode = true

        this.hitArea = new PIXI.RoundedRectangle(-13, -13, 26, 27, 6)

        this.on('pointertap', () => {
          app.resources.soundButton.sound.play()
          app.scene('main')
        })
      }
    })

    optionsButton = app.e({
      components: ['sprite', 'motion'],
      parent: app.stage.gui,

      ready () {
        this.sprite.texture = app.resources.gui.textures['info-button.png']
        this.sprite.anchor.set(0.5)
        this.position = new fae.Vector(80, 136)

        this.interactive = true
        this.buttonMode = true

        this.hitArea = new PIXI.Circle(1, 1, 14)

        this.on('pointertap', () => {
          app.resources.soundButton.sound.play()
          app.scene('info')
        })
      }
    })
  },

  exit (next) {
    playButton.interactive = false
    playButton.on('update', (dt) => {
      playButton.velocity.y += 0.4 * dt
    })

    optionsButton.timeout(100, () => {
      optionsButton.interactive = false
      optionsButton.on('update', (dt) => {
        optionsButton.velocity.y += 0.4 * dt
      })
    })

    for (let i = 0; i < logo.length; i++) {
      logo[i].on('update', (dt) => {
        logo[i].alpha -= 0.04 * (1 + i) * dt
      })
    }

    playButton.timeout(400, next)
  }
})
