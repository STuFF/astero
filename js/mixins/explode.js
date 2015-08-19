var ExplodeComponent = function (from, sprite) {
    this.from = from;
    this.explosion = this._createExplode(sprite);
};

ExplodeComponent.prototype._createExplode = function (sprite) {
    var explode = new Phaser.Sprite(this.from.game, 0, 0, sprite);

    explode.animations.add('explode', null, 20);
    explode.anchor.setTo(0.5);
    this.from.game.add.existing(explode);
    explode.kill();

    return explode;
};

ExplodeComponent.prototype.explode = function () {
    this.from.kill();
    this.explosion.reset(this.from.body.x + (this.from.body.width / 2), this.from.body.y + (this.from.body.height / 2));
    this.explosion.play('explode', null, false, true);
};


module.exports = {
    create: function (from, sprite) {
        return new ExplodeComponent(from, sprite);
    }
};
