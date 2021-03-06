import * as fae from 'fae'
import ga from 'gameanalytics'
import { app } from './app'
import * as fs from './fullscreen'

import { purseIconTemplate } from './purse'
import { playerTemplate } from './player/player'
import { waves } from './enemies/waves'

let guiTex

let player, scoreCounter, goldCounter, healthPotionCounter, manaPotionCounter, pauseButton, statusIndicators

app.scene('main', {
  enter () {
    ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Start, 'main')

    app.resources.soundBGLoop.sound.play()

    player = app.e(playerTemplate)
    app.player = player
    app.score = 0

    const enemySpawner = app.e({
      ready () {
        this.currentWave = 0

        this.spawnNextWave = () => {
          if (app.exitingScene) return

          this.currentWave++
          app.event.emit('spawningwave', this.currentWave)

          if (waves[this.currentWave] && waves[this.currentWave].spawn) {
            this.lastExistingWave = this.currentWave
            waves[this.currentWave].spawn(this.spawnNextWave, this.currentWave)
          } else {
            waves[this.lastExistingWave].spawn(this.spawnNextWave, this.currentWave)
          }
        }

        // Next wave is 1 in this case
        // There is no wave 0
        this.timeout(500, this.spawnNextWave)
      }
    })

    app.stage.gui.alpha = 0
    const fadeIn = (dt) => {
      if (app.stage.gui.alpha < 1) app.stage.gui.alpha += 0.05 * dt
      else {
        app.stage.gui.alpha = 1
        app.event.removeListener('update', fadeIn)
      }
    }
    app.event.on('update', fadeIn)

    guiTex = app.resources.gui.textures

    const settingsContainer = app.e({
      components: ['motion'],
      parent: app.stage.gui,

      ready () {
        this.visible = false
      }
    })

    let pauseTime = performance.now()

    pauseButton = app.e({
      components: ['sprite', 'motion'],
      parent: app.stage.gui,

      ready () {
        this.sprite.texture = guiTex['pause-button.png']
        this.position = new fae.Vector(97, 4)

        this.interactive = true
        this.buttonMode = true

        this.on('pointertap', () => {
          if (app.ticker.started) {
            app.resources.soundPause.sound.play()
            app.resources.soundBGLoop.sound.stop()

            this.sprite.texture = guiTex['unpause-button.png']
            settingsContainer.visible = true

            pauseTime = performance.now()
            app.ticker.stop()
            app.ticker.update(pauseTime)
          } else {
            app.resources.soundUnpause.sound.play()
            app.resources.soundBGLoop.sound.play()

            this.sprite.texture = guiTex['pause-button.png']
            settingsContainer.visible = false

            app.ticker.start()
          }
        })
      }
    })

    app.e({
      components: ['sprite'],
      parent: settingsContainer,

      ready () {
        this.sprite.texture = guiTex['enter-fullscreen-button.png']
        this.position = new fae.Vector(85, 4)

        this.interactive = true
        this.buttonMode = true

        this.on('pointertap', () => {
          app.resources.soundButton.sound.play()
          if (!fs.isFullscreen(app.view)) {
            fs.enterFullscreen(app.view)
            this.sprite.texture = guiTex['exit-fullscreen-button.png']
          } else {
            fs.exitFullscreen()
            this.sprite.texture = guiTex['enter-fullscreen-button.png']
          }
          app.ticker.update(pauseTime += 0.1)
        })
      }
    })

    app.e({
      components: ['sprite'],
      parent: settingsContainer,

      ready () {
        this.sprite.texture = guiTex[app.settings.musicMuted ? 'unmute-music-button.png' : 'mute-music-button.png']
        this.position = new fae.Vector(12, 4)

        this.interactive = true
        this.buttonMode = true

        this.on('pointertap', () => {
          app.resources.soundButton.sound.play()
          if (app.settings.musicMuted) {
            app.resources.soundBGLoop.sound.volume = app.settings.musicVolume
            app.settings.musicMuted = false
            this.sprite.texture = guiTex['mute-music-button.png']
          } else {
            app.resources.soundBGLoop.sound.volume = 0
            app.settings.musicMuted = true
            this.sprite.texture = guiTex['unmute-music-button.png']
          }
          app.ticker.update(pauseTime += 0.1)
        })
      }
    })

    app.e({
      components: ['sprite'],
      parent: settingsContainer,

      ready () {
        this.sprite.texture = guiTex[PIXI.sound.volumeAll < app.settings.soundVolume ? 'unmute-sound-button.png' : 'mute-sound-button.png']
        this.position = new fae.Vector(24, 4)

        this.interactive = true
        this.buttonMode = true

        this.on('pointertap', () => {
          app.resources.soundButton.sound.play()
          if (PIXI.sound.volumeAll < app.settings.soundVolume) {
            PIXI.sound.volumeAll = app.settings.soundVolume
            app.resources.soundBGLoop.sound.volume = app.settings.musicVolume * !app.settings.musicMuted
            this.sprite.texture = guiTex['mute-sound-button.png']
          } else {
            PIXI.sound.volumeAll = app.settings.soundVolume / 1000
            app.resources.soundBGLoop.sound.volume = app.settings.musicVolume * !app.settings.musicMuted * 1000
            this.sprite.texture = guiTex['unmute-sound-button.png']
          }
          app.ticker.update(pauseTime += 0.1)
        })
      }
    })

    scoreCounter = app.e({
      components: ['motion', 'mediumText'],
      parent: app.stage.gui,

      ready () {
        this.text.tint = 0xccd5ff
        this.stroke.color = 0x505ea1

        this.y = -2
      },

      update (dt) {
        this.setText(app.score)
        this.x = 60 - this.text.textWidth / 2
      }
    })

    goldCounter = app.e({
      components: ['motion', 'mediumText'],
      parent: app.stage.gui,

      ready () {
        this.icon = app.e(purseIconTemplate)
        this.addChild(this.icon)

        this.text.tint = 0xffce7a
        this.stroke.color = 0xfbae2b

        this.y = 146
        this.text.y = -10
        this.stroke.y = -10
      },

      update (dt) {
        this.setText(app.purse.gold)
        this.x = 88 - this.width / 2 + this.icon.width
      }
    })

    healthPotionCounter = app.e({
      components: ['motion', 'mediumText'],
      parent: app.stage.gui,

      ready () {
        this.icon = app.e({
          components: ['sprite'],
          ready () {
            this.sprite.texture = guiTex['potion-health.png']
            this.sprite.anchor.set(0, 0.5)
          }
        })
        this.addChild(this.icon)

        this.text.tint = 0xff9daa
        this.stroke.color = 0xf64f5e

        this.position = new fae.Vector(80, 122)
        this.icon.position = new fae.Vector(-14, 10)
      },

      update (dt) {
        this.setText(app.purse.potions.health)
      }
    })

    manaPotionCounter = app.e({
      components: ['motion', 'mediumText'],
      parent: app.stage.gui,

      ready () {
        this.icon = app.e({
          components: ['sprite'],
          ready () {
            this.sprite.texture = guiTex['potion-mana.png']
            this.sprite.anchor.set(0, 0.5)
          }
        })
        this.addChild(this.icon)

        this.text.tint = 0xafe1ff
        this.stroke.color = 0x4a9ef1

        this.position = new fae.Vector(100, 122)
        this.icon.position = new fae.Vector(-14, 10)
      },

      update (dt) {
        this.setText(app.purse.potions.mana)
      }
    })

    statusIndicators = []
    for (let i = 0; i < 3; i++) {
      statusIndicators.push(app.e({
        components: ['sprite', 'motion'],
        parent: app.stage.gui,

        ready () {
          this.sprite.texture = guiTex['full-crystal.png']
          this.position = new fae.Vector(15 + (i * 12), 129)
        },

        update (dt) {
          let tex = (player.mana < i + 1) ? 'empty' : 'full'
          this.sprite.texture = guiTex[tex + '-crystal.png']
        }
      }))

      statusIndicators.push(app.e({
        components: ['sprite', 'motion'],
        parent: app.stage.gui,

        ready () {
          this.sprite.texture = guiTex['full-heart.png']
          this.position = new fae.Vector(15 + (i * 12), 141)
        },

        update (dt) {
          let tex = (player.health < i + 1) ? 'empty' : 'full'
          this.sprite.texture = guiTex[tex + '-heart.png']
        }
      }))
    }
  },

  exit (next) {
    const addProgressEvent = ga.GameAnalytics.addProgressionEvent
    const status = ga.EGAProgressionStatus

    if (app.score > app.highScore) {
      app.highScore = app.score
      window.localStorage.setItem('catacombChaosHighScore', app.highScore)
      addProgressEvent(status.Complete, 'main', null, null, app.score)
    } else {
      addProgressEvent(status.Fail, 'main', null, null, app.score)
    }

    app.resources.soundBGLoop.sound.stop()
    app.resources.soundDeath.sound.play()

    for (const entity of app.stage.world.children) {
      entity.emit('kill')
    }

    const animateOut = (entity) => {
      entity.on('update', (dt) => {
        entity.velocity.y += 0.2 * dt
      })
    }

    let t = 0
    for (const i of [5, 3, 1, 0, 2, 4]) {
      statusIndicators[i].timeout(t * 50, animateOut, statusIndicators[i])
      t++
    }

    pauseButton.on('update', (dt) => {
      pauseButton.velocity.y -= 0.1 * dt
    })
    scoreCounter.on('update', (dt) => {
      scoreCounter.velocity.y -= 0.2 * dt
    })
    goldCounter.on('update', (dt) => {
      goldCounter.velocity.y += 0.2 * dt
    })
    healthPotionCounter.on('update', (dt) => {
      healthPotionCounter.velocity.y += 0.1 * dt
    })
    manaPotionCounter.on('update', (dt) => {
      manaPotionCounter.velocity.y += 0.15 * dt
    })

    const skull = app.e({
      components: ['sprite'],
      parent: app.stage.gui,

      ready () {
        this.sprite.texture = guiTex['logo-skull.png']
        this.y = 32

        this.alpha = 0
        this.fadingIn = true

        this.timeout(1000, 'fadeout')

        this.timer = 0
      },

      update (dt) {
        if (this.fadingIn) {
          this.alpha += 0.08 * dt
        } else {
          this.alpha -= 0.03 * dt

          if (this.alpha <= 0) next()
        }

        this.y = 32 + 3 * Math.sin(this.timer)
        this.timer += dt / 60 * 2
      },

      fadeout () {
        this.alpha = 1
        this.fadingIn = false
      }
    })
  }
})
