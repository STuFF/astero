var utils = require('../utils');
var flashComponent = require('../mixins/flash');
var explodeComponent = require('../mixins/explode');

var Stone1 = function (game, x, y, size) {
    Phaser.Sprite.call(this, game, x, y, 'stone1');
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.animations.add('rotate', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 12, true);
    this.animations.play('rotate');

    this.anchor.setTo(0.5);

    this.body.setSize(55, 55, 0, 0);

    this.setSize(size);

    this.flashComponent = flashComponent.create(this, this.animations.getAnimation('rotate'));
    this.explodeComponent = explodeComponent.create(this, 'shipexplode');

    this.explodeEvent = new Phaser.Signal();

    this.kill();
};

Stone1.prototype = Object.create(Phaser.Sprite.prototype);
Stone1.prototype.constructor = Stone1;

Stone1.prototype.resetStone = function (x, y, newSize) {
    this.reset(x, y);
    this.setSize(newSize);
};

Stone1.prototype.setSize = function (newSize) {
    var game = this.game;

    this.stonesize = (typeof newSize === 'number') ? newSize : 0;

    if (newSize === 2) {
        this.scale.setTo(0.5);
        this.body.velocity.setTo(game.rnd.integerInRange(-100, 100), game.rnd.integerInRange(-100, 100));
    } else if (newSize === 1) {
        this.scale.setTo(0.75);
        this.body.velocity.setTo(game.rnd.integerInRange(-75, 75), game.rnd.integerInRange(-75, 75));
    } else if (newSize === 0) {
        this.scale.setTo(1);
        this.body.velocity.setTo(game.rnd.integerInRange(-50, 50), game.rnd.integerInRange(-50, 50));
    }
};

Stone1.prototype.update = function () {
    utils.screenWrap(this.game, this);
};

Stone1.prototype.hit = function () {
    this.explode();
};

Stone1.prototype.explode = function () {
    this.explodeEvent.dispatch(this);
    this.explodeComponent.explode();
};

module.exports = Stone1;
