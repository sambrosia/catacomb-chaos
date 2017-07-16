import * as fae from 'fae'
import ga from 'gameanalytics'
import { smallText, mediumText, largeText } from './menus/text'
import Purse from './purse'

// TODO: Re-enable analytics

// Configure analytics
ga.logging.GALogger.debugEnabled = false
ga.GameAnalytics.setEnabledInfoLog(false)
ga.GameAnalytics.setEnabledVerboseLog(false)
// ga.GameAnalytics.setEnabledManualSessionHandling(true);

ga.GameAnalytics.configureBuild('html5 1.1.0')

// ga.GameAnalytics.initialize('6d7b36314a3779c2de7e46eb33a2d455', '4e4359337f0177622ef1f9dc5c2be18a1b50d5cb')

// ga.GameAnalytics.startSession();
// window.addEventListener("beforeunload", ga.GameAnalytics.endSession);
// window.addEventListener("unload", ga.GameAnalytics.endSession);

// Create application
export const app = new fae.Application(480, 640, {
  view: document.getElementById('catacomb-chaos-canvas'),
  backgroundColor: 0x40456c,
  resolution: 1
})

// Load custom components
app.c('smallText', smallText)
app.c('mediumText', mediumText)
app.c('largeText', largeText)

// Set up view stretching
function resize () {
  const parentWidth = app.view.parentElement.clientWidth
  const parentHeight = app.view.parentElement.clientHeight

  if (parentWidth > parentHeight * 0.75) {
    app.view.style.height = parentHeight + 'px'
    app.view.style.width = Math.round(app.view.clientHeight * 0.75) + 'px'
  } else {
    app.view.style.width = parentWidth + 'px'
    app.view.style.height = Math.round(app.view.clientWidth * (1 / 0.75)) + 'px'
  }

  window.requestAnimationFrame(resize)
}

resize()

// Scale world
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
app.stage.scale.set(4)

// Some PIXI layers
app.stage.removeChild(app.stage.particles)
app.stage.dungeon = app.stage.addChildAt(new PIXI.Container(), 0)
app.stage.world = app.stage.addChildAt(new PIXI.Container(), 1)
app.stage.effects = app.stage.addChildAt(new PIXI.Container(), 2)
app.stage.addChildAt(app.stage.particles, 3)
app.stage.gui = app.stage.addChildAt(new PIXI.Container(), 4)

app.stage.dungeon.interactiveChildren = false
app.stage.world.interactiveChildren = false
app.stage.effects.interactiveChildren = false

// Y-Sort characters
app.event.on('update', () => {
  app.stage.world.children.sort((a, b) => { return a.y - b.y })
})

app.score = 0
app.highScore = Number(localStorage.getItem('catacombChaosHighScore') || 0)
app.purse = new Purse(app)

app.settings = {
  musicMuted: false,
  musicVolume: 1.5,
  soundVolume: 0.1,
  fullscreen: false
}
