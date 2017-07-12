import { app } from '../app'
import { skeletonTemplate } from './skeleton'
import { ghostSkeletonTemplate } from './ghost-skeleton'
import { archerTemplate } from './archer'

export const waves = {
  // Intro/tutorial waves
  1: {
    spawn (next) {
      // TODO: Teach how to shoot and guide fireballs
      next()
    }
  },

  2: {
    spawn (next) {
      // Introduce skeleton
      const skeleton = app.e(skeletonTemplate)
      skeleton.x = 60
      skeleton.y = 24
      skeleton.on('kill', next)
    }
  },

  3: {
    spawn (next) {
      // Introduce archer
      const archer = app.e(archerTemplate)
      archer.x = 30
      archer.y = 40
      archer.on('kill', next)
    }
  },

  // Normal waves
  4: {
    spawn (next, currentWave) {
      let n = 4
      let ghostThreshold = n

      if (currentWave >= 6) ghostThreshold--
      // if (currentWave >= 9) ghostThreshold--;

      for (let i = 0; i < n; i++) {
        const template = i < ghostThreshold ? skeletonTemplate : ghostSkeletonTemplate
        const skeleton = app.e(template)
        skeleton.x = Math.random() * (100 - 20) + 20
        skeleton.y = Math.random() * (24 - 16) + 16
      }

      if (app.groups.archer.size < 3) {
        const archer = app.e(archerTemplate)
        archer.x = Math.random() * (100 - 20) + 20
        archer.y = Math.random() * (48 - 32) + 32
      }

      app.e({
        ready () {
          this.timeout(2500, next)
          app.event.once('spawningwave', () => {
            this.destroy()
          })
        }
      })
    }
  }
}
