var utils = require('../utils');
var flashComponent = require('../mixins/flash');

var Stone1 = function (game) {
    Phaser.Sprite.call(this, game, 250, 250, 'stone1');
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.animations.add('rotate', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 12, true);
    this.animations.play('rotate');

    this.anchor.setTo(0.5);

    this.body.velocity.setTo(game.rnd.integerInRange(-100, 100), game.rnd.integerInRange(-100, 100));
    this.body.setSize(55, 55, 0, 0);

    this.setSize(2);

    this.flashComponent = flashComponent.create(this, this.animations.getAnimation('rotate'));
};

Stone1.prototype = Object.create(Phaser.Sprite.prototype);
Stone1.prototype.constructor = Stone1;

Stone1.prototype.update = function () {
    utils.screenWrap(this.game, this);
};

Stone1.prototype.setSize = function (newSize) {
    this.scale.setTo(0.5);
};

module.exports = Stone1;
