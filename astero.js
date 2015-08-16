(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MainShip = require('./prefabs/MainShip');
var Stone1 = require('./prefabs/Stone1');

var game = new Phaser.Game(500, 500, Phaser.AUTO, 'ASTERO', { preload: preload, create: create, update: update, render: render });
var ship;
var stonesGroup;
var mainShip;

function preload() {
    game.load.spritesheet('ship', 'assets/sprites/ship.png', 32, 36);
    game.load.spritesheet('bullet', 'assets/sprites/bullet.png', 16, 16);
    game.load.spritesheet('stone1', 'assets/sprites/stone1.png', 72, 72);
    game.load.spritesheet('shipexplode', 'assets/sprites/shipexplode.png', 32, 32);
}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    stonesGroup = game.add.group();

    stonesGroup.add(new Stone1(game));
    stonesGroup.add(new Stone1(game));
    stonesGroup.add(new Stone1(game));

    //ship = game.add.sprite(200, 200, 'ship');
    //ship.anchor.setTo(0.5);
    //game.physics.enable(ship, Phaser.Physics.ARCADE);
    //
    //ship.body.drag.set(100);
    //ship.body.maxVelocity.set(300);


    mainShip = new MainShip(game, 40, 40);

    //  Game input
    //cursors = game.input.keyboard.createCursorKeys();
    //game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
}


function update() {
    game.physics.arcade.overlap(mainShip, stonesGroup, function (a, b) {
        console.log('ok');
        mainShip.explode();
    }, null, this);




    //if (cursors.up.isDown)
    //{
    //    game.physics.arcade.accelerationFromRotation((ship.rotation - Phaser.Math.degToRad(90)), 200, ship.body.acceleration);
    //}
    //else
    //{
    //    ship.body.acceleration.set(0);
    //}
    //
    //if (cursors.left.isDown)
    //{
    //    ship.body.angularVelocity = -300;
    //}
    //else if (cursors.right.isDown)
    //{
    //    ship.body.angularVelocity = 300;
    //}
    //else
    //{
    //    ship.body.angularVelocity = 0;
    //}
    //
    //utils.screenWrap(game, ship);

}

function render () {
    //game.debug.body(mainShip);
    //stonesGroup.forEach(function (stone) {
    //    game.debug.body(stone);
    //})
}

},{"./prefabs/MainShip":3,"./prefabs/Stone1":4}],2:[function(require,module,exports){
var utils = require('../utils');

var Bullet = function (game) {
    Phaser.Sprite.call(this, game, 200, 200, 'bullet');
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.animations.add('fireing', [0, 1, 2, 1, 0], 20, true);
    this.animations.play('fireing');

    this.anchor.setTo(0.5);
    //this.body.drag.set(100);
    //this.body.maxVelocity.set(300);

    this.kill();
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function () {
    utils.screenWrap(this.game, this);
};

module.exports = Bullet;

},{"../utils":5}],3:[function(require,module,exports){
var utils = require('../utils');
var Bullet = require('../prefabs/Bullet');

var MainShip = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'ship');
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.exploding = false;
    this.bulletTime = 0;
    this.anchor.setTo(0.5);
    this.body.drag.set(100);
    this.body.maxVelocity.set(300);

    this.animations.add('idle', [0]);
    this.animations.add('burst', [1, 2, 3, 2, 1], 20, true);
    this.animations.play('idle');

    this.group = this.game.add.group();

    this.game = game;
    this.z = 6;

    this.bulletsGroup = this._createBulletsGroup();
    this.explosion = this._createExplode();

    this.body.setSize(30, 30, 0, 0);

    this.group.add(this.explosion);
    this.group.add(this);

    this.cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    game.add.existing(this.group);
};

MainShip.prototype = Object.create(Phaser.Sprite.prototype);
MainShip.prototype.constructor = MainShip;

MainShip.prototype._createExplode = function () {
    var //group = this.game.add.group();
        explode = new Phaser.Sprite(this.game, 0, 0, 'shipexplode');

    explode.animations.add('explode', null, 20);
    //explode.animations.play('explode');
    explode.anchor.setTo(0.5);
    explode.kill();

    //group.add(explode);
    //this.game.add.existing(group);
    //this.explosionGroup = group;
    return explode;
};

MainShip.prototype._createBulletsGroup = function () {
    var bulletsGroup = this.game.add.group(),
        bulletSprites = [];

    bulletsGroup.enableBody = true;
    bulletsGroup.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i <= 40; i += 1) {
        bulletSprites.push(new Bullet(this.game));
    }

    bulletsGroup.addMultiple(bulletSprites);

    return bulletsGroup;

};

MainShip.prototype.explode = function () {
    if (this.exploding) {
        return;
    }
    this.exploding = true;
    this.kill();
    this.group.bringToTop(this.explosion);
    this.explosion.reset(this.body.x + 16, this.body.y + 16);
    this.explosion.play('explode', null, false, true);
};

MainShip.prototype.fireBullet = function () {
    var bullet;

    if (this.game.time.now > this.bulletTime) {
        bullet = this.bulletsGroup.getFirstExists(false);

        if (bullet) {
            bullet.reset(this.body.x + 16, this.body.y + 16);
            bullet.lifespan = 2000;
            bullet.rotation = this.rotation;
            this.game.physics.arcade.velocityFromRotation((this.rotation - Phaser.Math.degToRad(90)), 400, bullet.body.velocity);
            this.bulletTime = this.game.time.now + 150;
        }
    }
};

MainShip.prototype.update = function () {
    var cursors = this.cursors,
        game = this.game;

    if (cursors.up.isDown) {
        game.physics.arcade.accelerationFromRotation((this.rotation - Phaser.Math.degToRad(90)), 200, this.body.acceleration);
        this.animations.play('burst');
    } else {
        this.body.acceleration.set(0);
        this.animations.play('idle');
    }

    if (cursors.left.isDown) {
        this.body.angularVelocity = -300;
    } else if (cursors.right.isDown) {
        this.body.angularVelocity = 300;
    } else {
        this.body.angularVelocity = 0;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        this.fireBullet();
    }

    utils.screenWrap(this.game, this);
};

module.exports = MainShip;

},{"../prefabs/Bullet":2,"../utils":5}],4:[function(require,module,exports){
var utils = require('../utils');

var Stone1 = function (game) {
    Phaser.Sprite.call(this, game, 250, 250, 'stone1');
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.animations.add('rotate', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 12, true);
    this.animations.play('rotate');

    this.anchor.setTo(0.5);

    this.body.velocity.setTo(game.rnd.integerInRange(-100, 100), game.rnd.integerInRange(-100, 100));
    this.body.setSize(55, 55, 0, 0);
};

Stone1.prototype = Object.create(Phaser.Sprite.prototype);
Stone1.prototype.constructor = Stone1;

Stone1.prototype.update = function () {
    utils.screenWrap(this.game, this);
};

module.exports = Stone1;

},{"../utils":5}],5:[function(require,module,exports){
var utils = {};

utils.screenWrap = function (game, sprite) {
    if (sprite.x < 0)
    {
        sprite.x = game.width;
    }
    else if (sprite.x > game.width)
    {
        sprite.x = 0;
    }

    if (sprite.y < 0)
    {
        sprite.y = game.height;
    }
    else if (sprite.y > game.height)
    {
        sprite.y = 0;
    }
};

module.exports = utils;


},{}]},{},[1]);
