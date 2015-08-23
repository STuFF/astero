# astero
Asteroid Clone made with ❤ [Phaser](http://phaser.io/) ❤

Game done in 20 hours of work approximately.

Heavily based on the [asteroids movement Phaser sample](http://phaser.io/examples/v2/arcade-physics/asteroids-movement)

Sprites of explosions / ship / bullets from Xenon II amiga version by the great Bitmap Brothers

Sprite of the rock from... somewhere on the Internet (sorry)

Enjoy


## Build
This project use commonjs modules, install [Browserify](http://browserify.org/) and type in the root of the project
```
 browserify js/astero.js -o astero.js
```

You have to serve the whole root dir with a http server because of the assets ajax loading and open the index.html in your browser
