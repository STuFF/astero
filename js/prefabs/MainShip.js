var utils = require('../utils');
var Bullet = require('../prefabs/Bullet');
var explodeComponent = require('../mixins/explode');

var MainShip = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'ship');
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.explodeComponent = explodeComponent.create(this, 'shipexplode');

    this.bulletTime = 0;
    this.anchor.setTo(0.5);
    this.body.drag.set(100);
    this.body.maxVelocity.set(300);

    this.animations.add('idle', [0]);
    this.animations.add('burst', [1, 2, 3, 2, 1], 20, true);
    this.animations.play('idle');

    this.game = game;
    this.z = 6;

    this.bulletsGroup = this._createBulletsGroup();

    this.body.setSize(30, 30, 0, 0);

    this.cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    game.add.existing(this);
};

MainShip.prototype = Object.create(Phaser.Sprite.prototype);
MainShip.prototype.constructor = MainShip;

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
    this.explodeComponent.explode();
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
