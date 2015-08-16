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
