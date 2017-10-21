# Catacomb Chaos
This is a so-called "HTML5 game" I wrote using an early version of [fae](https://github.com/sambrosia/fae). The code is a bit crude, but I think it's not bad for my first attempt at really pushing something to completion.

I had to figure out lots of things as I was going along, and it was a very valuable learning experience. I learned a lot about web technologies I hadn't used before.

**Read on for a bit of retrospection.**

## Making it better
#### webpack
If I were to improve this, knowing what I know today, I would start by setting up a proper webpack configuration to do the build. The config I set up back when I made this bundles and transpiles the JS (*but it looks like Babel isn't even set up properly*). Nothing else. All of the image assets, the HTML page the game lives in, et cetera, all need to be prepared by hand.

I would set up rules for importing the image, audio, and other assets, and [HTML Plugin](https://webpack.js.org/plugins/html-webpack-plugin/) for generating the markup. I would also fix up the transpilation and add polyfills to try to get better browser support.

#### UI
Next I would rewrite the UI using a small component-based UI framework like preact. The UI is currently built within the PIXI renderer, which lacks most of the power of the DOM and CSS. There were also browser-specific UI bugs caused by PIXI's text objects at the time I wrote the game.

Animation, layout, and everything really would be cleaner and easier with CSS.

#### Engine
The version of [fae](https://github.com/sambrosia/fae) I used was... kind of a mess. The architecture allowed me to abuse it in unspeakable ways. I made it work, but it's not pretty. The fact that there simply isn't a lot of code is probably the only thing that saved me.

I'd try to upgrade to the latest version of fae (*which enforces a more strict [ECS pattern](https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system) - [also related](http://gameprogrammingpatterns.com/component.html)*), refactoring where necessary.

#### And more
There plenty of other things I could and probably would do:
- Offline support
- Tests
- Dynamic resolution/aspect ratio (*currently it only works at one fixed resolution*)
- More gameplay (*more enemies, powers, etc.*)
- HMR for game logic? (*I'll have to experiment with this some time*)

## But why?
**"Why bother with all that work?"**, I hear you ask. **"The performance is good. No major bugs. The game seems to work fine, aside from not running in a handful major browsers."**, you say. Okay, you probably don't say that last one.

Rhetorical setup aside, the reason is productivity (*and browser support*). A good webpack setup allows for faster iteration and deploys. A UI framework allows for *way* faster creation and improvement of the interface.

(*The process of creating the UI with PIXI was so absolutely mindflaying that I would say it was the most difficult part of this project.*)

And finally the cleaner architecture that comes with upgrading fae would allow for faster development and iteration of gameplay.

It took me a couple of months to make Catacomb Chaos. I think I could do it in much less time today (*8-9 months later at time of writing*). I've learned so much since then that it would no doubt be a better final product, but I'm sure there would be new and exciting challenges.

Challenges that I look forward to facing in my current and future projects.
