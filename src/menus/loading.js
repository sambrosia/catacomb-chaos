import * as fae from 'fae'
import { app } from '../app'

import { makeDungeon } from '../dungeon'
import '../menus/menu'

function load () {
  const startTime = new Date().getTime()

  app.loader
  .add('fontSharpRetro', 'fonts/Sharp-Retro.xml')
  .add('gui', 'sprites/gui/spritesheet.json')

  .add('dungeon', 'sprites/dungeon/spritesheet.json')
  .add('mage', 'sprites/mage/spritesheet.json')
  .add('skeleton', 'sprites/skeleton/spritesheet.json')
  .add('archer', 'sprites/archer/spritesheet.json')
  .add('misc', 'sprites/misc/spritesheet.json')

  .add('soundHurt', 'sounds/hurt.mp3')
  .add('soundDeath', 'sounds/death.mp3')
  .add('soundFireball', 'sounds/foom.mp3')
  .add('soundExplosion1', 'sounds/explosion1.mp3')
  .add('soundExplosion2', 'sounds/explosion2.mp3')
  .add('soundExplosion3', 'sounds/explosion3.mp3')
  .add('soundExplosion4', 'sounds/explosion4.mp3')
  .add('soundPotion', 'sounds/potion.mp3')
  .add('soundCoin', 'sounds/coin.mp3')
  .add('soundSpendCoin', 'sounds/spendcoin.mp3')

  .add('soundArrowBurn', 'sounds/arrowburn.mp3')
  .add('soundArrowShoot', 'sounds/arrowshoot.mp3')
  .add('soundSkeletonSpawn', 'sounds/skeletonspawn.mp3')

  .add('soundBGLoop', 'sounds/music.mp3')

  .add('soundButton', 'sounds/button.mp3')
  .add('soundNegative', 'sounds/negative.mp3')
  .add('soundUnpause', 'sounds/unpause.mp3')
  .add('soundPause', 'sounds/pause.mp3')

  .use((res, next) => {
    if (res.extension === 'json') {
      const keys = []
      for (const key in res.textures) keys.push(key)
      keys.sort()

      res.array = []
      for (const key of keys) res.array.push(res.textures[key])
    }
    next()
  })

  .load((loader, resources) => {
    PIXI.sound.volumeAll = app.settings.soundVolume

    resources.soundBGLoop.sound.singleInstance = true
    resources.soundBGLoop.sound.loop = true
    resources.soundBGLoop.sound.volume = app.settings.musicVolume

    resources.soundHurt.sound.volume = 2
    resources.soundDeath.sound.volume = 2
    resources.soundDeath.sound.speed = 0.75

    resources.soundExplosion1.sound.volume = 1.5
    resources.soundExplosion2.sound.volume = 1.5
    resources.soundExplosion3.sound.volume = 1.5
    resources.soundExplosion4.sound.volume = 1.5

    resources.soundArrowShoot.sound.volume = 2
    resources.soundSkeletonSpawn.sound.volume = 0.5

    const finishTime = new Date().getTime()
    console.log('Resources loaded in ', finishTime - startTime, 'ms')

    app.stage.dungeon.position = new fae.Vector(-4, 0)
    makeDungeon(8, 11)

    app.scene('menu')
  })
}

app.scene('loading', {
  enter () {
    app.loader.baseUrl = '/assets'

    app.loader
    .add('fontMinimal3x5', 'fonts/Minimal3x5.fnt')
    .load((loader, resources) => {
      app.e({
        components: ['smallText'],
        parent: app.stage.gui,
        ready () {
          this.setText('loading')
          this.position = new fae.Vector(60 - this.text.textWidth / 2, 80)
        }
      })

      load()
    })
  }
})
