var utils = require('../utils');
var explodeComponent = require('../mixins/explode');

var Bullet = function (game) {
    Phaser.Sprite.call(this, game, 200, 200, 'bullet');
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.explodeComponent = explodeComponent.create(this, 'bulletexplode');

    this.animations.add('fireing', [0, 1, 2, 1, 0], 20, true);
    this.animations.play('fireing');

    this.anchor.setTo(0.5);

    this.outOfBoundsKill = true;

    this.kill();
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

module.exports = Bullet;
